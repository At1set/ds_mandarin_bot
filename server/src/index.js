import express from "express"
import cors from "cors"
import { createServer } from "http"
const app = express()
const server = createServer(app)
import WSServer from "./components/WSServer.js"


import dotenv from "dotenv"
dotenv.config()
const port = process.env.PORT || 8000

app.use(express.json())
const wsServer = new WSServer(server, port)
wsServer.start()

// app.use((req, res, next) => {
//   console.log(req.get("Cookie"))
//   next()
// })

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      // "http://191.168.0.191:3000"
    ],
    credentials: true,
  })
)

import session from "express-session"
// Создаем хранилище сессий в памяти
const MemoryStore = session.MemoryStore;
const sessionStore = new MemoryStore();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 5 * 60_000,
      path: "/auth",
    },
  })
)

app.use((req, res, next) => {
  if (!sessionStore?.sessions) return next()
  const sessionCount = Object.keys(sessionStore.sessions).length
  console.log(`Количество сессий: ${sessionCount}`)
  next()
})

import ApiRouter from "./Routes/ApiRouter.js";
import AuthRouter from "./Routes/AuthRouter.js";


app.use("/api", ApiRouter)
app.use("/auth", AuthRouter)


server.listen(port, () => {
  console.log(`Сервер стартовал на порту: ${port}!`)
})