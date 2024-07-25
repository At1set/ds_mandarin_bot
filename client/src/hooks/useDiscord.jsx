import React, { useEffect } from "react";
import { AxiosError } from "axios";
import { useAuthContext } from "../context/Auth";

const useDiscord = (loadedData) => {
  if (!loadedData) return {data: null, error: null}
  const {data, error} = loadedData

  const dsApi = "https://discord.com/api"
  const dsImgApi = "https://cdn.discordapp.com"
  const access_token = localStorage.getItem("access_token")

  const { setIsAuth } = useAuthContext();
  console.log(loadedData);

  useEffect(() => {
    if (error instanceof AxiosError && error.request.status === 401) {
      setIsAuth(false)
      // Тут обновляем токен
    }
  })

  return {data, error}
}

export default useDiscord