import 'dotenv/config'
import connectDB from '../config/mongodb.js'
import doctorModel from '../models/doctorModel.js'

const specialityTemplates = {
  'general physician': (name, experience) =>
    `${name} is a trusted general physician with over ${experience} of clinical experience. ` +
    `They focus on preventive health checks, management of chronic conditions, and clear, easy‑to‑understand treatment plans.`,

  'gynecologist': (name, experience) =>
    `${name} is a compassionate gynecologist with ${experience} of experience in women’s health. ` +
    `They provide end‑to‑end care from adolescence to pregnancy and menopause, with a strong focus on privacy and patient comfort.`,

  'dermatologist': (name, experience) =>
    `${name} is a dermatologist with ${experience} of experience treating acne, allergies, hair loss, and pigmentation concerns. ` +
    `They combine modern therapies with skin‑care education so patients know how to care for their skin every day.`,

  'pediatricians': (name, experience) =>
    `${name} is a friendly pediatrician with ${experience} of experience caring for infants, children, and teenagers. ` +
    `They work closely with parents on growth, vaccinations, nutrition, and early detection of common childhood illnesses.`,

  'neurologist': (name, experience) =>
    `${name} is an experienced neurologist with ${experience} of practice in managing migraines, seizure disorders, stroke care, and nerve‑related problems. ` +
    `They believe in detailed evaluations and long‑term follow‑up to improve quality of life.`,

  'gastroenterologist': (name, experience) =>
    `${name} is a gastroenterologist with ${experience} of experience treating acidity, IBS, liver diseases, and other digestive issues. ` +
    `They focus on diet, lifestyle, and personalized treatment plans for lasting relief.`
}

const fallbackTemplate = (name, experience, speciality) =>
  `${name} is an experienced ${speciality.toLowerCase()} with ${experience} of clinical experience. ` +
  `They are known for their patient‑centric approach, clear communication, and focus on long‑term health outcomes.`

const getTemplate = (speciality = '') => {
  const key = speciality.toLowerCase()
  if (key in specialityTemplates) return specialityTemplates[key]
  return null
}

const run = async () => {
  try {
    await connectDB()
    const doctors = await doctorModel.find({})
    console.log(`Found ${doctors.length} doctors. Updating 'about' text...`)

    for (const doc of doctors) {
      const name = doc.name || 'The doctor'
      const speciality = doc.speciality || 'doctor'
      const experience = doc.experience || 'several years'

      const tpl = getTemplate(speciality)
      const about = tpl
        ? tpl(name, experience)
        : fallbackTemplate(name, experience, speciality)

      doc.about = about
      await doc.save()
      console.log(`✅ Updated: ${name} (${speciality})`)
    }

    console.log('All doctor profiles have been updated with unique about descriptions.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating doctor about fields:', error)
    process.exit(1)
  }
}

run()


