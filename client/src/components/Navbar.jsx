import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useContext, useState } from 'react'
import { AppContent } from '../contexts/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {

  const [open, setOpen] = useState(false)

  const navigate = useNavigate()
  const { backendUrl, userData, setUserData, setIsLoggedIn } = useContext(AppContent)

  const logout = async () => {
    axios.defaults.withCredentials = true
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout")
      data.success && setIsLoggedIn(false)
      data.success && setUserData(false)
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if (data.success) {
        navigate('/email-verify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='absolute top-0 flex justify-between items-center w-full p-4 sm:p-6 sm:px-24'>
      <img src={"https://img.pikbest.com/png-images/20241002/aggressive-bull-logo-vector-design-art_10918699.png%21bw700"} alt="" className='w-20 sm:w-24 bounce-in' />

      {userData ?
        <div onClick={() => setOpen(!open)}
          className='md:w-12 md:h-12 w-9 h-9 rounded-full flex justify-center items-center bg-black text-white text-2xl relative group'>
          {userData.name[0].toUpperCase()}

          <div className={`absolute top-12 right-0 z-10 rounded text-black bg-gray-100 text-sm transition-all ${open ? "block" : "hidden"} group-hover:block`}>

            <ul className='list-none p-2 m-0 bg-gray-100 text-sm'>
              {!userData.isAccountVerified &&
                <li onClick={sendVerificationOtp} className='px-2 py-1 cursor-pointer hover:bg-gray-200'>verify email</li>
              }
              <li onClick={logout} className='px-2 py-1 cursor-pointer hover:bg-gray-200 pr-10'>Logout</li>
            </ul>

          </div>

        </div>
        :
        <button onClick={() => navigate('/login')}
          className='flex gap-2 px-6 py-2 border border-gray-500 rounded-full hover:bg-gray-100 transition-all items-center text-gray-800 cursor-pointer md:bg-none bg-gradient-to-r from-sky-100 to-sky-300'>Login <img src={assets.arrow_icon} alt="" /></button>
      }
    </div>
  )

}

export default Navbar