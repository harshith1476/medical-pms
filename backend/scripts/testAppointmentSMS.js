import 'dotenv/config'
import { sendAppointmentSMS } from '../services/smsService.js'

const testPhoneNumber = '7780378049' // Your test number

const appointmentData = {
    patientName: 'Test Patient',
    doctorName: 'Dr. Test Doctor',
    speciality: 'Cardiology',
    date: '15 Dec 2025',
    time: '10:00 AM',
    fee: 500,
    hospitalAddress: '123 Test Street, Test City',
    googleMapsLink: 'https://www.google.com/maps/search/?api=1&query=Test+Location'
}

console.log('📱 Testing Appointment SMS...\n')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`Provider: Development Mode`)
console.log(`Recipient: ${testPhoneNumber}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

sendAppointmentSMS(testPhoneNumber, appointmentData)
    .then(result => {
        if (result.success) {
            console.log('✅ Appointment SMS Sent Successfully!')
            if (result.requestId) {
                console.log(`   Request ID: ${result.requestId}`)
            }
            if (result.provider) {
                console.log(`   Provider: ${result.provider}`)
            }
            console.log(`   Status: ${result.message}`)
            console.log('\n💡 Note:')
            console.log('   - SMS service is disabled (development mode)')
            console.log('   - Messages are logged but not sent')
        } else {
            console.log('❌ Appointment SMS Test Failed!')
            console.log(`   Error: ${result.message}`)
        }
    })
    .catch(error => {
        console.error('❌ Error:', error.message)
        console.error('   Stack:', error.stack)
    })

