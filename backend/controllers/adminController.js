import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import { sendAppointmentCancellationEmail } from "../services/emailService.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        
        // Get appointment details before cancelling
        const appointmentData = await appointmentModel.findById(appointmentId)
        
        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        // Update appointment to cancelled
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true, status: 'cancelled' })

        // Send cancellation email to patient
        try {
            const emailDetails = {
                patientName: appointmentData.userData.name,
                doctorName: appointmentData.docData.name,
                speciality: appointmentData.docData.speciality,
                date: appointmentData.slotDate,
                time: appointmentData.slotTime,
                cancelledBy: 'Hospital Administration'
            };

            await sendAppointmentCancellationEmail(appointmentData.userData.email, emailDetails);
            console.log('✅ Cancellation email sent to patient');
        } catch (emailError) {
            console.error('⚠️ Failed to send cancellation email:', emailError.message);
            // Continue even if email fails - appointment is still cancelled
        }

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const allAppointments = await appointmentModel.find({})

        // Get today's date in DD_MM_YYYY format (matching slotDate format)
        const today = new Date()
        const day = String(today.getDate()).padStart(2, '0')
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const year = today.getFullYear()
        const todayStr = `${day}_${month}_${year}` // Format: DD_MM_YYYY
        
        // Get today's appointments (not cancelled)
        // Check appointments where slotDate matches today OR appointment was created today
        const todayAppointments = allAppointments.filter(apt => {
            if (apt.cancelled) return false
            
            // Check if slotDate matches today
            const appointmentDate = apt.slotDate
            if (appointmentDate === todayStr) return true
            
            // Also check if appointment was created today (for same-day bookings)
            const appointmentCreatedDate = new Date(apt.date)
            const createdDay = String(appointmentCreatedDate.getDate()).padStart(2, '0')
            const createdMonth = String(appointmentCreatedDate.getMonth() + 1).padStart(2, '0')
            const createdYear = appointmentCreatedDate.getFullYear()
            const createdDateStr = `${createdDay}_${createdMonth}_${createdYear}`
            
            return createdDateStr === todayStr
        })

        // Calculate today's unique patients (count unique userIds)
        const uniquePatientIds = new Set(todayAppointments.map(apt => apt.userId))
        const totalPatientsToday = uniquePatientIds.size

        // Calculate today's revenue (sum of amounts from non-cancelled appointments)
        const todayRevenue = todayAppointments.reduce((sum, apt) => {
            return sum + (apt.amount || 0)
        }, 0)

        // Calculate monthly revenue (appointments from current month, not cancelled)
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()
        const monthlyAppointments = allAppointments.filter(apt => {
            if (apt.cancelled) return false
            const aptDate = new Date(apt.date)
            return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear
        })
        const monthlyRevenue = monthlyAppointments.reduce((sum, apt) => sum + (apt.amount || 0), 0)

        // Calculate total revenue (all non-cancelled appointments)
        const totalRevenue = allAppointments
            .filter(apt => !apt.cancelled)
            .reduce((sum, apt) => sum + (apt.amount || 0), 0)

        // Get active doctors (available)
        const activeDoctors = doctors.filter(doc => doc.available).length

        // Calculate hourly data for charts (last 24 hours)
        const now = new Date()
        
        // Initialize hourly arrays with zeros (24 hours)
        const hourlyPatients = new Array(24).fill(0)
        const hourlyRevenue = new Array(24).fill(0)
        const hourlyAppointments = new Array(24).fill(0)
        const hourLabels = []

        // Generate hour labels (last 24 hours, oldest to newest)
        for (let i = 0; i < 24; i++) {
            const hour = new Date(now)
            hour.setHours(now.getHours() - (23 - i))
            hour.setMinutes(0)
            hour.setSeconds(0)
            hour.setMilliseconds(0)
            
            const label = hour.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            })
            hourLabels.push(label)
        }

        // Process all non-cancelled appointments from last 24 hours
        allAppointments
            .filter(apt => !apt.cancelled)
            .forEach(apt => {
                const aptDate = new Date(apt.date)
                const hoursDiff = (now - aptDate) / (1000 * 60 * 60) // Hours difference
                
                // Only include appointments from last 24 hours
                if (hoursDiff >= 0 && hoursDiff < 24) {
                    // Calculate which hour bucket this appointment belongs to
                    // hoursDiff = 0 means current hour, 23 means 23 hours ago
                    const hourIndex = Math.floor(hoursDiff)
                    const arrayIndex = 23 - hourIndex // arrayIndex 0 = 23 hours ago, 23 = current hour
                    
                    if (arrayIndex >= 0 && arrayIndex < 24) {
                        hourlyAppointments[arrayIndex]++
                        hourlyRevenue[arrayIndex] += (apt.amount || 0)
                        hourlyPatients[arrayIndex]++ // Count patient visits per hour
                    }
                }
            })

        const dashData = {
            doctors: doctors.length,
            activeDoctors: activeDoctors,
            appointments: allAppointments.length,
            appointmentsToday: todayAppointments.length,
            patients: users.length,
            patientsToday: totalPatientsToday, // Unique patients who booked today
            revenueToday: todayRevenue,
            revenueMonthly: monthlyRevenue,
            revenueTotal: totalRevenue,
            latestAppointments: allAppointments.reverse().slice(0, 10), // Latest 10 appointments
            // Chart data (last 24 hours)
            chartData: {
                patientGrowth: {
                    labels: hourLabels,
                    values: hourlyPatients
                },
                revenue: {
                    labels: hourLabels,
                    values: hourlyRevenue
                },
                appointments: {
                    labels: hourLabels,
                    values: hourlyAppointments
                }
            }
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to delete all appointments
const deleteAllAppointments = async (req, res) => {
    try {
        // Get count before deletion
        const countBefore = await appointmentModel.countDocuments({})
        
        // Delete all appointments
        const result = await appointmentModel.deleteMany({})
        
        // Also clear all doctor slots
        const doctors = await doctorModel.find({})
        for (const doctor of doctors) {
            await doctorModel.findByIdAndUpdate(doctor._id, { slots_booked: {} })
        }

        console.log(`✅ Deleted ${result.deletedCount} appointments`)

        res.json({ 
            success: true, 
            message: `Successfully deleted ${result.deletedCount} appointments`,
            deletedCount: result.deletedCount
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
    deleteAllAppointments
}