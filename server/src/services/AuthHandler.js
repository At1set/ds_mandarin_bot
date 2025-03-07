import { v4 } from "uuid"
import ApiError from "../exceptions/ApiError.js";
import axios from "axios";
import Token from "./Token.js";
import jwt from "jsonwebtoken"

const SCOPES = ["identify", "guilds", "email"]
const REDIRECT_URI = "http://localhost:3000/auth"

class AuthHandler {
  constructor() {}

  async discord(req, res, next) {
    console.log("http://localhost:3000/auth/")
    try {
      const state = v4()

      res.cookie("state", state, { httpOnly: true, sameSite: "Strict" })

      const discordAuthUrl = `https://discord.com/oauth2/authorize?
      client_id=${process.env.CLIENT_ID}
      &redirect_uri=${encodeURIComponent(REDIRECT_URI)}
      &response_type=code
      &scope=${SCOPES.join("+")}
      &state=${state}`.replace(/\n      /gm, "")

      res.redirect(302, discordAuthUrl)
    } catch (error) {
      next(error)
    }
  }

  async token(req, res, next) {
    console.log("http://localhost:8000/auth/token");
    try {
      const { code } = req.data

      const tokenResponse = await axios.post(
        "https://discord.com/api/oauth2/token",
        new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      )

      const { access_token : discord_access_token, refresh_token : discord_refresh_token } =
        tokenResponse.data

      // Получаем данные об авторизации
      const authResponse = await axios.get(
        "https://discord.com/api/oauth2/@me",
        {
          headers: { Authorization: `Bearer ${discord_access_token}` },
        }
      )

      const authData = authResponse.data
      const { user, expires } = authData
      
      console.log(authData)

      // Тут генерим jwt токены
      const { access_token, refresh_token } = Token.generateTokens({user}, expires)
      const refresh_session = {
        userId: user.id, 
        refresh_token,
        ua: req.headers["user-agent"],
        fingerprint: "fingerprint",
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
        expiresIn: tokenResponse.data.expires_in+"s"
      }

      const saveTokenResponse = await Token.saveToken(refresh_session)
      if (saveTokenResponse.error) throw saveTokenResponse.error

      res.cookie("refresh_token", refresh_token, {httpOnly: true, maxAge: 30 * 1000})

      res.clearCookie("state")
      return res.status(200).json({
        token: access_token,
        user
      })
    } catch (error) {
      if (error instanceof axios.AxiosError) next(ApiError.TokenExchangeFailed([error.response.data]))
      next(error)
    }
  }


  async refresh (req, res, next) {
    try {
      
    } catch (error) {
      
    }
  }


  async logout(req, res, next) {
    try {
      
    } catch (error) {
      next(error)
    }
    
  }
}

export default new AuthHandler()