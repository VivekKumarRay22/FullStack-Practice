const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const redis = require("../config/cache")

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

async function loginUser(req, res) {
  const { username, email, password } = req.body

  const user = await userModel
    .findOne({
      $or: [{ email }, { username }],
    })
    .select("+password")

  if (!user) {
    return res.status(400).json({
      message: "invalid credentials",
    })
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    return res.status(400).json({
      messsage: "Invalid credentials",
    })
  }

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

  res.cookie("token", token)
  return res.status(200).json({
    message: "User successfully logged In.",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  })
}

async function getMe(req, res) {
  const user = await userModel.findById(req.user.id)
  res.status(200).json({
    message: "user fetched successfully ",
    user,
  })
}

async function logoutUser(req, res) {
  const token = req.cookies.token

  res.clearCookie("token")

  await redis.set(token, Date.now().toString(), "EX", 60 * 60)

  res.status(200).json({
    message: "Log out successfully. ",
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
}
