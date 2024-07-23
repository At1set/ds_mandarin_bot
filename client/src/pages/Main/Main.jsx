import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import useDiscord from "../../hooks/useDiscord.jsx";

import Header from "../../components/Header/Header"
import Loading from "../Loading/Loading.jsx";
import useLoading from "../../hooks/useLoading.jsx";
import State from "../../utils/State.js";

const Main = () => {
  const location = useLocation();

  const { getUser } = useDiscord();
  const [ user, setUser ] = useState(null);

  const [ state, setState ] = useState(null);
  const { startLoading } = useLoading({ state, setState })

  useEffect(() => {
    console.log(location.state);
    startLoading(getUser).then(res => {
      console.log(res);
      if (!res.error) setUser(res.data)
    })
    return window.history.replaceState({}, '')
  }, [])

  return (
    <div className="Main page_root">
      {state === State.getStates().LOADING ? <Loading /> : <Header user={user}/>}
    </div>
  )
}

export default Main