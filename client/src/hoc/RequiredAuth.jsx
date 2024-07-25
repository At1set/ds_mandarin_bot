import React from "react";
import { useAuthContext } from "../context/Auth";
import { Navigate } from "react-router-dom";

const RequiredAuth = ({children}) => {
  const { isAuth } = useAuthContext();

  if (!isAuth) {
    return <Navigate to="/" />
  }

  return children;
}

export default RequiredAuth