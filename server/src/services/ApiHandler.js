import WSServer from "./WSServer.js"
import axios from "axios"
import { v4 } from "uuid"
import ApiError from "../exceptions/ApiError.js"

const subscribers = {}

class ApiHandler {
  async subscribe(req, res, next) {
    try {
      const guildID = req.params.guildID
      console.log(`Новая подписка! id:${guildID} `)

      if (subscribers[guildID]) throw ApiError.BadRequest(
        "You have already subscribed to notifications from the bot!"
      )

      const timeout = setTimeout(() => {
        // ТАЙМАУТ ДО ОБРАЩЕНИЯ КЛИЕНТА ПО ЭНДПОИНТУ updateConfig (newOptions)
        return next(
          ApiError.BadRequest(
            "Time's up. The server has reject your subscription!"
          )
        )
      }, 2000)

      subscribers[guildID] = {
        timeout: timeout,
        response: res,
        status: "wait",
      }

      const onClose = () => {
        delete subscribers[guildID]
        console.log(`Удаление ключа: ${guildID}`)
        return req.off("close", onClose)
      }
      req.on("close", onClose)
    } catch (error) {
      next(error)
    }
  }

  async getOptions(req, res, next) {
    try {
      console.log("getOptions")
      const guildID = req.params.guildID
      let botMessage = await WSServer.Instance.sendToBot(guildID, "get_config")
      const { status, message } = botMessage
      if (status === "ok") return res.status(200).json({message})
      else throw new ApiError(500, "Bot error", [message])
    } catch (error) {
      next(error)
    }
  }

  async updateOptions(req, res, next) {
    try {
      console.log("updateOptions")
      const guildID = req.params.guildID

      if (!subscribers[guildID]) {
        throw ApiError.BadRequest("Вы не подписаны на уведомление от бота!")
      } else {
        const { status } = subscribers[guildID]
        console.log(status)
        if (status === "wait") {
          subscribers[guildID]["status"] = "processing"
        } else {
          throw ApiError.BadRequest("Ваш запрос уже обрабатывается!")
        }
        console.log(subscribers[guildID]["status"])
      }
      const newOptions = req.body

      if (Object.keys(req.body).length == 0) throw ApiError.BadRequest("Вы прислали некоректные данные!")

      subscribers[guildID]["options"] = newOptions

      const { timeout } = subscribers[guildID]
      clearTimeout(timeout)

      res.status(200).json({ message: "Данные успешно получены!" })

      console.log(newOptions)
      let botMessage = await WSServer.Instance.sendToBot(
        guildID,
        "update_config",
        newOptions
      )
      const { status } = botMessage
      const { response } = subscribers[guildID]

      console.log(botMessage)
      if (status === "ok") {
        return response.status(200).json(botMessage)
      } else throw new ApiError(500, "Bot error", [message])
    } catch (error) {
      next(error)
    }
  }

  async getUserGuilds(req, res, next) {
    try {
      console.log("getUserGuilds")

      const tocken = req.query?.tocken
      if (!tocken)
        return res.status(400).json({
          status: "error",
          message: "Вы не указали tocken!",
        })

      let userGuilds = null
      try {
        const request = await axios.get(
          "https://discord.com/api/users/@me/guilds",
          {
            headers: {
              Authorization: `Bearer ${tocken}`,
            },
          }
        )
        userGuilds = request.data
        userGuilds = userGuilds.filter((guild) => guild.owner) // Получаем гильдии, которые принадлежат пользователю
      } catch (error) {
        if (error instanceof axios.AxiosError) {
          return res.status(error.response?.status || 500).json({
            status: "InternalError",
            message:
              error.response?.data ||
              "Сервер не смог получить гильдии пользователя!",
          })
        } else throw error
      }

      const botMessage_id = v4()
      const userGuildsIdArray = userGuilds.map((guild) => guild.id)
      let botMessage = await WSServer.Instance.sendToBot(
        botMessage_id,
        "getUserGuilds",
        userGuildsIdArray
      )
      const { status, message } = botMessage

      if (status === "ok" && message) {
        userGuilds.forEach((guild, index) => {
          guild.isBot = message[index]
        })
        return res.status(200).json(userGuilds)
      }
      console.log(botMessage)
      return res.status(500).json(botMessage)
    } catch (error) {
      next(error)
    }
  }
}

export default new ApiHandler()
