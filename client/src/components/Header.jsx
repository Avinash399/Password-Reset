import { useContext } from "react"
import { assets } from "../assets/assets"
import { AppContent } from "../contexts/AppContext"

const Header = () => {

  const {userData} = useContext(AppContent)

  return (
    <div className="flex flex-col items-center text-center mt-20 px-4 text-gray-800">

      <img src={assets.header_img} alt="" className="animate-bounce transition-all w-36 h-36 rounded-full mb-6" />

      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.name : "Developers"}! 
        <img src={assets.hand_wave} alt="" className="hand w-8 aspect-square inline-block" />
      </h1>

      <h2 className="welcome text-3xl sm:text-5xl font-semibold mb-4">Welcome to our app</h2>
      <p className="mb-8 max-w-md">Let's start with a quickproduct tour and we will have you up and running in no time!</p>

      <button className="border border-t-orange-400 border-gray-500 px-8 py-2.5 rounded-full hover:bg-orange-200 transition-all cursor-pointer md:bg-none bg-gradient-to-r from-orange-200 to-orange-500">Get Started</button>

    </div>
  )

}

export default Header