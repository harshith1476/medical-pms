import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDi74ZhCE0Dy4DtImsUiwRA7tQa7xg6ek0';

console.log('🔍 Testing Google Gemini API Key...\n');

if (apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    console.log('❌ ERROR: Gemini API key not set!\n');
    console.log('📝 How to get FREE API key:');
    console.log('   1. Visit: https://aistudio.google.com/app/apikey');
    console.log('   2. Sign in with your Google account');
    console.log('   3. Click "Create API Key"');
    console.log('   4. Copy the key and add to .env file:');
    console.log('      GEMINI_API_KEY=your_key_here\n');
    process.exit(1);
}

console.log('API Key (first 20 chars):', apiKey.substring(0, 20) + '...\n');

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
    try {
        console.log('📡 Sending test request to Google Gemini...\n');
        
        // Using gemini-2.5-flash (fast and free) - latest stable version
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = 'Say "Hello, Google Gemini API is working!" if you can read this.';
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ SUCCESS! Google Gemini API is working!\n');
        console.log('📝 Response:', text);
        console.log('\n📊 Model Info:');
        console.log('   Model: gemini-2.5-flash');
        console.log('   Provider: Google (FREE tier)');
        console.log('   Limits: 60 req/min, 1500 req/day');
        
        return true;
    } catch (error) {
        console.error('❌ ERROR: Google Gemini API test failed!\n');
        
        if (error.message?.includes('API_KEY')) {
            console.error('⚠️  Invalid API key. Please check your GEMINI_API_KEY.');
        } else if (error.message?.includes('quota')) {
            console.error('⚠️  Quota exceeded. Check your usage limits.');
        } else {
            console.error('Error:', error.message);
        }
        
        return false;
    }
}

// Run the test
testGemini()
    .then(success => {
        if (success) {
            console.log('\n✅ Test completed successfully!');
            console.log('🎉 Your chatbot will now use FREE Google Gemini!');
            process.exit(0);
        } else {
            console.log('\n❌ Test failed. Please check your API key.');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('\n💥 Unexpected error:', error);
        process.exit(1);
    });

