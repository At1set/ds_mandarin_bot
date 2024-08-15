import React from "react";
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import useLoading from "../../hooks/useLoading";
import State from "../../utils/State";
import useApi from "../../hooks/useApi";

import { useAuthContext } from "../../context/Auth";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const [ state, setState ] = useState(null);
  const { startLoading } = useLoading({ state, setState });
  const { getAccessTocken, killAuthSession } = useApi();
  const { setIsAuth } = useAuthContext();

  const States = State.getStates()

  useEffect(() => {
    const exit = async (args={state}, isSoftExit=false) => {
      const { state: auth_state, ...data } = args
      if (auth_state === States.SUCCESS) {
        localStorage.removeItem("code_verifier")
        localStorage.removeItem("state")
        setIsAuth(true)
      } else if (!isSoftExit) localStorage.clear();
      console.log(await killAuthSession());
      return navigate("/", {replace: true, state: {state: auth_state, ...data}});
    }

    const authorizing = async () => {
      // Пользователь отклонил авторизацию
      const auth_error = searchParams.get('error')
      if (auth_error) return await exit({state: States.ERROR, reason: `Пользователь отклонил авторизацию или произошла ошибка: ${auth_error}`})
      
      
      // Проверка state
      const auth_state = localStorage.getItem("state")
      if (auth_state && searchParams.get("state")) {
        console.log("auth States: ", auth_state, searchParams.get("state"));
        if (auth_state !== searchParams.get("state")) return exit({state: States.ERROR, reason: "Проверка state не прошла"})
      }


      // Проверка на присутствие кода авторизации
      const code = searchParams.get('code')
      const code_verifier = localStorage.getItem("code_verifier")
      if (!code || !code_verifier) return await exit({state: States.ERROR, reason: "Проверка на присутствие кода авторизации не прошла"}, true)


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
      if (loadingData.error) return await exit({state: States.ERROR, reason: "Сервер ответил ошибкой"})
      
      // Успех!
      localStorage.setItem("access_token", loadingData.data.access_token)
      localStorage.setItem("refresh_token", loadingData.data.refresh_token)
      
      return await exit({state: States.SUCCESS})
    }
    authorizing()
  }, [])

  return <></>
}

export default Auth