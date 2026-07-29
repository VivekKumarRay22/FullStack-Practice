const express = require("express")
const userModel = require("../models/user.model")
const authRouter = express.Router()
const crypto = require("crypto")
const jwt = require("jsonwebtoken")



/**
 * * @routes POST /api/auth/register
 */
authRouter.post("/register", async (req, res) => {
    const { username, email, password, bio, profileImage } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserAlreadyExists) {
        res.status(409).json({
            message: "user already exists with" + (isUserAlreadyExists.username === username ? "username" : "email")
        })
    }

    const hash = crypto.createHash("sha256").update(password).digest("hex")

    const user = await userModel.create({
        username,
        email,
        password: hash,
        bio,
        profileImage
    })
    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: "1d" })


    res.cookie("token", token)

    res.status(201).json({
        message: "user registered successfully",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })

})






module.exports = authRouter