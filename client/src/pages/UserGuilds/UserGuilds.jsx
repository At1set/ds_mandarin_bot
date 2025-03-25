import React, { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import State from "../../utils/State";
import useDiscord from "../../hooks/useDiscord";
import useLoading from "../../hooks/useLoading";
import { useAuthContext } from "../../context/Auth";
import UserGuild from "../../components/UserGuild/UserGuild";
import RequiredAuth from "../../hoc/RequiredAuth";
import ServerOptions from "../ServerOptions/ServerOptions";
import useApi from "../../hooks/useApi";
import ApiService from "../../services/Api";

export const UserGuildsRoute = () => {
  return (
    <Routes>
      <Route index element={<UserGuilds />}/>
      <Route path=":guildID/options" element={<RequiredAuth children={<ServerOptions />}/>}/>
    </Routes>
  )
}

const UserGuilds = () => {
  const States = State.getStates();

  const { dataLoader, setAuth, user, setUser } = useAuthContext();
  const [ state, setState ] = useState(States.LOADING);
  const { startLoading } = useLoading({ setState });

  useEffect(() => {
    dataLoader.setLoadingState("UserGuilds", true)
    const loadFunc = () => ApiService.getUserGuilds(setAuth)
    startLoading(loadFunc).then(res => {
      console.log(res);
      dataLoader.setLoadingState("UserGuilds", false)
      if (!res.error) return setUser((user) => ({
        ...user,
        guilds: res.data
      }))
    })
  }, [])

  return (
    <section className="UserGuilds page_root">
      <div className="UserGuilds__title">
        <h3>Выберите сервер</h3>
      </div>
      <div className="UserGuilds__container">
        {state === States.ERROR && <div className="errorBox">Не удалось получить ответ от сервера. Возможно, сервер отключен, или у вас отсутсвует подключение к сети.</div>}
        {state === States.SUCCESS &&
          user.guilds?.map(guild => {
            return <UserGuild guildId={guild.id} name={guild.name} icon={guild.icon} isBot={guild.isBot} userGuilds={userGuilds} key={guild.id}/>
          })
        }
      </div>
    </section>
  )
}

export default UserGuilds