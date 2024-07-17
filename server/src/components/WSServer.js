import { WebSocketServer } from "ws"

export default class WSServer {
  static Instance = null

  constructor(server, port) {
    if (WSServer.Instance) return WSServer.Instance
    this.port = port
    this.wss = new WebSocketServer({ server })
    this.inited = false
    this.Bot = null
    WSServer.Instance = this
  }

  onClose() {
    console.log("Бот отключился!")
    return this.Bot = null
  }

  onConnection(ws) {
    console.log("Бот успешно подключился к серверу!")
    this.Bot = ws
    ws.send("Бот успешно установил подключение к серверу!")
    ws.on("error", console.error)
    ws.on("close", this.onClose.bind(this))
  }

  start() {
    if (this.inited) return
    this.inited = true

    this.wss.on("connection", this.onConnection.bind(this))
    console.log(`Websocket server стартовал на порту ${this.port}!\nОжидание подключения бота...\n`)
  }

  async sendToBot(messageId, action, data={}) {
    if (!this.Bot) return { status: "InternalError", message: "Server isn't connected to a Bot!" }

    let res = await new Promise((resolve, reject) => {
      const message = { id: messageId, action, data }

      this.Bot.send(JSON.stringify(message)) // send message to bot

      const messageHandler = (response) => {
        const parsedResponse = JSON.parse(response)
        if (parsedResponse.id === messageId) {
          clearTimeout(timeout)
          resolve(parsedResponse.data)
          this.Bot.off("message", messageHandler)
        }
      }
      this.Bot.on("message", messageHandler)

      const timeout = setTimeout(() => {
        this.Bot.off("message", messageHandler)
        reject(new Error("Bot did not respond in time!"))
      }, 5000) // 5 seconds timeout
    }).catch(err => new Object({ status: "InternalError", message: err.message }))

    return res
  }
}