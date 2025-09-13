import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";


export const AppContent = createContext()

export const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [isLoggedin, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(false)

  axios.defaults.withCredentials = true

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth')
      if (data.success) {
        setIsLoggedIn(true)
        getUserData()
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data")
      data.success ? setUserData(data.userData) : toast.error(error.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getAuthState()
  }, [])

  const value = {

    backendUrl,
    isLoggedin, setIsLoggedIn,
    userData, setUserData,
    getUserData
  }

  return (
    <AppContent.Provider value={value}>
      {children}
    </AppContent.Provider>
  )
}