import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"

import Button from "../components/UI/Button/Button"

import "./styles/Main.css"

import pkceChallenge from "pkce-challenge";
import useApi from "../hooks/useApi";

import crypto from "crypto"

const Main = () => {
  const { getAuthTocken } = useApi();
  const location = useLocation();

  useEffect(() => {
    console.log(location.state);
    return window.history.replaceState({}, '')
  }, [])

  return (
    <div className="Main">
      <h1>Типо главная</h1>
      <Button onClick={async () => {
        let challenge = await pkceChallenge()

        let state = crypto.randomBytes(16).toString('hex')

        let res = await getAuthTocken({
          code_challenge: challenge.code_challenge
        })
        console.log(res.status);
        if (res.status !== "ok") return
        localStorage.setItem("state", state)
        localStorage.setItem("code_verifier", challenge.code_verifier)

        // Добавляем state в строку и получаем итоговую ссылку для авторизации
        const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=1251533444945805466&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&state=${state}&scope=identify+guilds+guilds.join+guilds.members.read`
        return window.location.href = discordAuthUrl
        // return window.open(..., "", "width=500,height=1000")
      }}>Login with discord</Button>
    </div>
  )
}

export default Main