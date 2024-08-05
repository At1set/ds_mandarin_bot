import React from "react";
import { Link } from "react-router-dom";

const UserGuild = ({name, owner="Owner", guildId, icon, userGuilds, ...props}) => {

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
        <Link to={`${guildId}`} state={{userGuilds}} className="guild-bottom__btn">Go</Link>
      </div>
    </div>
  )
}

export default UserGuild