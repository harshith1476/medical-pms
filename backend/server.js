import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import jobApplicationRouter from "./routes/jobApplicationRoute.js"
import emergencyRouter from "./routes/emergencyRoute.js"
import aiRouter from "./routes/aiRoute.js"
import specialtyRouter from "./routes/specialtyRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/jobs", jobApplicationRouter)
app.use("/api/emergency", emergencyRouter)
app.use("/api/ai", aiRouter)
app.use("/api/specialty", specialtyRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))