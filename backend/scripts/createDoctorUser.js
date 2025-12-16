import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to create a doctor user for testing the age selection bypass feature
 * 
 * Usage: node backend/scripts/createDoctorUser.js
 */

async function createDoctorUser() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/prescripto';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Doctor user details
        const doctorEmail = 'testdoctor@example.com';
        
        // Check if doctor already exists
        const existingDoctor = await userModel.findOne({ email: doctorEmail });
        if (existingDoctor) {
            console.log('⚠️  Doctor user already exists. Updating role...');
            existingDoctor.role = 'doctor';
            await existingDoctor.save();
            console.log('✅ Updated existing user to doctor role');
        } else {
            // Create new doctor user
            const hashedPassword = await bcrypt.hash('doctor123', 10);
            
            const doctor = new userModel({
                name: "Dr. Test Doctor",
                email: doctorEmail,
                password: hashedPassword,
                phone: "9876543210",
                gender: "Male",
                role: "doctor"  // Set role to doctor
            });
            
            await doctor.save();
            console.log('✅ Doctor user created successfully');
        }

        console.log('\n📋 Doctor Login Credentials:');
        console.log('   Email: testdoctor@example.com');
        console.log('   Password: doctor123');
        console.log('\n🎯 This doctor user will see all symptoms without age selection.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating doctor user:', error);
        process.exit(1);
    }
}

createDoctorUser();

