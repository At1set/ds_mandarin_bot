import React, { useEffect, useState } from "react";
import State from "../../utils/State";
import { Outlet, useMatch } from "react-router-dom";

import useLoading from "../../hooks/useLoading";
import useDiscord from "../../hooks/useDiscord";

import Header from "../Header/Header"
import Loading from "../../pages/Loading/Loading"
import { useAuthContext } from "../../context/Auth";
import Sidebar from "../Sidebar/Sidebar";

const Layout = () => {
  const States = State.getStates();

  const { setUser, dataLoading, dataLoader } = useAuthContext();
  const { getUser } = useDiscord();

  const [ state, setState ] = useState(States.LOADING);
  const { startLoading } = useLoading({ setState });

  useEffect(() => {
    dataLoader.setLoadingState("UserData", true)
    startLoading(getUser).then(res => {
      console.log(res);
      dataLoader.setLoadingState("UserData", false)
      if (!res.error) setUser(res.data)
    })
  }, [])

  let sitePath = []
  if (useMatch("dashboard/:guildId")) sitePath.push("_ServerOptions")

  return (
    <div className={
      sitePath.length ? "wrapper " + sitePath.join(" ") : "wrapper"
    }>
      {dataLoading && <Loading />}
      <Header />
      {sitePath.includes("_ServerOptions") && <Sidebar/>}
      <Outlet />
    </div>
  )
}

export default Layout