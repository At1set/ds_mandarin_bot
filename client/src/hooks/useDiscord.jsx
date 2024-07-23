import React from "react";
import axios from "axios";
import { useAuthContext } from "../context/Auth";

const useDiscord = () => {
  const dsApi = "https://discord.com/api"
  const dsImgApi = "https://cdn.discordapp.com"
  const access_token = localStorage.getItem("access_token")

  const { setIsAuth } = useAuthContext();

  const _requestHandler = async (request) => {
    try {
      const response = await request
      return response.data
    } catch (error) {
      if (error.request.status === 401) {
        setIsAuth(false)

        // Тут обновляем токен
      }

      throw error
    }    
  }

  const getUser = async () => {
    if (!access_token) return null;
    const request = axios.get("https://discord.com/api/users/@me", {
      // headers: {
      //   "Authorization": `Bearer ${access_token}`
      // }
    })
    return _requestHandler(request)
  }

  return { getUser }
}

export default useDiscord