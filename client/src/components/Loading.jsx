// Components, React librart
import React from "react";

import cls from "./Styles/Loading.module.css"

const Loading = ({ className }) => {
  return (
    <div className={[cls.Loading, className].join(" ")}></div>
  )
}

export default Loading