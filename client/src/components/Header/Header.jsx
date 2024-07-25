import React, { Suspense } from "react";

import { Await, defer, useAsyncValue, useLoaderData, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import Button from "../UI/Button/Button.jsx"
import Loading_circle from "../Loading_circle/Loading_circle.jsx"
import { useAuthContext } from "../../context/Auth.jsx";

import { getUser } from "../../utils/fetchDiscord.js";

import icon_arrow from "../../images/icon-arrow.svg"
import Loading from "../../pages/Loading/Loading.jsx";
import useDiscord from "../../hooks/useDiscord.jsx";
import LoaderData from "../../hoc/LoaderData.jsx";

const HeaderComponent = ({...props}) => {
  const navigate = useNavigate();

  const { login } = useAuth();
  const { isAuth, setIsAuth } = useAuthContext();

  const myServers = () => {
    return navigate("/dashboard")
  }
  
  const logout = () => {
    localStorage.clear()
    setIsAuth(false)
  }

  function handleUserMenuClick(e) {
    if (e.target.closest(".header__user") && !e.target.closest(".user-menu__menu")) {
      document.querySelector(".user-menu").classList.toggle("_active")
    }
  }

  const { data: user, error } = useDiscord(useAsyncValue())
  console.log(user, error);

  return (
    <header {...props} className="header">
      <div className="header__container">
        <div className="header__bot-logo bot-logo">
          <div className="bot-logo__icon">
            <img src="https://cdn.discordapp.com/app-icons/1251533444945805466/53a7d2fa880c5bfcbdcc8faebeed9b08.webp?size=128" alt="Mandarin-bot logo" />
          </div>
          <div className="bot-logo__txt"><h3>Mandarin bot</h3></div>
        </div>
        <div className="header__user header-user">
          {!isAuth && <LoginButton onClick={(e) => {
            e.target.disabled = true
            return login()
          }}/>}
          {isAuth && user && <UserMenu onClick={handleUserMenuClick} myServers={myServers} logout={logout} user={user}/>}
          {isAuth && !user && <Loading_circle />}
        </div>
      </div>
    </header>
  )
}

const Header = ({...props}) => {
  const { isAuth } = useAuthContext();
  const loaderData = useLoaderData();

  if (isAuth) return (
    <LoaderData
      resolve={loaderData.user}
      fallback={<Loading/>}
    >
      <HeaderComponent {...props}/>
    </LoaderData>
  )
  return <HeaderComponent {...props}/>
}

export { HeaderLoader, Header };

async function HeaderLoader() {
  const user = getUser()

  return defer({
    user: user
  })
}


function LoginButton({...props}) {

  return (
    <Button {...props}>Login with discord</Button>
  )
}

function UserMenu({ user, myServers, logout, ...props }) {
  
  return (
    <div className="header-user__container" {...props}>
      <div className="header-user__avatar">
        <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=512`} alt="Discord user logo" />
      </div>
      <div className="header-user__menu user-menu">
        <div className="user-menu__arrow">
          <img src={icon_arrow} alt="Arrow button" />
        </div>
        <ul className="user-menu__menu">
          <li onClick={myServers}>My Servers</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </div>
    </div>
  )
}