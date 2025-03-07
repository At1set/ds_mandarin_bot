import React from "react";

const Menu_select = ({ value, setValue }) => {
  function handleChange(e) {
    setValue(oldValue => {
      return {
        ...oldValue,
        [e.target.name]: e.target.value
      }
    })
  }

  return (
    <li>
      <h4 className="label">Меню Select</h4>
      <select name="Menu_select" value={value} onChange={handleChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </li>
  )
}

export default Menu_select