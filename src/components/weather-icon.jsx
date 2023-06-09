import React from "react";

const WeatherIcon = ({ url, animationClass }) => {
  return (
    <img
      src={url}
      alt="weather icon"
      className={`weather-icon ${animationClass}`}
    />
  );
};

export default WeatherIcon;
