import React, { useEffect, useState } from "react";

import "./styles/App.scss";

import AppRouter from "./components/AppRouter";
import { AuthContext } from "./context/Auth";

function App() {

  const [ isAuth, setIsAuth ] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsAuth(true)
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      isAuth,
      setIsAuth
    }}>
      <div className="App">
        <AppRouter></AppRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;