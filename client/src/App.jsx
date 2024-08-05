import React, { useEffect, useMemo, useState } from "react";

import "./styles/App.scss";

import AppRouter from "./components/AppRouter";
import { AuthContext } from "./context/Auth";
import DataLoader from "./utils/DataLoader";

function App() {

  const [ isAuth, setIsAuth ] = useState(false);
  const [ user, setUser ] = useState(null);
  const [ userGuilds, setUserGuilds ] = useState(null);

  const [ dataLoading, setDataLoading ] = useState(true);
  const dataLoader = useMemo(() => new DataLoader(setDataLoading), [setDataLoading])

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsAuth(true)
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      isAuth,
      setIsAuth,

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