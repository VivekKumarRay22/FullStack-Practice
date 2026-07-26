const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "username already exists!"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already registered"]
    },
    password: {
        type: String,
        required: [true, "password id required"]
    },
    bio: {
        type: String,
        default: ""
    },
    profileImage: {
        type: String,
        default: "https://ik.imagekit.io/devShadow/cohort2-insta-clone/Test_jMEt6ygz7?updatedAt=1783762697134"
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel