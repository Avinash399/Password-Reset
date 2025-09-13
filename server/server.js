import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import { connectDb } from './config/mongooDb.js'
import { authRouter } from './routers/authRoutes.js'
import userRoute from './routers/userRoutes.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.PORT || 4000


app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: [
    "https://password-reset-seven.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}))

app.get('/', (req, res) => {
  return res.status(200).json({success: true, message: "Backend running"})
})

// API ENDPOINT
app.use('/api/auth', authRouter)
app.use('/api/user', userRoute)

connectDb()

app.listen(port, () => {
  console.log(`server is running ${port}`)
})