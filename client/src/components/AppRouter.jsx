import React from "react"

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { UserGuildsRoute } from "../pages/UserGuilds/UserGuilds";
import Auth from "../pages/Auth/Auth";
import Main from "../pages/Main/Main";
import Layout from "./Layout/Layout";

import RequiredAuth from "../hoc/RequiredAuth"
import GuildInstall from "../pages/GuildInstall/GuildInstall";

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path="/" element={<Layout />}>
      <Route index                      element={<Main />}/>
      <Route path="dashboard/*"         element={<RequiredAuth children={<UserGuildsRoute />} />}/>
    </Route>
    <Route path="/auth"                element={<Auth />} />
    <Route path="/guild-install"       element={<GuildInstall />} />
    <Route path="/*"                   element={<ErrorPage />}/>
  </>
))

const AppRouter = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default AppRouter