import React, { useEffect, useMemo, useState } from "react";

import "./styles/App.scss";

import AppRouter from "./routers/AppRouter.jsx";
import { AuthContext } from "./context/Auth";
import DataLoader from "./utils/DataLoader";
import TokenService from "./services/Token.js";

function App() {
  const [ isAuth, setAuth ] = useState(null);
  const [ user, setUser ] = useState(null);
  const [ userGuilds, setUserGuilds ] = useState(null);

  const [ dataLoading, setDataLoading ] = useState(true);
  const dataLoader = useMemo(() => new DataLoader(setDataLoading), [setDataLoading])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        dataLoader.setLoadingState("sync token", true)
        const { user } = await TokenService.synchronize()
        setUser(user)
        return setAuth(true)
      } catch (error) {
        return setAuth(false)
      } finally {
        dataLoader.setLoadingState("sync token", false)
      }
    }
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{
      isAuth,
      setAuth,

      user,
      setUser,

      userGuilds,
      setUserGuilds,

      dataLoading,
      dataLoader,
    }}>
      <div className="App">
        <AppRouter></AppRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;