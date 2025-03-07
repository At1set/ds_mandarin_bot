import React, { useState, Children } from "react";

const DropDownMenu = ({ children, value, setValue, open, setOpen, options={withSearch: false}, onChange = new Function(), ...props}) => {

  function handleClick(e) {
    const newValue = e.currentTarget.dataset.value;
    setValue(newValue);
    setOpen(false);
    if (value != newValue) return onChange(e)
  }

  function toggleWidow(e) {
    if (e.target.tagName === "INPUT") return
    setOpen((oldValue) => !oldValue)
  }

  return (
    <div
      {...props}
      className={`dropDownMenu ${open ? "_active" : ""}`}
    >
      <div className="dropDownMenu__face" onClick={toggleWidow}>
        <span>{value || ""}</span>
        {options.withSearch && <input type="text" placeholder="Поиск..."/>}
        <span className="dropDownMenu__arrow" style={{marginLeft: options.withSearch ? "0px": "auto"}}></span>
      </div>
      <div className="dropDownMenu__options">
        {
          Children.map(children, (child) => {
            const option_value = child.props.value
            return React.cloneElement(child, {
              className: `dropDownMenu__option ${option_value === value ? "_selected" : ""}`,
              onClick: handleClick,
              "data-value": option_value,
              key: option_value,
            })
          })
        }
      </div>
    </div>
  )
}

export default DropDownMenu

const MenuOption = ({ value, children, ...props }) => {
  return (
    <div {...props} data-value={value}>
      {children}
    </div>
  )
}

export { MenuOption }