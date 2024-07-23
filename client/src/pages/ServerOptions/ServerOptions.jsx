import React, { useEffect, useState } from "react";
import Form from "../../components/Form/Form";

import useApi from "../../hooks/useApi";

const ServerOptions = () => {
  const [ optionsChanged, setOptionsChanged ] = useState(false);
  const [ data, setData ] = useState({testFunc: false, secondSwitch: false, Menu_select: '1'})
  const [ error, setError ] = useState(null)
  const [ loading, setLoading ] = useState(null)
  const { getOptions } = useApi();

  useEffect(() => {
    const setOptions = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      try {
        let options = await getOptions( {
          guildID: window.location.href.split("/").pop()
        } )
        console.log(options);
        if (options.status === "ok") return setData(options.message)
      } catch (error) {
        let errorMess = "Произошла ошибка: не удалось получить актуальные настройки от сервера!"
        if (error?.response?.data) errorMess += "\n" + JSON.stringify(error.response.data)
        return setError(errorMess);
      } finally {
        setLoading(false)
      }
    };
    setOptions();
  }, [])

  return (
    <>
      {loading ?
        <div className="Loading__circle">
          Загрузка...
        </div>
      : false}
      {error ? (
        <div
          style={
            {
              textAlign: "center",
              fontSize: 24,
              padding: "20% 10px 0 10px",
            }
          }
        >{error}</div>
      ) : (
        <Form
          data={data}
          setData={setData}
          optionsChanged={optionsChanged}
          setOptionsChanged={setOptionsChanged}
        />
      )}
    </>
  )
}

export default ServerOptions