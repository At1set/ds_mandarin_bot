import React, { useState } from "react";

const Banwords = ({ value, setValue }) => {
  const [ option, setOption ] = useState(value.join(" "));

  function handleChange(e) {
    const banwordsArr = e.target.value.trim().split(" ")
    if (!e.target.value.includes("  ") && !banwordsArr.filter(word => word.length < 3).length) setOption(e.target.value)
    else return
    setValue(oldValue => {
      return {
        ...oldValue,
        [e.target.name]: e.target.value.length ? banwordsArr : []
      }
    })
  }

  return (
    <li>
      <h4 className="label">Список банвордов</h4>
      <input type="text" value={option} onInput={handleChange}  name="banwords"/>
    </li>
  )
}

export default Banwords