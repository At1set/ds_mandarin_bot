import React, { useEffect, useState } from "react"

import Form from "../../components/Form/Form"
import TestFunc from "./FormOptions/TestFunc/TestFunc"
import SecondSwitch from "./FormOptions/SecondSwitch/SecondSwitch"
import Menu_select from "./FormOptions/Menu_select/Menu_select"
import Banwords from "./FormOptions/Banwords/Banwords"
import DropDownMenu, { MenuOption } from "../../components/UI/DropDownMenu/DropDownMenu"

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

  const defaultOptions = {
    testFunc: false,
    secondSwitch: false,
    Menu_select: "1",
    banwords: [],
  }
  const [ data, setData ] = useState(defaultOptions)
  const [ oldData, setOldData ] = useState(defaultOptions)

  const { dataLoader, userGuilds, setUserGuilds } = useAuthContext()

  const { getOptions } = useApi()
  const [ state, setState ] = useState( States.LOADING )
  const { startLoading } = useLoading({ state, setState })

  function getGuildOptions(guildID) {
    dataLoader.setLoadingState("UserOptions", true)
    startLoading(() =>
      getOptions({ guildID })
    ).then((res) => {
      console.log(res)
      dataLoader.setLoadingState("UserOptions", false)
      if (!res.error) {
        setData(res.data.message)
        setOldData(res.data.message)
        return
      }
      else if (
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

  const [ open, setOpen ] = useState(false);
  
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
          >
            <TestFunc value={data.testFunc} setValue={setData} />
            <SecondSwitch value={data.secondSwitch} setValue={setData} />
            <Menu_select value={data.Menu_select} setValue={setData} />
            <Banwords value={data.banwords} setValue={setData} />
            <DropDownMenu
              value={data.Menu_select}
              setValue={
                (newValue) => setData(oldValue => {
                  return {
                    ...oldValue,
                    "Menu_select": newValue
                  }
                })
              }
              open={open}
              setOpen={setOpen}
            >
              <MenuOption value={"1"}>1</MenuOption>
              <MenuOption value={"2"}>2</MenuOption>
              <MenuOption value={"3"}>Тутутуту</MenuOption>
            </DropDownMenu>
          </Form>
        )}
      </div>
    </section>
  )
}

export default ServerOptions
