import appointmentModel from "../models/appointmentModel.js"
import doctorModel from "../models/doctorModel.js"

// Calculate queue position and wait time for an appointment
export const calculateQueuePosition = async (appointmentId, docId, slotDate) => {
    try {
        // Get all appointments for the doctor on the same date
        const appointments = await appointmentModel.find({
            docId: docId,
            slotDate: slotDate,
            cancelled: false,
            isCompleted: false,
            status: { $in: ['pending', 'in-queue', 'in-consult'] }
        }).sort({ tokenNumber: 1 })

        // Get current appointment
        const currentAppointment = await appointmentModel.findById(appointmentId)
        if (!currentAppointment) return null

        // Find position in queue based on token number
        const appointmentsBefore = appointments.filter(apt => {
            if (!apt.tokenNumber || !currentAppointment.tokenNumber) return false
            return apt.tokenNumber < currentAppointment.tokenNumber
        }).length

        const queuePosition = appointmentsBefore + 1

        // Get doctor's average consultation time and current status
        const doctor = await doctorModel.findById(docId)
        const avgConsultTime = doctor?.averageConsultationTime || 15
        const currentAppointmentId = doctor?.currentAppointmentId

        // If doctor is consulting, count only appointments before the current consulting one
        let appointmentsToWait = appointmentsBefore
        if (currentAppointmentId && currentAppointmentId.toString() !== appointmentId.toString()) {
            const currentConsulting = appointments.find(apt => apt._id.toString() === currentAppointmentId.toString())
            if (currentConsulting && currentConsulting.tokenNumber > currentAppointment.tokenNumber) {
                appointmentsToWait = 0 // Already passed
            }
        }

        // Calculate estimated wait time
        const estimatedWaitTime = appointmentsToWait * avgConsultTime

        return {
            queuePosition: queuePosition > 0 ? queuePosition : 1,
            estimatedWaitTime: estimatedWaitTime >= 0 ? estimatedWaitTime : 0,
            totalInQueue: appointments.length
        }
    } catch (error) {
        console.error('Error calculating queue position:', error)
        return null
    }
}

// Assign token number to new appointment
export const assignTokenNumber = async (docId, slotDate) => {
    try {
        // Get all appointments for the doctor on the same date
        const appointments = await appointmentModel.find({
            docId: docId,
            slotDate: slotDate,
            cancelled: false
        }).sort({ tokenNumber: 1 })

        // Find the next available token number
        let nextToken = 1
        if (appointments.length > 0) {
            const maxToken = Math.max(...appointments.map(apt => apt.tokenNumber || 0))
            nextToken = maxToken + 1
        }

        return nextToken
    } catch (error) {
        console.error('Error assigning token number:', error)
        return 1
    }
}

// Get current queue status for a doctor
export const getDoctorQueueStatus = async (docId, slotDate) => {
    try {
        const appointments = await appointmentModel.find({
            docId: docId,
            slotDate: slotDate,
            cancelled: false,
            isCompleted: false,
            status: { $in: ['pending', 'in-queue', 'in-consult'] }
        }).sort({ tokenNumber: 1 })

        const doctor = await doctorModel.findById(docId)
        const currentStatus = doctor?.status || 'in-clinic'
        const currentAppointmentId = doctor?.currentAppointmentId || null

        // Calculate queue positions for all appointments
        const appointmentsWithPosition = appointments.map((apt, index) => {
            // Recalculate queue position based on token number
            const position = index + 1
            return {
                _id: apt._id,
                tokenNumber: apt.tokenNumber,
                patientName: apt.userData?.name,
                slotTime: apt.slotTime,
                status: apt.status,
                queuePosition: position
            }
        })

        return {
            status: currentStatus,
            currentAppointmentId,
            queueLength: appointments.length,
            appointments: appointmentsWithPosition
        }
    } catch (error) {
        console.error('Error getting queue status:', error)
        return null
    }
}

