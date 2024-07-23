import pkceChallenge from "pkce-challenge";
import crypto from "crypto"
import useApi from "./useApi";

const useAuth = () => {
  const { getAuthCode } = useApi();

  const login = async () => {
    let challenge = await pkceChallenge()

    const state = crypto.randomBytes(16).toString('hex')

    let res = await getAuthCode({
      code_challenge: challenge.code_challenge
    })
    console.log(res.status);
    if (res.status !== "ok") return
    localStorage.setItem("state", state)
    localStorage.setItem("code_verifier", challenge.code_verifier)

    // Добавляем state в строку и получаем итоговую ссылку для авторизации
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=1251533444945805466&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&scope=identify+guilds+email&state=${state}`
    return window.location.href = discordAuthUrl
    // return window.open(..., "", "width=500,height=1000")
  }

  return { login }
}

export default useAuth