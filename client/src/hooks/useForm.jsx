import { useRef, useEffect } from "react";

const useForm = ({ data, setFromElemVal }) => {
  const form = useRef();

  useEffect(() => {
    setFromElemVal(data)
  }, [data]);

  const serializeForm = (formNode) => {
    const { elements } = formNode;
    const data = {};

    Array.from(elements)
      .filter((item) => !!item.name)
      .forEach((element) => {
        const { name, type } = element;
        let value = element.value;
        if (type === "checkbox") value = element.checked
        else if (element.name === "banwords") value = element.value.trim().split(" ")

        data[name] = value;
      });

    return data;
  };

  return [ form, serializeForm ];
};

export default useForm;