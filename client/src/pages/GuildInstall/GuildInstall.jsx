import React, { useEffect, useState } from "react";
import State from "../../utils/State";
import { useLocation, useNavigate } from "react-router-dom";

const GuildInstall = () => {
  const States = State.getStates()
  const [ state, setState ] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const exit = async (args={state}, isSoftExit=false) => {
      const { state: auth_state, ...data } = args
      return navigate("/dashboard", {replace: true, state: {state: auth_state, ...data}});
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
      if (!code) return await exit({state: States.ERROR, reason: "Проверка на присутствие кода авторизации не прошла"}, true)
      
      return await exit({state: States.SUCCESS})
    }
    authorizing()
  }, [])

  return <></>
}

export default GuildInstall