import { request } from "undici"
import { verifyChallenge } from "pkce-challenge"

class AuthHandler {
  constructor() {}

  authorize(req, res) {
    console.log("authorize");
    const { code_challenge, code_challenge_method } = req.query
    if (!code_challenge || !code_challenge_method) {
      req.session.destroy()
      return res.status(400).json({
        status: "error",
        message: "Вы не указали code_challenge и code_challenge_method!",
      })
    }
    req.session.code_challenge = code_challenge
    req.session.code_challenge_method = code_challenge_method
    return res.status(200).json({ status: "ok", message: "session open" })
  }

  async tocken(req, res) {
    console.log("tocken");
    const { code_challenge, code_challenge_method } = req.session
    if (!code_challenge || !code_challenge_method) {
      req.session.destroy()
      return res.status(400).json({
        status: "error",
        message: "В сессии отсутсвуют code_challenge и code_challenge_method!",
      })
    }

    const { code, code_verifier } = req.body

    if (!code || !code_verifier) {
      req.session.destroy()
      return res.status(400).json({
        status: "error",
        message: "Вы не указали code и code_verifier!",
      })
    }

    let check = await verifyChallenge(code_verifier, code_challenge)
    console.log(
      "code_verifier: ",
      code_verifier + "\n",
      "code_challenge: ",
      code_challenge + "\n",
      "check: ",
      check
    )

    if (!check) {
      req.session.destroy()
      return res.status(400).json({
        status: "error",
        message: "Указанные code_verifier и code_challenge не совпадают!",
      })
    }

    try {
      const tokenResponseData = await request(
        "https://discord.com/api/oauth2/token",
        {
          method: "POST",
          body: new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `http://localhost:3000/auth`,
            scope: "identify",
          }).toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )

      const oauthData = await tokenResponseData.body.json()
      req.session.destroy()
      return res.status(tokenResponseData.statusCode).json(oauthData)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: "InternalError", message: "500" })
    }
  }

  killSession(req, res) {
    console.log("killSession")
    req.session.destroy((err) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          status: "InternalError",
          message:
            "an error occurred while trying to delete the current session",
        })
      }
    })
    console.log("Сессия была успешно удалена!")
    return res.status(200).json({
      status: "ok",
      message: "session has been destroyed successfully",
    })
  }

  logout(req, res) {
    
  }
}

export default new AuthHandler()