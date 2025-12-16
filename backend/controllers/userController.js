import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendContactMessage } from "../services/emailService.js";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import razorpay from 'razorpay';
import { sendPasswordResetOTP, sendPasswordResetConfirmation, sendAppointmentConfirmation } from '../services/emailService.js';

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password, phone, dob, gender, bloodGroup } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // Calculate age from DOB if provided
        let calculatedAge = null;
        if (dob) {
            const today = new Date();
            const birthDate = new Date(dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            calculatedAge = age > 0 ? age : null;
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
            phone: phone || '000000000',
            dob: dob || 'Not Selected',
            age: calculatedAge,
            gender: gender || 'Not Selected',
            bloodGroup: bloodGroup || '',
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        // Handle MongoDB duplicate key error for userId index
        if (error.code === 11000 && error.keyPattern?.userId) {
            return res.json({ 
                success: false, 
                message: 'Database configuration error. Please contact administrator or try again.' 
            })
        }
        // Handle MongoDB duplicate email error
        if (error.code === 11000 && error.keyPattern?.email) {
            return res.json({ 
                success: false, 
                message: 'Email already exists. Please use a different email or login instead.' 
            })
        }
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender, bloodGroup } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        // Calculate age from DOB
        let calculatedAge = null;
        if (dob && dob !== 'Not Selected') {
            const today = new Date();
            const birthDate = new Date(dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            calculatedAge = age > 0 ? age : null;
        }

        await userModel.findByIdAndUpdate(userId, { 
            name, 
            phone, 
            address: JSON.parse(address), 
            dob, 
            gender,
            age: calculatedAge,
            bloodGroup: bloodGroup || ''
        })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime, symptoms, actualPatient } = req.body
        const prescriptionFile = req.file
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        // Parse actualPatient if it's a JSON string
        let parsedActualPatient = null
        if (actualPatient) {
            try {
                parsedActualPatient = typeof actualPatient === 'string' ? JSON.parse(actualPatient) : actualPatient
            } catch (e) {
                parsedActualPatient = actualPatient
            }
        }

        // Upload prescription if provided
        let prescriptionUrl = ''
        if (prescriptionFile) {
            try {
                const prescriptionUpload = await cloudinary.uploader.upload(prescriptionFile.path, {
                    resource_type: prescriptionFile.mimetype.includes('pdf') ? 'raw' : 'image',
                    folder: 'prescriptions'
                })
                prescriptionUrl = prescriptionUpload.secure_url
            } catch (uploadError) {
                console.error('Error uploading prescription:', uploadError)
                // Continue without prescription if upload fails
            }
        }

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
            selectedSymptoms: symptoms || [], // Store selected symptoms
            actualPatient: parsedActualPatient || {
                name: userData.name || '',
                age: userData.age || '',
                gender: userData.gender || '',
                relationship: 'Self',
                medicalHistory: [],
                symptoms: '',
                phone: userData.phone || '',
                isSelf: true
            },
            recentPrescription: prescriptionUrl
        }

        // Assign token number and calculate queue position
        const { assignTokenNumber, calculateQueuePosition } = await import('../services/queueService.js')
        const tokenNumber = await assignTokenNumber(docId, slotDate)
        appointmentData.tokenNumber = tokenNumber
        appointmentData.status = 'pending'
        appointmentData.queuePosition = null

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // Calculate queue position and wait time
        const queueInfo = await calculateQueuePosition(newAppointment._id.toString(), docId, slotDate)
        if (queueInfo) {
            await appointmentModel.findByIdAndUpdate(newAppointment._id, {
                queuePosition: queueInfo.queuePosition,
                estimatedWaitTime: queueInfo.estimatedWaitTime,
                status: 'in-queue'
            })
        }

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        // Format date for SMS message
        const dateArray = slotDate.split('_')
        const day = dateArray[0]
        const month = dateArray[1]
        const year = dateArray[2]
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const formattedDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`
        
        // Get doctor's address for location
        const doctorAddress = docData.address || {}
        const addressLine1 = doctorAddress.line1 || ''
        const addressLine2 = doctorAddress.line2 || ''
        const fullAddress = `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}`.trim()
        
        // Create Google Maps search URL for doctor's location
        const locationQuery = encodeURIComponent(fullAddress || `${docData.name} ${docData.speciality}`)
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`
        
        // Prepare appointment data for notifications
        // Use actual patient name if booking for someone else
        const actualPatientName = parsedActualPatient && !parsedActualPatient.isSelf 
            ? parsedActualPatient.name 
            : userData.name

        const appointmentNotificationData = {
            patientName: actualPatientName,
            accountHolderName: userData.name, // Who booked the appointment
            actualPatient: parsedActualPatient, // Full patient details
            doctorName: docData.name,
            speciality: docData.speciality,
            date: formattedDate,
            time: slotTime,
            fee: docData.fees,
            hospitalAddress: fullAddress || 'MediChain Hospital',
            googleMapsLink: googleMapsUrl,
            tokenNumber: tokenNumber
        }

        // Send Email notification to patient
        const userEmail = userData.email
        if (userEmail) {
            try {
                console.log(`\n📧 Sending appointment confirmation email to: ${userEmail}`)
                const emailResult = await sendAppointmentConfirmation(userEmail, appointmentNotificationData)
                
                if (emailResult.success) {
                    console.log(`✅ Appointment confirmation email sent successfully!`)
                    console.log(`   Message ID: ${emailResult.messageId}`)
                } else {
                    console.error(`❌ Failed to send appointment email:`)
                    console.error(`   Error: ${emailResult.message}`)
                }
            } catch (emailError) {
                console.error('❌ Error sending appointment confirmation email:', emailError)
                // Continue even if email fails - appointment is still booked
            }
        } else {
            console.log('⚠️  No email found for user, email notification not sent')
        }

        // Send SMS and WhatsApp notifications to patient
        const userPhone = userData.phone ? userData.phone.replace(/\D/g, '') : null
        let whatsappLink = null
        
        if (userPhone) {

            // Send SMS notification
            try {
                const { sendAppointmentSMS } = await import('../services/smsService.js')
                console.log(`\n📱 Sending appointment SMS to: ${userPhone}`)
                const smsResult = await sendAppointmentSMS(userPhone, appointmentNotificationData)
                
                if (smsResult.success) {
                    console.log(`✅ Appointment SMS sent successfully!`)
                    console.log(`   Provider: ${smsResult.provider || 'N/A'}`)
                } else {
                    console.error(`❌ Failed to send appointment SMS:`)
                    console.error(`   Error: ${smsResult.message}`)
                }
            } catch (smsError) {
                console.error('❌ Error sending appointment SMS:', smsError)
                // Continue even if SMS fails - appointment is still booked
            }

            // Send WhatsApp notification (only if phone number is valid)
            if (userPhone && userPhone !== '000000000' && userPhone.length >= 10) {
                try {
                    const { sendAppointmentWhatsApp } = await import('../services/whatsappService.js')
                    console.log(`\n📱 Generating WhatsApp link for: ${userPhone}`)
                    const whatsappResult = await sendAppointmentWhatsApp(userPhone, appointmentNotificationData)
                    
                    if (whatsappResult.success) {
                        console.log(`✅ WhatsApp link generated successfully!`)
                        console.log(`   Provider: ${whatsappResult.provider || 'N/A'}`)
                        if (whatsappResult.link) {
                            whatsappLink = whatsappResult.link
                            console.log(`   Link: ${whatsappResult.link}`)
                        }
                    } else {
                        console.error(`❌ Failed to generate WhatsApp link:`)
                        console.error(`   Error: ${whatsappResult.message}`)
                    }
                } catch (whatsappError) {
                    console.error('❌ Error generating WhatsApp link:', whatsappError)
                    // Continue even if WhatsApp fails - appointment is still booked
                }
            } else {
                console.log('⚠️  Invalid phone number - WhatsApp link not generated')
                console.log(`   Phone: ${userPhone || 'not provided'}`)
                console.log(`   Please update phone number in profile to receive WhatsApp notifications`)
            }
        } else {
            console.log('⚠️  No phone number found for user, notifications not sent')
        }

        res.json({ 
            success: true, 
            message: 'Appointment Booked Successfully! Confirmation sent to your email and registered phone number.'
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get queue status for patient appointment
const getQueueStatus = async (req, res) => {
    try {
        const { userId } = req.body
        const { appointmentId } = req.query

        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            userId: userId
        })

        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        // Get doctor status
        const doctor = await doctorModel.findById(appointment.docId).select('status currentAppointmentId')
        
        // Calculate current queue status
        const queueInfo = await import('../services/queueService.js')
        const queueData = await queueInfo.calculateQueuePosition(
            appointmentId,
            appointment.docId,
            appointment.slotDate
        )

        // Check if it's patient's turn
        const isNextUp = doctor?.currentAppointmentId === appointmentId || 
                        (queueData && queueData.queuePosition === 1 && doctor?.status === 'in-clinic')

        // Check for delays
        const [hour, minute] = appointment.slotTime.split(':').map(Number)
        const appointmentTime = new Date()
        appointmentTime.setHours(hour, minute, 0, 0)
        const currentTime = new Date()
        const delayMinutes = Math.round((currentTime - appointmentTime) / (1000 * 60))
        const isDelayed = delayMinutes > 15 && appointment.status !== 'in-consult'

        // Mark as delayed if needed
        if (isDelayed && !appointment.isDelayed) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {
                isDelayed: true,
                delayReason: 'Doctor running behind schedule'
            })
        }

        res.json({
            success: true,
            queueStatus: {
                tokenNumber: appointment.tokenNumber,
                queuePosition: queueData?.queuePosition || appointment.queuePosition,
                estimatedWaitTime: queueData?.estimatedWaitTime || appointment.estimatedWaitTime,
                doctorStatus: doctor?.status || 'in-clinic',
                appointmentStatus: appointment.status,
                isNextUp,
                isDelayed,
                delayMinutes: isDelayed ? delayMinutes : 0,
                totalInQueue: queueData?.totalInQueue || 0,
                appointmentId: appointment._id.toString()
            }
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to mark appointment as alerted
const markAlerted = async (req, res) => {
    try {
        const { userId } = req.body
        const { appointmentId } = req.body

        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            userId: userId
        })

        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { alerted: true })
        res.json({ success: true, message: 'Marked as alerted' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor live status
const getDoctorStatus = async (req, res) => {
    try {
        const { docId } = req.query

        const doctor = await doctorModel.findById(docId).select('status currentAppointmentId name')
        
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' })
        }

        res.json({
            success: true,
            status: doctor.status,
            isAvailable: doctor.status === 'in-clinic',
            isInConsult: doctor.status === 'in-consult',
            isOnBreak: doctor.status === 'on-break'
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get emergency contacts
const getEmergencyContacts = async (req, res) => {
    try {
        const { userId } = req.body
        
        if (!userId) {
            return res.json({ success: false, message: 'User not authenticated' })
        }
        
        const user = await userModel.findById(userId).select('emergencyContacts')
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        res.json({
            success: true,
            contacts: {
                friends: user.emergencyContacts?.friends || [],
                family: user.emergencyContacts?.family || []
            }
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to add emergency contact
const addEmergencyContact = async (req, res) => {
    try {
        const { userId } = req.body
        const { name, phone, relation, type } = req.body // type: 'friend' or 'family'

        if (!name || !phone || !type) {
            return res.json({ success: false, message: 'Missing required fields' })
        }

        if (type !== 'friend' && type !== 'family') {
            return res.json({ success: false, message: 'Type must be "friend" or "family"' })
        }

        if (type === 'family' && !relation) {
            return res.json({ success: false, message: 'Relation is required for family contacts' })
        }

        const user = await userModel.findById(userId)
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        // Initialize emergencyContacts if it doesn't exist
        if (!user.emergencyContacts) {
            user.emergencyContacts = { friends: [], family: [] }
        }

        const newContact = {
            name,
            phone,
            relation: type === 'friend' ? (relation || 'Friend') : relation
        }

        if (type === 'friend') {
            user.emergencyContacts.friends.push(newContact)
        } else {
            user.emergencyContacts.family.push(newContact)
        }

        await user.save()

        res.json({
            success: true,
            message: 'Contact added successfully',
            contact: newContact
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update emergency contact
const updateEmergencyContact = async (req, res) => {
    try {
        const { userId } = req.body
        const { contactId, name, phone, relation, type } = req.body

        if (!contactId || !type) {
            return res.json({ success: false, message: 'Missing required fields' })
        }

        const user = await userModel.findById(userId)
        
        if (!user || !user.emergencyContacts) {
            return res.json({ success: false, message: 'User or contacts not found' })
        }

        const contacts = type === 'friend' ? user.emergencyContacts.friends : user.emergencyContacts.family
        const contactIndex = contacts.findIndex(c => c._id.toString() === contactId)

        if (contactIndex === -1) {
            return res.json({ success: false, message: 'Contact not found' })
        }

        if (name) contacts[contactIndex].name = name
        if (phone) contacts[contactIndex].phone = phone
        if (relation) contacts[contactIndex].relation = relation

        await user.save()

        res.json({
            success: true,
            message: 'Contact updated successfully',
            contact: contacts[contactIndex]
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to delete emergency contact
const deleteEmergencyContact = async (req, res) => {
    try {
        const { userId } = req.body
        const { contactId, type } = req.body

        if (!contactId || !type) {
            return res.json({ success: false, message: 'Missing required fields' })
        }

        const user = await userModel.findById(userId)
        
        if (!user || !user.emergencyContacts) {
            return res.json({ success: false, message: 'User or contacts not found' })
        }

        const contacts = type === 'friend' ? user.emergencyContacts.friends : user.emergencyContacts.family
        const contactIndex = contacts.findIndex(c => c._id.toString() === contactId)

        if (contactIndex === -1) {
            return res.json({ success: false, message: 'Contact not found' })
        }

        contacts.splice(contactIndex, 1)
        await user.save()

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to send OTP for password reset
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email || !validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please provide a valid email' });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'No account found with this email' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before storing
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);

        // Set OTP expiry to 10 minutes from now
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Save OTP and expiry to database
        await userModel.findByIdAndUpdate(user._id, {
            resetPasswordOTP: hashedOTP,
            resetPasswordOTPExpiry: otpExpiry
        });

        // Send OTP via email
        const emailResult = await sendPasswordResetOTP(email, otp, user.name);

        if (emailResult.success) {
            console.log(`✅ Password reset OTP sent to ${email}`);
            res.json({ 
                success: true, 
                message: 'OTP sent successfully to your email. Please check your inbox.' 
            });
        } else {
            // If email fails, remove OTP from database
            await userModel.findByIdAndUpdate(user._id, {
                $unset: { resetPasswordOTP: 1, resetPasswordOTPExpiry: 1 }
            });
            res.json({ 
                success: false, 
                message: 'Failed to send OTP. Please try again later.' 
            });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to verify OTP and reset password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Validate inputs
        if (!email || !otp || !newPassword) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please provide a valid email' });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters long' });
        }

        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'No account found with this email' });
        }

        // Check if OTP exists and is not expired
        if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
            return res.json({ success: false, message: 'No OTP found. Please request a new one.' });
        }

        if (new Date() > user.resetPasswordOTPExpiry) {
            // Clear expired OTP
            await userModel.findByIdAndUpdate(user._id, {
                $unset: { resetPasswordOTP: 1, resetPasswordOTPExpiry: 1 }
            });
            return res.json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        // Verify OTP
        const isOTPValid = await bcrypt.compare(otp, user.resetPasswordOTP);
        if (!isOTPValid) {
            return res.json({ success: false, message: 'Invalid OTP. Please try again.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear OTP fields
        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            $unset: { resetPasswordOTP: 1, resetPasswordOTPExpiry: 1 }
        });

        // Send confirmation email
        await sendPasswordResetConfirmation(email, user.name);

        console.log(`✅ Password reset successful for ${email}`);
        res.json({ 
            success: true, 
            message: 'Password reset successful. You can now login with your new password.' 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe,
    getQueueStatus,
    getDoctorStatus,
    markAlerted,
    getEmergencyContacts,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    forgotPassword,
    resetPassword,
    sendContactMessage
}