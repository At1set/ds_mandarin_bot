import WSServer from "./WSServer.js"

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
        return console.log("Пизда нахуй");
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
    const guildID = +req.query.guildID

    let botMessage = await WSServer.Instance.sendToBot(
      guildID,
      "get_config"
    )
    const { status } = botMessage

    if (status === "InternalError") {
      console.log(botMessage)
      return res.status(500).json(botMessage)
    }
    if (status === "error") {
      console.log(botMessage)
      return res.status(500).json(botMessage)
    }

    return res.status(200).json(botMessage)
  }

  async updateOptions(req, res) {
    console.log("updateOptions")
    const guildID = +req.params.guildID

    if (!this.subscribers[guildID]) {
      console.log("Не найден такой подписчик, запрос идет нахуй!")
      try {
        return res
          .status(400)
          .json({ message: "Вы не подписаны на уведомление от бота!" })
      }
      catch {
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

    console.log(newOptions);
    let botMessage = await WSServer.Instance.sendToBot(guildID, "update_config", newOptions)
    const { status } = botMessage

    if (!this.subscribers[guildID] || this.subscribers[guildID]["status"] === "wait") return console.log(`Нет уже такого запроса!`);

    const { response } = this.subscribers[guildID]
    if (status === "InternalError") {
      console.log(botMessage)
      return response.status(500).json(botMessage)
    }
    if (status === "error") {
      console.log(botMessage)
      return response.status(500).json(botMessage)
    }

    return response.status(200).json(botMessage)
  }
}

export default new ApiHandler()
