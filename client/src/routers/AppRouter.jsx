import React from "react"

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { UserGuildsRoute } from "../pages/UserGuilds/UserGuilds";
import AuthPage from "../pages/Auth/Auth";
import MainPage from "../pages/Main/Main";
import GuildInstallPage from "../pages/GuildInstall/GuildInstall";
import Layout from "../components/Layout/Layout";

import RequiredAuth from "../hoc/RequiredAuth";
import LoginPage from "../pages/Login/Login";

const router = createBrowserRouter(createRoutesFromElements(
  <Route>
    <Route path="/" element={<Layout />}>
      <Route index                      element={<MainPage />}/>
      <Route path="dashboard/*"         element={<RequiredAuth children={<UserGuildsRoute />} />}/>
      <Route path="login"               element={<LoginPage/>}/>
    </Route>
    <Route path="/auth"                element={<AuthPage />} />
    <Route path="/guild-install"       element={<GuildInstallPage />} />
    <Route path="/*"                   element={<ErrorPage />}/>
  </Route>
))

const AppRouter = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default AppRouter