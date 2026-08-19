const { Router } = require("express")
const router = Router()
const authController = require("../controllers/auth.controller")

router.post("/register", authController.registerUser)

module.exports = router
