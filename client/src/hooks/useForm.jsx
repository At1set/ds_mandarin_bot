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
        const value = type === "checkbox" ? element.checked : element.value;

        data[name] = value;
      });

    return data;
  };

  return [ form, serializeForm ];
};

export default useForm;