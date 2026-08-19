const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required."],
    unique: [true, "email must be unique."],
  },
  username: {
    type: String,
    required: [true, "username is required."],
    unique: [true, "username must be unique"],
  },
  password: {
    type: string,
    required: [true, "password is required"],
  },
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel