import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import { getUserData } from "../controller/authController.js";

const userRoute = express.Router()

userRoute.get('/data', userAuth, getUserData)

export default userRoute