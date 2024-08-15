import { Router } from "express"
import AuthHandler from "../components/AuthHandler.js"

const router = new Router()

router.get("/authorize", AuthHandler.authorize.bind(AuthHandler))
router.post("/tocken", AuthHandler.tocken.bind(AuthHandler))
router.get("/killSession", AuthHandler.killSession.bind(AuthHandler))
router.get("/logout", AuthHandler.logout.bind(AuthHandler))

export default router