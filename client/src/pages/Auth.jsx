import React from "react";
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import useLoading from "../hooks/useLoading";
import State from "../utils/State";
import useApi from "../hooks/useApi";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const [ state, setState ] = useState(null)
  const { startLoading } = useLoading({ state, setState })
  const { getAccessTocken, killAuthSession } = useApi()

  const States = State.getStates()

  const exit = async ({state, ...data}) => {
    if (state === States.SUCCESS) {

    } else localStorage.clear();
    console.log(await killAuthSession());
    return navigate("/", {replace: true, state: {state, ...data}});
  }

  return useEffect(() => {
    const authorizing = async () => {
      // Пользователь отклонил авторизацию
      if (searchParams.get('error')) return await exit({state: States.ERROR})
      
      
      // Проверка state
      const auth_state = localStorage.getItem("state")
      if (auth_state && searchParams.get("state")) {
        console.log("auth States: ", auth_state, searchParams.get("state"));
        if (auth_state !== searchParams.get("state")) return exit({state: States.ERROR})
      }


      // Проверка на присутствие кода авторизации
      const code = searchParams.get('code')
      const code_verifier = localStorage.getItem("code_verifier")
      if (!code || !code_verifier) return await exit({state: States.ERROR})


      // {
      //     "token_type": "Bearer",
      //     "access_token": "M9UYJdM563y85ovGSq48OpMU8Jdvfq",
      //     "expires_in": 604800,
      //     "refresh_token": "2IOzR7n291grJnGGVcEehHvxFuMOPr",
      //     "scope": "email guilds guilds.join identify guilds.members.read"
      // }
      
      // Запрос
      const loadingData = await startLoading(() => getAccessTocken({
        code,
        code_verifier
      }), 5_000)

      console.log(loadingData);

      // Обработка ошибок
      if (loadingData.error) return await exit({state: States.ERROR})
      
      // Успех!
      localStorage.setItem("access_token", loadingData.data.access_token)
      localStorage.setItem("refresh_token", loadingData.data.refresh_token)
      
      return await exit({state: States.SUCCESS})
    }
    authorizing()
  }, [])
}

export default Auth