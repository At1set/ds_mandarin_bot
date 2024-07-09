import { Router } from "express";
import ApiHandler from "./ApiHandler.js"

const router = new Router()

router.get("/getNotification/:guildID", ApiHandler.subscribe.bind(ApiHandler))
router.patch("/updateConfig/:guildID", ApiHandler.newOptions.bind(ApiHandler))

export default router