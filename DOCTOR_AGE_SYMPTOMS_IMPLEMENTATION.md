# Doctor-Specific Age & Symptom Recommendation System

## Overview

This system allows each doctor to have their own supported age groups and symptoms, dynamically displayed on the appointment booking page based on the selected doctor.

## Features

✅ **Doctor-Specific Configuration**: Each doctor has their own age groups and symptoms
✅ **Dynamic Loading**: Age groups and symptoms load automatically when a doctor is selected
✅ **Validation**: Ensures doctor selection → age selection → symptom selection flow
✅ **Medical Blue Theme**: Professional healthcare UI with smooth animations
✅ **Responsive Design**: Works on all devices

## Architecture

### Backend

#### Database Schema (`doctorModel.js`)
```javascript
{
    supportedAgeGroups: [String],  // e.g., ['0-12', '13-18', '19-30']
    ageSymptomsMap: {
        '0-12': ['Fever', 'Cold', 'Cough'],
        '13-18': ['Acne', 'Headache', 'Fatigue']
    }
}
```

#### API Endpoint
- **GET** `/api/doctor/age-symptoms/:docId`
- Returns doctor-specific age groups and symptoms mapping

### Frontend

#### Component: `SymptomsByAge.jsx`
- Accepts doctor-specific `supportedAgeGroups` and `ageSymptomsMap` as props
- Dynamically displays age bars and symptoms based on doctor data
- Handles selection and validation

#### Page: `Appointment.jsx`
- Fetches doctor-specific data when doctor is selected
- Passes data to `SymptomsByAge` component
- Validates doctor → age → symptom selection flow

## Setup Instructions

### 1. Database Setup

Run the setup script to populate sample data:

```bash
node backend/scripts/setupDoctorAgeSymptoms.js
```

This script automatically configures doctors based on their specialty:
- **Pediatrician**: Ages 0-12, 13-18
- **Gynecologist**: Ages 18-30, 31-45, 46-60
- **Cardiologist**: Ages 36-45, 46-60, 60+
- **General Physician**: All age groups

### 2. Manual Configuration

To manually configure a doctor's age groups and symptoms:

```javascript
// Example: Update a pediatrician
await doctorModel.findByIdAndUpdate(doctorId, {
    supportedAgeGroups: ['0-12', '13-18'],
    ageSymptomsMap: {
        '0-12': ['Fever', 'Cold', 'Cough', 'Vomiting', 'Diarrhea'],
        '13-18': ['Acne', 'Headache', 'Fatigue', 'Anxiety']
    }
})
```

## Usage Flow

1. **User selects a Doctor** → System loads doctor-specific age groups
2. **User selects Age Group** → System displays relevant symptoms
3. **User selects Symptoms** → Multiple symptoms can be selected
4. **User books Appointment** → Selected age group and symptoms are saved

## Validation Rules

1. ✅ Doctor must be selected first
2. ✅ If doctor has configured age groups, age group selection is mandatory
3. ✅ If age group is selected, at least one symptom must be selected
4. ✅ Red warning messages shown for missing selections

## Example Doctor Configurations

### Pediatrician
```javascript
{
    supportedAgeGroups: ['0-12', '13-18'],
    ageSymptomsMap: {
        '0-12': ['Fever', 'Cold', 'Cough', 'Vomiting', 'Diarrhea', 'Ear Pain', 'Vaccination Issues'],
        '13-18': ['Acne', 'Headache', 'Fatigue', 'Anxiety', 'Irregular Periods']
    }
}
```

### Gynecologist
```javascript
{
    supportedAgeGroups: ['18-30', '31-45', '46-60'],
    ageSymptomsMap: {
        '18-30': ['PCOS', 'Irregular Periods', 'Pregnancy Issues', 'Menstrual Cramps'],
        '31-45': ['Menopause Symptoms', 'Hormonal Changes', 'Uterine Issues'],
        '46-60': ['Menopause', 'Hot Flashes', 'Bone Density Issues']
    }
}
```

### Cardiologist
```javascript
{
    supportedAgeGroups: ['36-45', '46-60', '60+'],
    ageSymptomsMap: {
        '36-45': ['Chest Pain', 'BP Fluctuation', 'Palpitations', 'Shortness of Breath'],
        '46-60': ['Hypertension', 'Chest Pain', 'Heart Palpitations', 'Breathlessness'],
        '60+': ['Heart Disease', 'Chest Pain', 'Heart Failure', 'Arrhythmia']
    }
}
```

## API Response Format

```json
{
    "success": true,
    "doctorId": "507f1f77bcf86cd799439011",
    "doctorName": "Dr. Sarah Johnson",
    "speciality": "Pediatrician",
    "supportedAgeGroups": ["0-12", "13-18"],
    "ageSymptomsMap": {
        "0-12": ["Fever", "Cold", "Cough"],
        "13-18": ["Acne", "Headache", "Fatigue"]
    }
}
```

## Frontend Props

### SymptomsByAge Component

```jsx
<SymptomsByAge 
    onSymptomsChange={(symptoms) => setSelectedSymptoms(symptoms)}
    onAgeGroupChange={(ageGroup) => setSelectedAgeGroup(ageGroup)}
    selectedSymptoms={selectedSymptoms}
    selectedAgeGroup={selectedAgeGroup}
    supportedAgeGroups={doctorAgeGroups}        // From API
    ageSymptomsMap={doctorAgeSymptomsMap}      // From API
    doctorName={docInfo?.name || ''}
    isLoading={isLoadingAgeSymptoms}
/>
```

## Appointment Data Storage

When booking an appointment, the following data is stored:

```javascript
{
    ageGroup: '0-12',
    selectedSymptoms: ['Fever', 'Cold', 'Cough']
}
```

This data is stored in the `appointmentModel`:
- `ageGroup`: String (selected age group)
- `selectedSymptoms`: Array of Strings (selected symptoms)

## Error Handling

- If doctor has no configured age groups → Shows message: "No age groups configured"
- If API fails → Falls back to empty arrays (graceful degradation)
- If no doctor selected → Shows: "Please select a doctor first"

## UI Design

- **Age Bars**: Horizontal scrollable bars with blue gradient when selected
- **Symptom Pills**: Selectable pills that turn solid blue when selected
- **Validation Errors**: Red warning boxes with clear messages
- **Loading States**: Spinner while fetching doctor data
- **Responsive**: Works on mobile, tablet, and desktop

## Testing

1. Select different doctors → Verify age groups change
2. Select age group → Verify symptoms appear
3. Select symptoms → Verify they highlight
4. Try booking without selections → Verify validation errors
5. Test on mobile → Verify responsive design

## Future Enhancements

- Admin panel to configure age groups and symptoms per doctor
- Analytics on most selected symptoms per doctor
- Symptom-based doctor recommendations
- Integration with AI chatbot for symptom analysis

