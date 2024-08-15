import React from "react";
import { Link } from "react-router-dom";
import Button from "../UI/Button/Button";

const UserGuild = ({guildId, name, icon, isBot, userGuilds, owner="Owner", ...props}) => {

  return (
    <div className="UserGuild" {...props}>
      <div className="UserGuild__banner guild-banner">
        <div className="guild-banner__backGround"></div>
        {icon ? <img className="guild-banner__img" src={`https://cdn.discordapp.com/icons/${guildId}/${icon}.jpg`} alt={`Logo of ${name}`} onLoad={(e) => {
          const imgUrl = e.target.src
          e.target.closest(".guild-banner").querySelector(".guild-banner__backGround").style.backgroundImage = `url(${imgUrl})`
        }}/>
        : <div className="guild-banner__no-icon"></div>}
      </div>
      <div className="UserGuild__bottom guild-bottom">
        <div className="guild-bottom__guildName">
          <h4>{name}</h4>
        </div>
        <div className="guild-bottom__isOwner">{owner}</div>
        {isBot 
        ? <Link to={`${guildId}`} state={{userGuilds}} className="guild-bottom__btn">Go</Link>
        : <Button className="guild-bottom__btn guild-bottom__btn_setup" onClick={(e) => {
          const setup_url = `https://discord.com/oauth2/authorize?client_id=1251533444945805466&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fguild-install&integration_type=0&scope=bot+applications.commands&permissions=8&guild_id=${guildId}`
          return window.location.href = setup_url
        }}>Setup</Button>}
      </div>
    </div>
  )
}

export default UserGuild