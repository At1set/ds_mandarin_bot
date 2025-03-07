// Components, React librart
import React, { useState } from "react";
import cls from "./Form.module.scss"
import ChangingDetected from "../ChangingDetected/ChangingDetected";
import Button from "../UI/Button/Button";
import Switch from "../UI/Switch/Switch";
import { compareObjects } from "../../utils/functions";
import useForm from "../../hooks/useForm";

const Form = ({ data, setData, children, ...props }) => {
  const [optionsChanged, setOptionsChanged] = useState(false)

  const checkIsUpdated = () => {
    let formData = serializeForm(form.current)
    return setOptionsChanged(!compareObjects(formData, data))
  }
  
  const [ fromElemVal, setFromElemVal ] = useState(data);
  
  const handleChange = (e) => {
    setFromElemVal((prevValues) => {
      const newValues = {
        ...prevValues,
        [e.target.name]: (e.target.type === "checkbox" ? e.target.checked: e.target.value),
      }
      return newValues
    });
    checkIsUpdated()
  };
  
  const [ form, serializeForm ] = useForm({ data, setFromElemVal });
  
  return (
    <>
      <form ref={form} {...props}>
        <ul>
          { children }
        </ul>
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