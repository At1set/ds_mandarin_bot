import express from "express"
import cors from "cors"
import { createServer } from "http"
const app = express()
const server = createServer(app)
import WSServer from "./components/WSServer.js"

app.use(express.json())
const wsServer = new WSServer(server)
wsServer.start()

app.use(
  cors({
    origin: '*',
  })
)

import router from "./components/Router.js";
app.use("/api", router)

const port = 8000

server.listen(port, () => {
  console.log(`Сервер стартовал на порту: ${port}!`)
})