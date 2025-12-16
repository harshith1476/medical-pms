# Doctor Age Selection Feature Documentation

## Overview

This feature allows **doctor users** to bypass age group selection and view all symptoms directly when booking appointments on behalf of patients, while **patient users** continue to see age-based symptom filtering.

---

## Frontend Implementation

### 1. SymptomsByAge Component (`frontend/src/components/SymptomsByAge.jsx`)

#### New Prop: `isUserDoctor`
- **Type:** `Boolean`
- **Default:** `false`
- **Purpose:** Controls whether to show age selection UI or display all symptoms directly

#### Behavior Changes:

**When `isUserDoctor = true` (Doctor View):**
- ✅ Age group selection buttons are hidden
- ✅ All symptoms from all age groups are displayed immediately
- ✅ No need to select an age group before seeing symptoms
- ✅ Title changes to "Select Symptoms" instead of "Select Your Age Group & Symptoms"
- ✅ Symptoms are automatically de-duplicated across all age groups

**When `isUserDoctor = false` (Patient View):**
- ✅ Age group selection is required
- ✅ Symptoms are filtered by selected age group
- ✅ Standard workflow remains unchanged

---

## Backend Implementation

### User Model Update (`backend/models/userModel.js`)

Added new field to user schema:

```javascript
role: { 
    type: String, 
    enum: ['patient', 'doctor'], 
    default: 'patient' 
}
```

### Setting User Role

#### Option 1: During User Registration
When creating a new user account for a doctor, set the role field:

```javascript
const newUser = new userModel({
    name: "Dr. John Smith",
    email: "doctor@example.com",
    password: hashedPassword,
    role: "doctor"  // Set role to doctor
});
```

#### Option 2: Update Existing User
To convert an existing patient account to a doctor account:

```javascript
await userModel.findByIdAndUpdate(userId, { 
    role: 'doctor' 
});
```

#### Option 3: Manual Database Update
Using MongoDB shell or a database tool:

```javascript
db.users.updateOne(
    { email: "doctor@example.com" },
    { $set: { role: "doctor" } }
);
```

---

## Usage in Appointment Page

The `Appointment.jsx` page automatically detects user role:

```javascript
<SymptomsByAge 
    // ... other props ...
    isUserDoctor={userData?.role === 'doctor' || userData?.isDoctor === true}
/>
```

This checks if:
- `userData.role === 'doctor'` (preferred method)
- OR `userData.isDoctor === true` (alternative flag)

---

## Testing the Feature

### Test as Patient:
1. Login with a regular patient account
2. Navigate to book an appointment
3. **Expected:** Age group selection buttons appear
4. **Expected:** Symptoms only show after selecting an age group

### Test as Doctor:
1. Login with a doctor account (role: 'doctor')
2. Navigate to book an appointment
3. **Expected:** No age group selection buttons
4. **Expected:** All symptoms display immediately
5. **Expected:** Title shows "Select Symptoms"

---

## Creating Test Doctor Account

### Method 1: Registration (if registration allows role specification)
Not recommended for production - doctors should be created by admins.

### Method 2: Backend Script
Create a script to add doctor users:

```javascript
// backend/scripts/createDoctorUser.js
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

async function createDoctorUser() {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash('doctor123', 10);
    
    const doctor = new userModel({
        name: "Dr. Test Doctor",
        email: "testdoctor@example.com",
        password: hashedPassword,
        role: "doctor"
    });
    
    await doctor.save();
    console.log("Doctor user created successfully");
    process.exit(0);
}

createDoctorUser();
```

Run with: `node backend/scripts/createDoctorUser.js`

### Method 3: Admin Panel
Add a role selector in your admin panel when creating/editing users.

---

## Security Considerations

1. **Role Verification:** Always verify role on the backend for sensitive operations
2. **Default Role:** New users default to 'patient' for security
3. **Role Change:** Implement proper authentication checks before allowing role changes
4. **API Endpoints:** Protect doctor-specific API endpoints with role middleware

---

## Future Enhancements

Potential improvements:
- Add more roles (admin, nurse, receptionist)
- Implement role-based UI components
- Add audit logging for role changes
- Create doctor-specific appointment management features

---

## Troubleshooting

### Issue: Age selection still showing for doctor
**Solution:** 
- Verify user's role in database: `db.users.findOne({ email: "doctor@example.com" })`
- Check frontend console: `console.log(userData)`
- Ensure user logged in after role was set

### Issue: Symptoms not showing for doctor
**Solution:**
- Check if `doctorAgeSymptomsMap` has data
- Verify doctor has configured age groups and symptoms
- Check browser console for errors

### Issue: All users seeing doctor view
**Solution:**
- Check if `isUserDoctor` prop is hardcoded to `true`
- Verify role check logic in Appointment.jsx
- Clear browser cache and re-login

---

## Summary

✅ **Implemented:** Role-based age selection hiding for doctor users  
✅ **Maintained:** Standard patient workflow with age-based filtering  
✅ **Added:** Backend role field in user model  
✅ **Flexible:** Easy to extend with additional roles  

**No changes to:**
- UI styling
- Colors
- Layout spacing
- Desktop/mobile responsiveness
- API endpoints

