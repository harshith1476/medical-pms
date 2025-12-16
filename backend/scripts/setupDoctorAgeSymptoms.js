/**
 * Script to setup doctor-specific age groups and symptoms
 * 
 * This script demonstrates how to configure age groups and symptoms for different doctors
 * Run this script to populate sample data for doctors
 * 
 * Usage: node backend/scripts/setupDoctorAgeSymptoms.js
 */

import mongoose from 'mongoose'
import doctorModel from '../models/doctorModel.js'
import dotenv from 'dotenv'

dotenv.config()

// Sample doctor-specific age groups and symptoms mapping
const doctorAgeSymptomsConfig = {
    // Pediatrician Example
    pediatrician: {
        supportedAgeGroups: ['0-12', '13-18'],
        ageSymptomsMap: {
            '0-12': [
                'Fever', 'Cold', 'Cough', 'Vomiting', 'Diarrhea',
                'Ear Pain', 'Vaccination Issues', 'Growth Issues', 'Skin Rash'
            ],
            '13-18': [
                'Acne', 'Headache', 'Fatigue', 'Anxiety', 'Irregular Periods',
                'Hair Fall', 'Sleep Issues', 'Stomach Pain', 'Low Immunity'
            ]
        }
    },
    
    // Gynecologist Example
    gynecologist: {
        supportedAgeGroups: ['18-30', '31-45', '46-60'],
        ageSymptomsMap: {
            '18-30': [
                'PCOS', 'Irregular Periods', 'Pregnancy Issues', 'Menstrual Cramps',
                'Vaginal Infections', 'Breast Pain', 'Hormonal Imbalance', 'Fertility Issues'
            ],
            '31-45': [
                'Menopause Symptoms', 'Hormonal Changes', 'Uterine Issues', 'Ovarian Cysts',
                'Heavy Bleeding', 'Pelvic Pain', 'Breast Lumps', 'Endometriosis'
            ],
            '46-60': [
                'Menopause', 'Hot Flashes', 'Bone Density Issues', 'Hormone Replacement',
                'Vaginal Dryness', 'Mood Swings', 'Sleep Disorders', 'Weight Gain'
            ]
        }
    },
    
    // Cardiologist Example
    cardiologist: {
        supportedAgeGroups: ['36-45', '46-60', '60+'],
        ageSymptomsMap: {
            '36-45': [
                'Chest Pain', 'BP Fluctuation', 'Palpitations', 'Shortness of Breath',
                'High Cholesterol', 'Family History', 'Stress-Related Issues', 'Irregular Heartbeat'
            ],
            '46-60': [
                'Hypertension', 'Chest Pain', 'Heart Palpitations', 'Breathlessness',
                'High BP', 'Cholesterol Issues', 'Angina', 'Arrhythmia'
            ],
            '60+': [
                'Heart Disease', 'Chest Pain', 'Heart Failure', 'Arrhythmia',
                'High BP', 'Stroke Risk', 'Coronary Artery Disease', 'Atrial Fibrillation'
            ]
        }
    },
    
    // General Physician Example
    generalPhysician: {
        supportedAgeGroups: ['0-12', '13-25', '26-45', '46-60', '60+'],
        ageSymptomsMap: {
            '0-12': [
                'Fever', 'Cold', 'Cough', 'Vomiting', 'Diarrhea',
                'Ear Pain', 'Vaccination Issues', 'Growth Issues', 'Skin Rash'
            ],
            '13-25': [
                'Acne', 'Headache', 'Fatigue', 'Anxiety', 'Irregular Periods',
                'Hair Fall', 'Sleep Issues', 'Stomach Pain', 'Low Immunity'
            ],
            '26-45': [
                'Back Pain', 'Migraine', 'BP Fluctuation', 'Thyroid', 'PCOS',
                'Stress', 'Digestive Issues', 'Eye Strain', 'Neck Pain'
            ],
            '46-60': [
                'Hypertension', 'Diabetes', 'Arthritis', 'Chest Pain',
                'Heart Palpitations', 'Vision Issues', 'Breathlessness', 'Memory Issues'
            ],
            '60+': [
                'Heart Disease', 'Arthritis', 'Osteoporosis', 'Cataract', 'Parkinson\'s',
                'Hearing Loss', 'Asthma', 'Dementia'
            ]
        }
    }
}

// Function to update doctor with age groups and symptoms
const updateDoctorAgeSymptoms = async (doctorEmail, config) => {
    try {
        const doctor = await doctorModel.findOne({ email: doctorEmail })
        
        if (!doctor) {
            console.log(`Doctor with email ${doctorEmail} not found`)
            return false
        }
        
        await doctorModel.findByIdAndUpdate(doctor._id, {
            supportedAgeGroups: config.supportedAgeGroups,
            ageSymptomsMap: config.ageSymptomsMap
        })
        
        console.log(`✅ Updated ${doctor.name} (${doctor.speciality}) with age groups and symptoms`)
        return true
    } catch (error) {
        console.error(`❌ Error updating doctor ${doctorEmail}:`, error.message)
        return false
    }
}

// Main function
const setupDoctorAgeSymptoms = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('✅ Connected to MongoDB')
        
        // Get all doctors
        const doctors = await doctorModel.find({})
        console.log(`\n📋 Found ${doctors.length} doctors\n`)
        
        // Update doctors based on their specialty
        for (const doctor of doctors) {
            const speciality = doctor.speciality.toLowerCase()
            
            if (speciality.includes('pediatric')) {
                await updateDoctorAgeSymptoms(doctor.email, doctorAgeSymptomsConfig.pediatrician)
            } else if (speciality.includes('gynecolog') || speciality.includes('gyn')) {
                await updateDoctorAgeSymptoms(doctor.email, doctorAgeSymptomsConfig.gynecologist)
            } else if (speciality.includes('cardio')) {
                await updateDoctorAgeSymptoms(doctor.email, doctorAgeSymptomsConfig.cardiologist)
            } else if (speciality.includes('general') || speciality.includes('physician')) {
                await updateDoctorAgeSymptoms(doctor.email, doctorAgeSymptomsConfig.generalPhysician)
            } else {
                // Default to general physician config
                await updateDoctorAgeSymptoms(doctor.email, doctorAgeSymptomsConfig.generalPhysician)
            }
        }
        
        console.log('\n✅ Setup completed successfully!')
        
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await mongoose.disconnect()
        console.log('✅ Disconnected from MongoDB')
    }
}

// Run the script
setupDoctorAgeSymptoms()

