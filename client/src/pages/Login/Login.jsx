import React from "react"
import { useLocation } from "react-router-dom"

const Login = () => {
  const location = useLocation();

  return (
    <div className="Login page_root">
      <span className="Login__prompt">
        Это страница логина. После того, как вы залогинетесь,
        вы будете перенаправлены на страницу: {new URLSearchParams(location.search).get("redirect")}
      </span>
    </div>
  )
}

export default Login