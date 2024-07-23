// Components, React librart
import React from "react";

import cls from "./Loading_circle.module.scss"

const Loading_circle = ({ className, ...props }) => {
  return (
    <div className={[cls.Loading_circle, className].join(" ")} {...props}></div>
  )
}

export default Loading_circle