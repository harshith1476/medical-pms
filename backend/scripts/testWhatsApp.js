import 'dotenv/config'
import { sendWhatsApp } from '../services/whatsappService.js'

// Test phone number (replace with your number)
const testPhoneNumber = process.argv[2] || '919876543210' // Default test number (replace with your number)
const testMessage = process.argv[3] || 'Test WhatsApp message from MediChain - This is a test to verify WhatsApp integration is working correctly!'

console.log('📱 Testing WhatsApp Service...\n')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// Detect provider
let provider = 'Development Mode'
if (process.env.TWILIO_ACCOUNT_SID) {
    provider = 'Twilio'
} else if (process.env.WHATSAPP_ACCESS_TOKEN) {
    provider = 'Meta Cloud API'
}

console.log(`Provider: ${provider}`)
console.log(`Recipient: ${testPhoneNumber}`)
console.log(`Message: ${testMessage}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

if (provider === 'Development Mode') {
    console.log('⚠️  WhatsApp provider not configured')
    console.log('\n📝 To test WhatsApp:')
    console.log('\nOption 1: Twilio (Recommended - Easiest)')
    console.log('   1. Sign up at: https://www.twilio.com/try-twilio')
    console.log('   2. Get $15 free credits')
    console.log('   3. Enable WhatsApp Sandbox')
    console.log('   4. Add to .env:')
    console.log('      TWILIO_ACCOUNT_SID=your_account_sid')
    console.log('      TWILIO_AUTH_TOKEN=your_auth_token')
    console.log('      TWILIO_WHATSAPP_FROM=whatsapp:+14155238886')
    console.log('   5. Join sandbox by sending join code to Twilio number')
    console.log('   6. Run: npm run test-whatsapp\n')
    console.log('\nOption 2: Meta WhatsApp Cloud API')
    console.log('   1. Create Meta Business Account')
    console.log('   2. Create WhatsApp Business App')
    console.log('   3. Get access token from API Setup')
    console.log('   4. Add to .env:')
    console.log('      WHATSAPP_ACCESS_TOKEN=your_access_token')
    console.log('      WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id')
    console.log('      WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id')
    console.log('   5. Add recipient to allowed list (for testing)')
    console.log('   6. Run: npm run test-whatsapp\n')
    process.exit(1)
}

console.log(`Sending WhatsApp message via ${provider}...\n`)

try {
    const result = await sendWhatsApp(testPhoneNumber, testMessage)
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    if (result.success) {
        console.log('✅ WhatsApp Message Sent Successfully!')
        console.log(`   Provider: ${result.provider}`)
        console.log(`   Status: ${result.message}`)
        if (result.sid) {
            console.log(`   Message SID: ${result.sid}`)
        }
        if (result.messageId) {
            console.log(`   Message ID: ${result.messageId}`)
        }
    } else {
        console.log('❌ WhatsApp Message Failed!')
        console.log(`   Error: ${result.message}`)
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    console.log('📱 Check your WhatsApp for the test message!')
    console.log('\n💡 Note:')
    if (provider === 'Twilio') {
        console.log('   - Twilio Sandbox: Only works with joined numbers')
        console.log('   - Join sandbox by sending join code to Twilio number')
        console.log('   - Free tier includes $15 credits')
    } else {
        console.log('   - Meta Cloud API sends actual WhatsApp messages')
        console.log('   - Free tier: 1,000 conversations/month')
        console.log('   - Check Meta Business Manager for delivery status')
    }
    console.log('')
    
} catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
}

