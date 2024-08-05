import React from "react";

const Notification = ({message, show, isError}) => {
  let classes = ["Notification"]
  if (show) classes.push("_active")
  if (isError) classes.push("_error")

  return (
    <div className={classes.join(" ")}>{message}</div>
  )
}

export default Notification