const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function registerController(req, res) {
    const { username, email, password, bio, profileImage } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserAlreadyExists) {
        res.status(409).json({
            message: "user already exists with" + (isUserAlreadyExists.username === username ? "username" : "email")
        })
    }

    const hash = await bcrypt.hash(password,10)

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

}

async function loginController(req, res) {
    const { username, email, password } = req.body

    const user = await userModel.findOne({
        $or: [{ username: username }, { email: email }]
    })

    if (!user) {
        return res.status(404).json({
            message: "user does not exist"
        })
    }

    const hash = await bcrypt.hash(password,10)

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign({ id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" })


    res.cookie("token", token)

    res.status(200).json({
        message: "user logged in successfully",
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

module.exports = {
    registerController, loginController
}