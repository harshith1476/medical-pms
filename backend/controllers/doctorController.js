import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import * as queueService from '../services/queueService.js';
import { sendAppointmentCompletionEmail } from "../services/emailService.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel (legacy support - uses queue system)
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            // Use queue service to properly update status
            await queueService.updateAppointmentStatus(appointmentId, 'completed')
            
            // Update doctor status if this was the current appointment
            const doctor = await doctorModel.findById(docId)
            if (doctor?.currentAppointmentId === appointmentId) {
                await doctorModel.findByIdAndUpdate(docId, {
                    status: 'in-clinic',
                    currentAppointmentId: null
                })
            }

            // Send thank you email to patient
            try {
                const emailDetails = {
                    patientName: appointmentData.userData.name,
                    doctorName: appointmentData.docData.name,
                    speciality: appointmentData.docData.speciality,
                    date: appointmentData.slotDate,
                    time: appointmentData.slotTime
                };

                await sendAppointmentCompletionEmail(appointmentData.userData.email, emailDetails);
                console.log('✅ Thank you email sent to patient');
            } catch (emailError) {
                console.error('⚠️ Failed to send thank you email:', emailError.message);
                // Continue even if email fails
            }
            
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment not found' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// Removed: getDefaultAgeSymptomsBySpecialty and getDoctorAgeSymptoms (no longer needed - symptoms now based on specialization)

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get queue status for doctor
const getQueueStatus = async (req, res) => {
    try {
        const { docId } = req.body // Set by authDoctor middleware
        let { slotDate } = req.query

        if (!slotDate) {
            // Use today's date if not provided
            const today = new Date()
            const day = today.getDate()
            const month = today.getMonth() + 1
            const year = today.getFullYear()
            slotDate = `${day}_${month}_${year}`
        }

        const queueStatus = await queueService.getDoctorQueueStatus(docId, slotDate)
        const suggestions = await queueService.getSmartSchedulingSuggestions(docId, slotDate, queueStatus?.currentAppointmentId || null)
        const delayedAppointments = await queueService.checkDelayedAppointments(docId, slotDate)

        res.json({
            success: true,
            queueStatus: {
                ...queueStatus,
                docId: docId // Include docId in response
            },
            suggestions,
            delayedAppointments
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor status
const updateDoctorStatus = async (req, res) => {
    try {
        const { docId, status, breakDuration } = req.body

        const updateData = { status }
        
        if (status === 'on-break') {
            updateData.breakStartTime = Date.now()
            updateData.breakDuration = breakDuration || 15
        } else if (status === 'in-clinic') {
            updateData.breakStartTime = null
        }

        await doctorModel.findByIdAndUpdate(docId, updateData)
        res.json({ success: true, message: 'Status updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to start consultation (move patient to in-consult)
const startConsultation = async (req, res) => {
    try {
        const { docId } = req.body // Set by authDoctor middleware
        const { appointmentId } = req.body

        // Update appointment status
        await queueService.updateAppointmentStatus(appointmentId, 'in-consult')

        // Update doctor status and current appointment
        await doctorModel.findByIdAndUpdate(docId, {
            status: 'in-consult',
            currentAppointmentId: appointmentId
        })

        // Mark appointment as alerted
        await appointmentModel.findByIdAndUpdate(appointmentId, { alerted: true })

        res.json({ success: true, message: 'Consultation started' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to complete consultation and move to next
const completeConsultation = async (req, res) => {
    try {
        const { docId } = req.body // Set by authDoctor middleware
        const { appointmentId, markNoShow } = req.body

        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment || appointment.docId !== docId) {
            return res.json({ success: false, message: 'Invalid appointment' })
        }

        if (markNoShow) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {
                status: 'no-show',
                isCompleted: false
            })
        } else {
            await queueService.updateAppointmentStatus(appointmentId, 'completed')
            
            // Send thank you email to patient after successful completion
            try {
                const emailDetails = {
                    patientName: appointment.userData.name,
                    doctorName: appointment.docData.name,
                    speciality: appointment.docData.speciality,
                    date: appointment.slotDate,
                    time: appointment.slotTime
                };

                await sendAppointmentCompletionEmail(appointment.userData.email, emailDetails);
                console.log('✅ Thank you email sent to patient');
            } catch (emailError) {
                console.error('⚠️ Failed to send thank you email:', emailError.message);
                // Continue even if email fails
            }
        }

        // Update doctor status
        await doctorModel.findByIdAndUpdate(docId, {
            status: 'in-clinic',
            currentAppointmentId: null
        })

        // Get smart suggestions for next patient
        const slotDate = appointment.slotDate
        const suggestions = await queueService.getSmartSchedulingSuggestions(docId, slotDate, appointmentId)

        res.json({
            success: true,
            message: markNoShow ? 'Marked as no-show' : 'Consultation completed',
            suggestions
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to move appointment in queue (for smart scheduling)
const moveAppointmentInQueue = async (req, res) => {
    try {
        const { docId } = req.body // Set by authDoctor middleware
        const { appointmentId, newPosition } = req.body

        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment || appointment.docId !== docId) {
            return res.json({ success: false, message: 'Invalid appointment' })
        }

        // Get all appointments for the day
        const appointments = await appointmentModel.find({
            docId: docId,
            slotDate: appointment.slotDate,
            cancelled: false,
            isCompleted: false
        }).sort({ tokenNumber: 1 })

        // Reorder appointments
        const appointmentToMove = appointments.find(apt => apt._id.toString() === appointmentId)
        appointments.splice(appointments.indexOf(appointmentToMove), 1)
        appointments.splice(newPosition - 1, 0, appointmentToMove)

        // Update token numbers
        for (let i = 0; i < appointments.length; i++) {
            await appointmentModel.findByIdAndUpdate(appointments[i]._id, {
                tokenNumber: i + 1,
                queuePosition: i + 1
            })
        }

        res.json({ success: true, message: 'Appointment moved in queue' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get smart scheduling suggestions
const getSmartSuggestions = async (req, res) => {
    try {
        const { docId } = req.body
        const { slotDate, currentAppointmentId } = req.query

        if (!slotDate) {
            const today = new Date()
            const day = today.getDate()
            const month = today.getMonth() + 1
            const year = today.getFullYear()
            slotDate = `${day}_${month}_${year}`
        }

        const suggestions = await queueService.getSmartSchedulingSuggestions(
            docId,
            slotDate,
            currentAppointmentId || null
        )

        res.json({ success: true, suggestions })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    getQueueStatus,
    updateDoctorStatus,
    startConsultation,
    completeConsultation,
    moveAppointmentInQueue,
    getSmartSuggestions
    // Removed: getDoctorAgeSymptoms (no longer needed)
}