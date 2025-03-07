import React from "react";
import Switch from "../../../../components/UI/Switch/Switch";

const TestFunc = ({ value, setValue }) => {
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
      <h4 className="label">Включает боту тестовую функцию</h4>
      <Switch checked={value} onChange={handleChange} name="testFunc"/>
    </li>
  )
}

export default TestFunc