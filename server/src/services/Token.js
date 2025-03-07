import jwt from "jsonwebtoken"
import { TokenDataBase } from "./Database.js"

class Token {
  static generateTokens(payload, expires) {
    const access_token = jwt.sign({
      ...payload,
      exp: Math.floor(new Date(expires).getTime() / 1000)
    }, process.env.JWT_ACCESS_SECRET)
    const refresh_token = jwt.sign({}, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "60d",
    })
    return {
      access_token,
      refresh_token,
    }
  }

  static validateAccessToken(token) {
    try {
      const token_data = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return token_data
    } catch (e) {
      return null
    }
  }

  static validateRefreshToken(token) {
    try {
      const token_data = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return token_data
    } catch (e) {
      return null
    }
  }

  static async saveToken({userId, refresh_token, ua, fingerprint, ip, expiresIn}) {
    if (!userId || !refresh_token || !ua || !fingerprint || !expiresIn) throw new Error("Были переданы не все аргументы!");
    
    return await TokenDataBase.Instance.saveToken(
      userId,
      refresh_token,
      ua,
      fingerprint,
      ip,
      expiresIn
    )
  }

  static async removeToken(refresh_token) {
    return await TokenDataBase.Instance.removeSession(refresh_token)
  }

  static async findToken(refresh_token) {
    return await TokenDataBase.Instance.findSession(refresh_token)
  }
}

export default Token
