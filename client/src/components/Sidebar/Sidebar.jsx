import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {

  return (
    <aside className="sidebar _active">
      <div className="sidebar__bot-logo bot-logo">
        <div className="bot-logo__icon">
          <Link to="/"><img src="https://cdn.discordapp.com/app-icons/1251533444945805466/53a7d2fa880c5bfcbdcc8faebeed9b08.webp?size=128" alt="Mandarin-bot logo" /></Link>
        </div>
        <div className="bot-logo__txt"><h3>Mandarin bot</h3></div>
      </div>
      <ul className="sidebar__menu">
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
        <li>Lorem ipsum dolor sit amet.</li>
      </ul>
    </aside>
  )
}

export default Sidebar