import { useContext, useState } from "react"
import { assets } from "../assets/assets"
import { useNavigate } from "react-router-dom"
import { AppContent } from "../contexts/AppContext"
import axios from 'axios'
import { toast } from "react-toastify"

const Login = () => {

  const navigate = useNavigate()

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent)

  const [state, setState] = useState('sign-up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()

      axios.defaults.withCredentials = true

      if (state === 'sign-up') {
        const { data } = await axios.post(backendUrl + "/api/auth/register", { name, email, password },{withCredentials: true})

        if (data.success) {
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
        } else {
          toast.error("data-error2 ",data.message)
        }
      }
      else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", { email, password }, {withCredentials: true})
        console.log('data',data)
        if (data.success) {
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
        } else {
          toast.error("data-error2 ",data.message)
        }
      }

    } catch (error) {
      toast.error("error",error.response?.data?.message)
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 ">

      <img onClick={() => navigate('/')} className="absolute left-5 sm:left-20 top-5 w-20 sm:w-24 cursor-pointer bounce-in"
        src={"https://img.pikbest.com/png-images/20241002/aggressive-bull-logo-vector-design-art_10918699.png%21bw700"} alt="" />

      <div className="bg-slate-900 p-10 text-indigo-300 rounded-lg shadow-xl/30 w-full sm:w-96 text-sm">
        <h2 className="text-3xl text-center font-semibold text-white mb-3">{state === 'sign-up' ? "Create Account" : "Login"}</h2>

        <p className="text-center mb-6 text-sm">{state === 'sign-up' ? "Create Your Account" : "Login To Your Account"}</p>

        <form onSubmit={onSubmitHandler}>

          {state === 'sign-up' && <div className="flex gap-3 items-center mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.person_icon} alt="" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="bg-transparent outline-none p-1" type="text" placeholder="Full name" required />
          </div>}

          <div className="flex gap-3 items-center mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none p-1" type="email" placeholder="Email id" required />
          </div>

          <div className="flex gap-3 items-center mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none p-1" type="password" placeholder="password" required />
          </div>

          <p className="mb-4 text-indigo-500 cursor-pointer">
            <span onClick={() => navigate('/reset-password')}>Forgot Password?</span>
          </p>

          <button className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">{state}</button>

        </form>
        {state === 'sign-up' ?
          (<p className="text-center text-sm mt-4 text-gray-400">Already have an account?{' '} <span onClick={() => setState('login')}
            className="text-blue-400 cursor-pointer underline ml-1">Login</span></p>)
          :
          (<p onClick={() => setState('sign-up')}
            className="text-center text-sm mt-4 text-gray-400">Don't have an account?{' '} <span className="text-blue-400 cursor-pointer underline ml-1">Sign-up</span></p>)
        }
      </div>

    </div>
  )
}

export default Login