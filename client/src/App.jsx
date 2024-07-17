import React from "react";
import { BrowserRouter, Routes, Route, Link, redirect } from 'react-router-dom';

import "./pages/styles/clearstyle.css";
import "./pages/styles/App.css";

import ServerOptions from "./pages/ServerOptions";
import ErrorPage from "./pages/ErrorPage";
import Auth from "./pages/Auth";
import Main from "./pages/Main";

function App() { 

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Main />}/>
          <Route path="/auth"     element={<Auth />}/>
          <Route path="/:guildID" element={<ServerOptions />}/>
          <Route path="*"         element={<ErrorPage />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;