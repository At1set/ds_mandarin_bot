import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import useDiscord from "../../hooks/useDiscord.jsx";

import { Header } from "../../components/Header/Header"
import Loading from "../Loading/Loading.jsx";
import useLoading from "../../hooks/useLoading.jsx";
import State from "../../utils/State.js";

const Main = () => {
  const location = useLocation();
  const [ user, setUser ] = useState(null);

  const [ state, setState ] = useState(null);
  const { startLoading } = useLoading({ state, setState })

  useEffect(() => {
    return window.history.replaceState({}, '')
  }, [])

  return (
    <div className="Main page_root">
      <Header />
    </div>
  )
}

export default Main