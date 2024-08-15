import React from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import Button from "../UI/Button/Button.jsx"
import Loading_circle from "../Loading_circle/Loading_circle.jsx"
import { useAuthContext } from "../../context/Auth.jsx";

import icon_arrow from "../../images/icon-arrow.svg"
import MenuBurger from "../MenuBurger/MenuBurger.jsx";

const Header = ({...props}) => {
  const navigate = useNavigate();

  const { login } = useAuth();
  const { isAuth, setIsAuth, user } = useAuthContext();

  const myServers = (e) => {
    e.target.closest(".user-menu").classList.remove("_active")
    if (user) return navigate("/dashboard")
    return navigate("/")
  }
  
  const logout = () => {
    localStorage.clear()
    setIsAuth(false)
    return navigate("/")
  }

  function handleUserMenuClick(e) {
    if (e.target.closest(".header__user") && !e.target.closest(".user-menu__menu")) {
      return document.querySelector(".user-menu").classList.toggle("_active")
    }
  }

  return (
    <header {...props} className="header">
      <div className="header__container">
        
        <div className="header__bot-logo bot-logo">
          <div className="bot-logo__icon">
            <Link to="/"><img src="https://cdn.discordapp.com/app-icons/1251533444945805466/53a7d2fa880c5bfcbdcc8faebeed9b08.webp?size=128" alt="Mandarin-bot logo" /></Link>
          </div>
          <div className="bot-logo__txt"><h3>Mandarin bot</h3></div>
        </div>

        <MenuBurger/>

        <div className="header__user header-user">
          
          {!isAuth && // Кнопка входа в аккаунт discord
          <LoginButton 
            onClick={(e) => {
              e.target.disabled = true
              return login()
            }}
          />}

          {isAuth && user && // Иконка пользователя с меню
          <UserMenu 
            onClick={handleUserMenuClick} 
            myServers={myServers} 
            logout={logout} 
            user={user}
          />}

          {isAuth && !user && <Loading_circle /> /* Окошко загрузки */}
        </div>
      </div>
    </header>
  )
}

export default Header;

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