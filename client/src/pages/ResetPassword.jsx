import { useNavigate } from "react-router-dom"
import { assets } from '../assets/assets'
import { useContext, useState } from "react"
import { AppContent } from "../contexts/AppContext"
import axios from "axios"
import { toast } from "react-toastify"


const ResetPassword = () => {

  axios.defaults.withCredentials = true

  const navigate = useNavigate()

  const { backendUrl } = useContext(AppContent)

  const [email, setEmail] = useState('')
  const [isOtp, setIsOtp] = useState('')
  const [password, setPassword] = useState('')

  const [isOtpSubmited, setIsOtpSubmited] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)

  const handleSentEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)

    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSentOtp = async (e) => {
    e.preventDefault();
    try {
      setIsOtpSubmited(true)
      setOtp(isOtp)

    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword: password })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')

    } catch (error) {
      toast.error(error.message)
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 ">

      <img onClick={() => navigate('/')} className="absolute left-5 sm:left-20 top-5 w-20 sm:w-24 cursor-pointer bounce-in"
        src={"https://img.pikbest.com/png-images/20241002/aggressive-bull-logo-vector-design-art_10918699.png%21bw700"} alt="" />

      {/* OTP sent on email */}
      {!isEmailSent &&
        <form onSubmit={handleSentEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">

          <h1 className='text-white text-2xl text-center font-semibold mb-4'>Reset Password</h1>
          <p className='text-center text-indigo-300 mb-6'>Enter your registered email id.</p>

          <div className="flex gap-3 items-center mb-6 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-4 h-4" />
            <input className="bg-transparent outline-none p-1 text-white" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <button className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">Submit</button>

        </form>}

      {/* OTP verify */}
      {isEmailSent && !isOtpSubmited &&
        <form onSubmit={handleSentOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">

          <h1 className='text-white text-2xl text-center font-semibold mb-4'>Verify OTP</h1>
          <p className='text-center text-indigo-300 mb-6'>Enter your 6-digit's code.</p>

          <div className="flex gap-3 items-center mb-6 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <input className="bg-transparent outline-none p-1 text-white text-center w-full" type="text" placeholder="OTP" value={isOtp} onChange={(e) => setIsOtp(e.target.value)} required />
          </div>

          <button className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">Submit</button>

        </form>}

      {/* New password here */}
      {isEmailSent && isOtpSubmited &&
        <form onSubmit={handleNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">

          <h1 className='text-white text-2xl text-center font-semibold mb-4'>New Password</h1>
          <p className='text-center text-indigo-300 mb-6'>Enter your new password</p>

          <div className="flex gap-3 items-center mb-6 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-4 h-4" />
            <input className="bg-transparent outline-none p-1 text-white w-full" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">Submit</button>

        </form>}

    </div>
  )
}

export default ResetPassword