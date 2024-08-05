import React, { useEffect, useState } from "react"
import Form from "../../components/Form/Form"

import useApi from "../../hooks/useApi"
import { useAuthContext } from "../../context/Auth"
import State from "../../utils/State"
import useLoading from "../../hooks/useLoading"
import axios from "axios"
import { useLocation, useNavigate, useParams } from "react-router-dom"

const ServerOptions = () => {
  const States = State.getStates();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const [optionsChanged, setOptionsChanged] = useState(false)
  const [data, setData] = useState({
    testFunc: false,
    secondSwitch: false,
    Menu_select: "1",
  })

  const { dataLoader, userGuilds, setUserGuilds } = useAuthContext()

  const { getOptions } = useApi()
  const [state, setState] = useState(States.LOADING)
  const { startLoading } = useLoading({ state, setState })

  function getGuildOptions(guildID) {
    dataLoader.setLoadingState("UserOptions", true)
    startLoading(() =>
      getOptions({ guildID })
    ).then((res) => {
      console.log(res)
      dataLoader.setLoadingState("UserOptions", false)
      if (!res.error) return setData(res.data.message)
      if (
        res.error instanceof axios.AxiosError &&
        res.error?.response.data.status ===
          "Options don't exists error"
      ) {
        return setState(States.SUCCESS)
      }
      return setData(res)
    })
  }

  function validateGuild(guildID) {
    return userGuilds.filter(guild => guild.id === guildID).length >= 1
  }

  useEffect(() => {
    const guildID = params?.guildID
    
    if (!location.state?.userGuilds || !guildID) return navigate("/dashboard")
    else if (!userGuilds) return setUserGuilds(location.state.userGuilds)
    
    if (!validateGuild(guildID)) return navigate("/dashboard")
    
    getGuildOptions(guildID)
  }, [userGuilds])

  return (
    <section className="ServerOptions page_root">
      <div className="ServerOptions__container">
        {state === States.ERROR && (
          <div className="errorBox">{`${
            data.error?.request.response || "Произошла непридвиденная ошибка!"
          }`}</div>
        )}
        {state === States.SUCCESS && (
          <Form
            className="ServerOptions__form form"
            data={data}
            setData={setData}
            optionsChanged={optionsChanged}
            setOptionsChanged={setOptionsChanged}
          />
        )}
      </div>
    </section>
  )
}

export default ServerOptions
