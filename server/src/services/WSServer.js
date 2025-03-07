import { WebSocketServer } from "ws"
import ApiError from "../exceptions/ApiError.js"

export default class WSServer {
  Bot
  server
  port
  static Instance = null

  constructor() {
    if (WSServer.Instance) return WSServer.Instance
    this.Bot = null
    WSServer.Instance = this
  }

  start({ server, port, ...options }) {
    this.server = server
    this.port = port
    this.wss = new WebSocketServer({ server, ...options })
    this.wss.on("connection", this.onConnection.bind(this))
    console.log(`Websocket server стартовал на порту ${this.port}!\nОжидание подключения бота...`)
  }

  onClose() {
    console.log("Бот отключился от сервера!")
    return this.Bot = null
  }

  onConnection(ws) {
    console.log("Бот успешно подключился к серверу!")
    this.Bot = ws
    ws.send("Бот успешно установил подключение к серверу!")
    ws.on("error", console.error)
    ws.on("close", this.onClose.bind(this))
  }

  async sendToBot(messageId, action, data={}) {
    if (!this.Bot) throw ApiError.NoBotConnection()
    
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
      }, 8000) // 5 seconds timeout
    }).catch(err => {throw err})

    return res
  }
}