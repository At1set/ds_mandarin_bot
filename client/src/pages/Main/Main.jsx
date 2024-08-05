import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"

import Notification from "../../components/Notification/Notification.jsx";
import useNotification from "../../hooks/useNotification.jsx";
import { useAuthContext } from "../../context/Auth.jsx";

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [ notification, setNotification ] = useState({show: false, message: "", isError: false})
  const { showNotification } = useNotification({ notification, setNotification });

  const { isAuth } = useAuthContext()

  useEffect(() => {
    if (location.state?.redirectedFrom && isAuth) { // For RequiredAuth hoc only when reloading page
      const redirectedUrl = location.state.redirectedFrom
      return navigate(redirectedUrl.pathname, {replace: true, state: redirectedUrl.state})
    }
    if (location.state?.state) showNotification(location.state.state)
    return window.history.replaceState({}, '')
  }, [])

  return (
    <section className="Main page_root">
      <Notification
        message={notification.message}
        show={notification.show}
        isError={notification.isError}
      />
    </section>
  )
}

export default Main