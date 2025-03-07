import { Router } from "express"
import AuthHandler from "../services/AuthHandler.js"
import tokenMiddleware from "../middlewares/token.js" 

const router = new Router()

router.get("/discord", AuthHandler.discord)
router.post("/token", tokenMiddleware, AuthHandler.token)
router.get("/refresh", AuthHandler.refresh)
router.get("/logout", AuthHandler.logout)

export default router