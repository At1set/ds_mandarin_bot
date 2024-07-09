import React, { useState } from "react";

import Form from "./components/Form";
import "./styles/clearstyle.css";
import "./styles/App.css";

function App() {
  const [ optionsChanged, setOptionsChanged ] = useState(false);
  const [ data, setData ] = useState({testFunc: false, secondSwitch: false, Menu_select: '1'})
  return (
    <div className="App">
      <Form
      data={data}
      setData={setData}
      optionsChanged={optionsChanged}
      setOptionsChanged={setOptionsChanged}
      />
    </div>
  );
}

export default App;