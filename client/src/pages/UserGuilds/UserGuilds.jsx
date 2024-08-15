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

export const UserGuildsRoute = () => {
  return (
    <Routes>
      <Route index              element={<UserGuilds />}/>
      <Route path=":guildID"    element={<RequiredAuth children={<ServerOptions />}/>}/>
    </Routes>
  )
}

const UserGuilds = () => {
  const States = State.getStates();

  const { dataLoader, userGuilds, setUserGuilds } = useAuthContext();
  const { getUserGuilds } = useApi()
  const [ state, setState ] = useState(States.LOADING);
  const { startLoading } = useLoading({ setState });

  useEffect(() => {
    dataLoader.setLoadingState("UserGuilds", true)
    startLoading(getUserGuilds).then(res => {
      console.log(res);
      dataLoader.setLoadingState("UserGuilds", false)
      if (!res.error) return setUserGuilds(res.data)
      return setUserGuilds(res)
    })
  }, [])  

  return (
    <section className="UserGuilds page_root">
      <div className="UserGuilds__title">
        <h3>Выберите сервер</h3>
      </div>
      <div className="UserGuilds__container">
        {state === States.ERROR && <div className="errorBox">{`${userGuilds.error.request?.response || userGuilds.error || "Произошла непридвиденная ошибка!"}`}</div>}
        {state === States.SUCCESS &&
          userGuilds?.map(guild => {
            return <UserGuild guildId={guild.id} name={guild.name} icon={guild.icon} isBot={guild.isBot} userGuilds={userGuilds} key={guild.id}/>
          })
        }
      </div>
    </section>
  )
}

export default UserGuilds