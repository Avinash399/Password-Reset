import jwt from 'jsonwebtoken'
import bcrypt, { hash } from 'bcryptjs'
import userModel from '../models/userSchema.js'
import transpoter from '../config/nodemailer.js'


export const register = async (req, res) => {

  const { email, name, password } = req.body

  if (!email || !name || !password) {
    return res.status(400).json({ success: false, message: "Please fill the all feilds!" })
  }
  try {
    const existingUser = await userModel.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already register! try another" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await new userModel({ email, name, password: hashedPassword })
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // sending welcome email
    const mailOption = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Welcome to Aggresive",
      text: `Welcome to our aggresive community. Your account has been created with email id: ${email}`
    }

    await transpoter.sendMail(mailOption)

    return res.status(200).json({ success: true })

  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const login = async (req, res) => {

  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "email and password are required" })
  }
  try {

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({ success: true })

  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    return res.status(200).json({ success: true, message: "Logged out" })
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId

    const user = await userModel.findById(userId)
    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: 'Account already verified' })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp,
      user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000
    await user.save()

    const mailOption = {
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your account verification OTP is ${otp}. Verify your account with this OTP. Make sure It will expire in 10 minutes.`
    }

    await transpoter.sendMail(mailOption)

    res.status(200).json({ success: true, message: 'Verification OTP send on your email' })

  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const verifyEmail = async (req, res) => {

  const userId = req.userId
  const { otp } = req.body
  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing Details" })
  }
  try {
    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" })
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP Expired" })
    }

    user.isAccountVerified = true,
      user.verifyOtp = undefined,
      user.verifyOtpExpireAt = undefined

    await user.save()
    return res.status(200).json({ success: true, message: "Email verification successfully" })

  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }

}

export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const sendResetOtp = async (req, res) => {

  const { email } = req.body
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" })
  }
  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000))

    user.resetOtp = otp,
      user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000
    await user.save()

    const mailOption = {
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is ${otp}. Verify your account using this OTP. Make sure It will expire in 10 minutes.`
    }

    await transpoter.sendMail(mailOption)

    res.status(200).json({ success: true, message: 'OTP send to your email' })

  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }

}

export const resetPassword = async (req, res) => {

  const { email, otp, newPassword } = req.body
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "All feilds are required" })
  }
  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" })
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP Expired" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword,
      user.resetOtp = undefined,
      user.resetOtpExpireAt = undefined,
      user.verifyOtp = undefined,
      user.verifyOtpExpireAt = undefined

    await user.save()

    return res.status(200).json({ success: true, message: "Password updated successfully" })
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }

}

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId
    console.log(userId)
    if (!userId) {
      return res.status(400).json({ success: false, message: "Not Authorized. Please login" })
    }

    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified
      }
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}