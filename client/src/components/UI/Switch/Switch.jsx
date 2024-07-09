import React from "react";
import cls from "./Switch.module.css"

const Switch = React.forwardRef(({...props}, ref) => {

  return (
    <label className={cls.switch}>
      <input ref={ref} type="checkbox" {...props}/>
      <span className={cls.slider}></span>
    </label>
  )
})

export default Switch