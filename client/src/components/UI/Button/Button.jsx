import React from "react";
import cls from "./Button.module.css"

const Button = ({children, className, ...props}) => {
  return (
    <button {...props} className={[cls.button, className].join(" ")}>{children}</button>
  )
}

export default Button