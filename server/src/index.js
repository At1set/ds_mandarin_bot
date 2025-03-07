import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { createServer } from "http"
import { TokenDataBase } from "./services/Database.js"

import ApiRouter from "./Routes/ApiRouter.js"
import AuthRouter from "./Routes/AuthRouter.js"
import errorMiddleware from "./middlewares/error.js"

const app = express()
const server = createServer(app)


import dotenv from "dotenv"
dotenv.config()
const port = process.env.PORT || 8000

import WSServer from "./services/WSServer.js"
const wsServer = new WSServer()
wsServer.start({server, port})

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json())

app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  })
)

app.use("/api", ApiRouter)
app.use("/auth", AuthRouter)
app.use(errorMiddleware)

async function start() {
  try {
    server.listen(port, () => {
      console.log(`Сервер стартовал на порту: ${port}!`)
    })
    const token_store = new TokenDataBase(
      "localhost",
      "root",
      "",
      "ds_mandarin_bot"
    )
    await token_store.connect()
  } catch (error) {
    console.log(`Произошла ошибка при старте сервера!`);
    throw error
  }
}

start()