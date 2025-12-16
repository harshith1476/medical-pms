import 'dotenv/config'
import { sendSMS } from '../services/smsService.js'

const testPhoneNumber = '7780378049' // Your test number
const testMessage = `Test SMS from MediChain

This is a test message to verify SMS service is working correctly.

Provider: Development Mode
Phone Number: ${testPhoneNumber}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

SMS service is currently disabled (development mode).
Messages are logged but not sent.`

console.log('📱 Testing SMS Service...\n')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`Provider: Development Mode`)
console.log(`Recipient: ${testPhoneNumber}`)
console.log(`Message Preview: ${testMessage.substring(0, 100)}...`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

sendSMS(testPhoneNumber, testMessage)
    .then(result => {
        if (result.success) {
            console.log('✅ SMS Service Test Complete!')
            if (result.provider) {
                console.log(`   Provider: ${result.provider}`)
            }
            console.log(`   Status: ${result.message}`)
            console.log('\n💡 Note:')
            console.log('   - SMS service is disabled (development mode)')
            console.log('   - Messages are logged but not sent')
        } else {
            console.log('❌ SMS Test Failed!')
            console.log(`   Error: ${result.message}`)
        }
    })
    .catch(error => {
        console.error('❌ Error:', error.message)
    })

