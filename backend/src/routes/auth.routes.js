const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/auth.controller")


/**
 * * @routes POST /api/auth/register
 */
authRouter.post("/register", authController.registerController)


/**
 *  * @routes POST /api/auth/register
 */
authRouter.post("/login", authController.loginController)



module.exports = authRouter