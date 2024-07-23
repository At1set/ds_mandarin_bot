import React from "react"

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ServerOptions from "../pages/ServerOptions/ServerOptions";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import UserServers from "../pages/UserServers/UserServers";
import Auth from "../pages/Auth/Auth";
import Main from "../pages/Main/Main";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Main />}/>
        <Route path="/auth"     element={<Auth />}/>
        <Route path="/dashboard"     element={<UserServers />}/>
        <Route path="/dashboard/:guildID" element={<ServerOptions />}/>
        <Route path="*"         element={<ErrorPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter