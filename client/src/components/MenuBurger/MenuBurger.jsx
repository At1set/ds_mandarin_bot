import React, { useEffect } from "react"
import useBurgerAnimation from "../../hooks/useBurgerAnimation"

const MenuBurger = () => {
  const menu_burger = useBurgerAnimation()

  return (
    <div className="menu-burger" ref={menu_burger}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export default MenuBurger
