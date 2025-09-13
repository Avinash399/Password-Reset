import jwt from 'jsonwebtoken'

export const userAuth = async (req, res, next) => {

  const { token } = req.cookies;
  console.log(token)
  if (!token) {
    return res.status(400).json({ success: false, message: "Not Authorized. Login Again" })
  }
  try {

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

    if (tokenDecode.id) {
      req.userId = tokenDecode.id
    }
    else {
      return res.status(400).json({ success: false, message: "Not Authorized. Login Again" })
    }

    next()

  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }

}