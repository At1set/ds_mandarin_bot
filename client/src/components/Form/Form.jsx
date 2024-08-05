// Components, React librart
import React, { useState } from "react";
import cls from "./Form.module.scss"
import ChangingDetected from "../ChangingDetected/ChangingDetected";
import Button from "../UI/Button/Button";
import Switch from "../UI/Switch/Switch";
import { compareObjects } from "../../utils/functions";
import useForm from "../../hooks/useForm";

const Form = ({ data, setData, optionsChanged, setOptionsChanged, ...props }) => {
  const checkIsUpdated = () => {
    let formData = serializeForm(form.current)
    return setOptionsChanged(!compareObjects(formData, data))
  }
  
  const [ fromElemVal, setFromElemVal ] = useState(data);
  const handleChange = (e) => {
    setFromElemVal((prevValues) => ({
      ...prevValues,
      [e.target.name]: (e.target.type === "checkbox" ? e.target.checked: e.target.value),
    }));
    checkIsUpdated()
  };
  
  const [ form, serializeForm ] = useForm({ data, setFromElemVal });
  
  return (
    <>
      <form ref={form} {...props}>
        <ul>
          <li>
            <h4 className="label">Включает боту тестовую функцию</h4>
            <Switch checked={fromElemVal.testFunc} onChange={handleChange} name="testFunc"/>
          </li>
          <li>
            <h4 className="label">Еще 1 свитч</h4>
            <Switch checked={fromElemVal.secondSwitch} onChange={handleChange} name="secondSwitch"/>
          </li>
          <li>
            <h4 className="label">Меню Select</h4>
            <select name="Menu_select" id="" value={fromElemVal.Menu_select} onChange={handleChange}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </li>
        </ul>
        <Button onClick={async (e) => {
          e.preventDefault()
        }}>Submit</Button>
      </form>
      <ChangingDetected
        isActive={optionsChanged}
        setOptionsChanged={setOptionsChanged}
        getFormData={() => serializeForm(form.current)}
        setFromElemVal={setFromElemVal}
        setData={setData}
        oldData={data}
      />
    </>
  )
}

export default Form