import WSServer from "./WSServer.js"
import axios from "axios"
import { v4 } from "uuid"

class ApiHandler {
  constructor() {
    this.configPath =
      "D:/рабочий стол/Проекты ''Гениального'' верстальщика/ds_mandarin_bot/src/options.json"
    this.subscribers = {}
  }

  subscribe(req, res) {
    console.log("Subscribe")
    const guildID = req.params.guildID
    if (this.subscribers[guildID]) return console.log("Ошибка")

    const timeout = setTimeout(() => {
      // ТАЙМАУТ ДО ОБРАЩЕНИЯ КЛИЕНТА ПО ЭНДПОИНТУ updateConfig (newOptions)
      console.log("Время вышло. Сервер прервал вашу подписку!")
      try {
        return res
          .status(400)
          .json({ message: "Время вышло. Сервер прервал вашу подписку!" })
      } catch (error) {
        return console.log("Пизда нахуй")
      }
    }, 2000)

    this.subscribers[guildID] = {
      timeout: timeout,
      response: res,
      status: "wait",
    }

    const onClose = () => {
      delete this.subscribers[guildID]
      console.log(`Удаление ключа: ${guildID}`)
      return req.off("close", onClose)
    }
    req.on("close", onClose)
  }

  async getOptions(req, res) {
    console.log("getOptions")
    const guildID = req.query.guildID

    let botMessage = await WSServer.Instance.sendToBot(guildID, "get_config")
    const { status } = botMessage

    if (status === "ok") {
      return res.status(200).json(botMessage)
    }
    console.log(botMessage)
    return res.status(500).json(botMessage)
  }

  async updateOptions(req, res) {
    console.log("updateOptions")
    const guildID = req.params.guildID

    if (!this.subscribers[guildID]) {
      console.log("Не найден такой подписчик, запрос идет нахуй!")
      try {
        return res
          .status(400)
          .json({ message: "Вы не подписаны на уведомление от бота!" })
      } catch {
        return console.log("Скипаю ошибочку")
      }
    } else {
      const { status } = this.subscribers[guildID]
      console.log(this.subscribers[guildID]["status"])
      if (status === "wait") {
        this.subscribers[guildID]["status"] = "processing"
      } else {
        console.log("Ваш запрос уже обрабатывается!")
        return res
          .status(400)
          .json({ message: "Ваш запрос уже обрабатывается!" })
      }
      console.log(this.subscribers[guildID]["status"])
    }
    const newOptions = req.body

    if (Object.keys(req.body).length == 0)
      return res
        .status(400)
        .json({ message: "Вы прислали некоректные данные!" })

    this.subscribers[guildID]["options"] = newOptions

    const { timeout } = this.subscribers[guildID]
    clearTimeout(timeout)

    res.status(200).json({ message: "Данные успешно получены!" })

    console.log(newOptions)
    let botMessage = await WSServer.Instance.sendToBot(
      guildID,
      "update_config",
      newOptions
    )
    const { status } = botMessage

    if (
      !this.subscribers[guildID] ||
      this.subscribers[guildID]["status"] === "wait"
    )
      return console.log(`Нет уже такого запроса!`)

    const { response } = this.subscribers[guildID]
    if (status === "ok") {
      return response.status(200).json(botMessage)
    }
    console.log(botMessage)
    return response.status(500).json(botMessage)
  }

  async getUserGuilds(req, res) {
    console.log("getUserGuilds")

    const tocken = req.query?.tocken
    if (!tocken) return res.status(400).json({
      status: "error",
      message: "Вы не указали tocken!"
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
      userGuilds = userGuilds.filter((guild) => guild.owner) // Фильтрация. Получаем гильдии, которые принадлежат пользователю
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
    const userGuildsIdArray = userGuilds.map(guild => guild.id)
    let botMessage = await WSServer.Instance.sendToBot(
      botMessage_id,
      "getUserGuilds",
      userGuildsIdArray
    )
    const { status, message } = botMessage

    if (status === "ok" && message) {
      userGuilds.forEach((guild, index) => {
        guild.isBot = message[index]
      });
      return res.status(200).json(userGuilds)
    }
    console.log(botMessage)
    return res.status(500).json(botMessage)
  }
}

export default new ApiHandler()
