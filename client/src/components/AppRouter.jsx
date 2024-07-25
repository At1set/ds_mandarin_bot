import React from "react"

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import ServerOptions from "../pages/ServerOptions/ServerOptions";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import UserServers from "../pages/UserServers/UserServers";
import Auth from "../pages/Auth/Auth";
import Main from "../pages/Main/Main";
import { HeaderLoader } from "./Header/Header";

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/">
    <Route index                      element={<Main/>} loader={HeaderLoader}/>
    <Route path="auth"                element={<Auth />} />
    <Route path="dashboard"           element={<UserServers />}/>
    <Route path="dashboard/:guildID"  element={<ServerOptions />}/>
    <Route path="*"                   element={<ErrorPage />}/>
  </Route>
))

const AppRouter = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default AppRouter