const { Router } = require("express")
const router = Router()
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.post("/register", authController.registerUser)
router.post("/login", authController.loginUser)
router.get("/get-me", authMiddleware.authUser, authController.getMe)

module.exports = router