// Update appointment status in queue
export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment) return false

        const updateData = { status }
        
        if (status === 'in-consult') {
            updateData.actualStartTime = Date.now()
            updateData.status = 'in-consult'
        } else if (status === 'completed') {
            updateData.actualEndTime = Date.now()
            updateData.isCompleted = true
            updateData.status = 'completed'
            if (appointment.actualStartTime) {
                updateData.consultationDuration = Math.round(
                    (Date.now() - appointment.actualStartTime) / (1000 * 60)
                )
            }
        } else if (status === 'in-queue') {
            updateData.status = 'in-queue'
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, updateData)
        return true
    } catch (error) {
        console.error('Error updating appointment status:', error)
        return false
    }
}

// Check for delayed appointments
export const checkDelayedAppointments = async (docId, slotDate) => {
    try {
        const appointments = await appointmentModel.find({
            docId: docId,
            slotDate: slotDate,
            cancelled: false,
            isCompleted: false,
            status: { $in: ['pending', 'in-queue'] }
        })

        const doctor = await doctorModel.findById(docId)
        const avgConsultTime = doctor?.averageConsultationTime || 15
        const currentTime = new Date()
        const currentHour = currentTime.getHours()
        const currentMinute = currentTime.getMinutes()

        const delayedAppointments = []

        for (const apt of appointments) {
            const [hour, minute] = apt.slotTime.split(':').map(Number)
            const appointmentTime = new Date()
            appointmentTime.setHours(hour, minute, 0, 0)

            const currentDateTime = new Date()
            const delayMinutes = Math.round((currentDateTime - appointmentTime) / (1000 * 60))

            // Consider delayed if more than 15 minutes past scheduled time
            if (delayMinutes > 15 && !apt.isDelayed) {
                delayedAppointments.push({
                    appointmentId: apt._id,
                    delayMinutes,
                    patientName: apt.userData?.name,
                    tokenNumber: apt.tokenNumber
                })
            }
        }

        return delayedAppointments
    } catch (error) {
        console.error('Error checking delayed appointments:', error)
        return []
    }
}

// Get smart scheduling suggestions
export const getSmartSchedulingSuggestions = async (docId, slotDate, currentAppointmentId) => {
    try {
        const suggestions = []
        
        // Get all pending appointments
        const pendingAppointments = await appointmentModel.find({
            docId: docId,
            slotDate: slotDate,
            cancelled: false,
            isCompleted: false,
            status: { $in: ['pending', 'in-queue'] },
            _id: { $ne: currentAppointmentId }
        }).sort({ tokenNumber: 1 })

        // Get current appointment
        const currentAppointment = currentAppointmentId 
            ? await appointmentModel.findById(currentAppointmentId)
            : null

        // Check if current appointment is short consult or no-show
        if (currentAppointment && !currentAppointment.isCompleted) {
            if (currentAppointment.status === 'no-show') {
                suggestions.push({
                    type: 'pull-next',
                    message: 'Pull next patient - Current patient no-show',
                    nextAppointment: pendingAppointments[0]
                })
            } else if (currentAppointment.actualStartTime) {
                const consultDuration = Math.round(
                    (Date.now() - currentAppointment.actualStartTime) / (1000 * 60)
                )
                const doctor = await doctorModel.findById(docId)
                const avgTime = doctor?.averageConsultationTime || 15

                if (consultDuration < avgTime * 0.5 && pendingAppointments.length > 0) {
                    suggestions.push({
                        type: 'pull-next',
                        message: 'Consultation is running short - Pull next patient',
                        nextAppointment: pendingAppointments[0],
                        timeSaved: avgTime - consultDuration
                    })
                }
            }
        }

        // Find follow-up appointments that can be moved earlier
        const followUpAppointments = pendingAppointments.filter(apt => {
            // Check if there are gaps or earlier slots available
            return apt.queuePosition > 2
        })

        if (followUpAppointments.length > 0 && pendingAppointments.length > 0) {
            const firstPending = pendingAppointments[0]
            if (firstPending.queuePosition > 1) {
                suggestions.push({
                    type: 'move-followup',
                    message: 'Move follow-up patient to fill gap',
                    appointment: followUpAppointments[0],
                    suggestedPosition: 1
                })
            }
        }

        return suggestions
    } catch (error) {
        console.error('Error getting smart suggestions:', error)
        return []
    }
}

