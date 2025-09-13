import { useContext, useEffect, useState } from "react"
import axios from 'axios'
import { AppContent } from "../contexts/AppContext"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"


const EmailVerify = () => {

  const [otp, setOtp] = useState('')

  const {backendUrl, isLoggedin, getUserData, userData} = useContext(AppContent)
  const navigate = useNavigate()

const handleVerify = async(e) =>{
  e.preventDefault()
  // console.log(inputVal)
  try {
    axios.defaults.withCredentials = true
    const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp})
    if(data.success){
      toast.success(data.message)
      getUserData()
      navigate('/')
    }
    else {
      toast.error(data.message)
    }

  } catch (error) {
    toast.error(error.message)
  }
}

useEffect(() => {
  isLoggedin && userData && userData.isAccountVerified && navigate('/')
},[isLoggedin, userData])

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 ">

      <img onClick={() => navigate('/')} className="absolute left-5 sm:left-20 top-5 w-20 sm:w-24 cursor-pointer bounce-in"
        src={"https://img.pikbest.com/png-images/20241002/aggressive-bull-logo-vector-design-art_10918699.png%21bw700"} alt="" />

      <form onSubmit={handleVerify} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">

        <h1 className='text-white text-2xl text-center font-semibold mb-4'>Email Verify OTP</h1>
        <p className='text-center text-indigo-300 mb-6'>Enter the 6-digit code sent on your email id.</p>

  
            <input type="text" required
            className='w-full h-12 mb-4 bg-[#333A5C] text-center text-white text-lg rounded-md' placeholder='OTP'
            onChange={(e) =>setOtp(e.target.value)}
            />
          

        <button className='w-full text-white py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full'>Verify email</button>

      </form>

    </div>
  )
}

export default EmailVerify