import { Router } from "express";
import apiHandler from "../services/ApiHandler.js"
import requiredAuth from "../middlewares/requiredAuth.js";

const router = new Router()
router.use(requiredAuth)

router.get("/getUserGuilds/", apiHandler.getUserGuilds)
router.get("/getOptions/:guildID", apiHandler.getOptions)
router.get("/getNotification/:guildID", apiHandler.subscribe)
router.patch("/updateOptions/:guildID", apiHandler.updateOptions)

export default router