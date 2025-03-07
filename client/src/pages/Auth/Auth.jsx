import React from "react";
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import useLoading from "../../hooks/useLoading";
import State from "../../utils/State";

import { useAuthContext } from "../../context/Auth";
import AuthService from "../../services/Auth";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [ state, setState ] = useState(null);
  const { startLoading } = useLoading({ state, setState });
  const { setIsAuth, setUser } = useAuthContext();

  const States = State.getStates()

  useEffect(() => {
    async function auth() {
      const params = Object.fromEntries(searchParams.entries())
      const { code, state } = params
      console.log(code, state);
      
      const exit = async (args={state}) => {
        const { state: auth_state, ...data } = args
        if (auth_state === States.SUCCESS) setIsAuth(true)
        return navigate("/", {replace: true, state: {state: auth_state, ...data}});
      }

      const loadingData = await startLoading(() => AuthService.getToken({code, state}))

      if (loadingData.error) return await exit({state: States.ERROR, reason: "Сервер ответил ошибкой"})
      
      localStorage.setItem("token", loadingData.data.token)
      setUser(loadingData.data.user)
      
      return exit({state: States.SUCCESS})
    }
    auth()
  }, [])

  return <></>
}

export default Auth