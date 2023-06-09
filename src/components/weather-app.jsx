import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import WeatherIcon from "./weather-icon";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [temp, setTemp] = useState("");
  const [detailedForecast, setDetailedForecast] = useState("");
  const [shortForecast, setShortForecast] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    // Get user's geolocation
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude.toFixed(3);
      const long = position.coords.longitude.toFixed(3);

      // Fetch data from the weather API
      axios
        .get(`https://api.weather.gov/points/${lat},${long}`)
        .then((response) => {
          setCity(response.data.properties.relativeLocation.properties.city);
          setState(response.data.properties.relativeLocation.properties.state);
          setDayOfWeek(moment().format("dddd")); // This gets the current day of the week
          setTimeOfDay(moment().format("LT")); // This gets the current time

          axios
            .get(`${response.data.properties.forecast}`)
            .then((response) => {
              console.log(response);
              setTemp(
                response.data.properties.periods[0].temperature +
                  "°" +
                  response.data.properties.periods[0].temperatureUnit
              );
              setDetailedForecast(
                response.data.properties.periods[0].detailedForecast
              );
              setShortForecast(
                response.data.properties.periods[0].shortForecast
              );
              setIcon(response.data.properties.periods[0].icon);
            })
            .catch((error) => {
              console.error("Error fetching weather data:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching relative location data:", error);
        });
    });
  }, []); // Empty dependency array means this effect will only run once

  const getWeatherAnimationClass = () => {
    if (detailedForecast.includes("Rain")) {
      return "rainy";
    } else if (detailedForecast.includes("Snow")) {
      return "snowy";
    } else if (detailedForecast.includes("Cloud")) {
      return "cloudy";
    } else if (detailedForecast.includes("Clear")) {
      return "sunny";
    } else if (detailedForecast.includes("Haze")) {
      return "hazy";
    } else {
      return "";
    }
  };

  return (
    <div className={`weather-app ${getWeatherAnimationClass()}`}>
      <h1 className="app-title">Weather App</h1>
      <div className="weather-info">
        <h2 className="location">
          {city}, {state}
        </h2>
        <h3 className="datetime">
          {dayOfWeek}, {timeOfDay}
        </h3>
        {/* <img src={icon} alt="weather icon" /> */}
        <WeatherIcon url={icon} animationClass={getWeatherAnimationClass()} />
        <h2 className="temperature">{temp}</h2>
        <p>{shortForecast}</p>
        <p className="description">{detailedForecast}</p>
      </div>
    </div>
  );
};

export default WeatherApp;
