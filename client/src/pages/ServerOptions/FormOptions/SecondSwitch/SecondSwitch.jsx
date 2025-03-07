import React from "react";
import Switch from "../../../../components/UI/Switch/Switch";

const SecondSwitch = ({ value, setValue }) => {
  function handleChange(e) {
    setValue(oldValue => {
      return {
        ...oldValue,
        [e.target.name]: e.target.checked
      }
    })
  }

  return (
    <li>
      <h4 className="label">Еще 1 свитч</h4>
      <Switch checked={value} onChange={handleChange} name="secondSwitch"/>
    </li>
  )
}

export default SecondSwitch