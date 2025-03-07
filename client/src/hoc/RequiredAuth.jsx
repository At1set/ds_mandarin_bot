import React from "react";
import { useAuthContext } from "../context/Auth";
import { Navigate, useLocation } from "react-router-dom";

const RequiredAuth = ({children}) => {
  const location = useLocation();
  const { isAuth } = useAuthContext();

  if (!isAuth) {
    return <Navigate to={`/login?redirect=${location.pathname + location.search}`}/>
  }

  return children;
}

export default RequiredAuth