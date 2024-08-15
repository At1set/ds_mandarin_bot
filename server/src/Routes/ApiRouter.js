import { Router } from "express";
import ApiHandler from "../components/ApiHandler.js"

const router = new Router()

router.get("/getUserGuilds/", ApiHandler.getUserGuilds.bind(ApiHandler))
router.get("/getOptions/", ApiHandler.getOptions.bind(ApiHandler))
router.get("/getNotification/:guildID", ApiHandler.subscribe.bind(ApiHandler))
router.patch("/updateConfig/:guildID", ApiHandler.updateOptions.bind(ApiHandler))

export default router