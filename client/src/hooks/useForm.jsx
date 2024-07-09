import { useRef, useEffect } from "react";

const useForm = ({ data, checkIsUpdated, setFromElemVal }) => {
  const form = useRef();

  useEffect(() => {
    const formNodes = Array.from(form.current.elements);
    formNodes.forEach((elem) => {
      setFromElemVal((prevValues) => ({
        ...prevValues,
        [elem.name]: data[elem.name],
      }));
    });
    // formNodes.forEach((e) => {
    //   if (e.tagName != "BUTTON" && e.type !== "checkbox") {
    //     e.addEventListener("change", checkIsUpdated);
    //   }
    // });
    // return () => {
    //   formNodes.forEach((e) => {
    //     if (e.tagName != "BUTTON") {
    //       e.removeEventListener("change", checkIsUpdated);
    //     }
    //   });
    // };
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