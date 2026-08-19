const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function registerUser(req, res) {
  const { email, username, password } = req.body

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  })

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "user already exists",
    })
  }

  const hash = await bcrypt.hash(password, 10)

  const user = await userModel.create({
    email,
    username,
    password: hash,
  })

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  )

  res.cookies("token", token)

  return res.status(200).json({
    message: "user registered successfully",
    user,
  })
}

module.exports = {
  registerUser,
}
