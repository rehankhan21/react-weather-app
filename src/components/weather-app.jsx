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
          setDayOfWeek(moment().format("dddd")); // uses Moment to get current day
          setTimeOfDay(moment().format("LT")); // uses Moment to get current time

          axios
            .get(`${response.data.properties.forecast}`)
            .then((response) => {
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
  }, [city]);

  const getWeatherClass = () => {
    if (detailedForecast.includes("Rain")) {
      return { weatherBackgroundClass: "rainy", weatherAnimationClass: "rain" };
    } else if (detailedForecast.includes("Snow")) {
      return { weatherBackgroundClass: "snowy", weatherAnimationClass: "snow" };
    } else if (detailedForecast.includes("Cloud")) {
      return { weatherBackgroundClass: "cloudy", weatherAnimationClass: "fog" };
    } else if (detailedForecast.includes("Clear")) {
      return { weatherBackgroundClass: "sunny", weatherAnimationClass: "sun" };
    } else if (detailedForecast.includes("Haze")) {
      return { weatherBackgroundClass: "hazy", weatherAnimationClass: "fog" };
    } else {
      return "";
    }
  };

  if (city === "") return <p className="weather-app">Loading...</p>;

  return (
    <dvi className={getWeatherClass().weatherAnimationClass}>
      <div
        className={`weather-app ${getWeatherClass().weatherBackgroundClass}`}
      >
        <h1 className="app-title">Weather App</h1>
        <div className="weather-info">
          <h2 className="location">
            {city}, {state}
          </h2>
          <h3 className="datetime">
            {dayOfWeek}, {timeOfDay}
          </h3>
          <WeatherIcon
            url={icon}
            animationClass={getWeatherClass().weatherBackgroundClass}
          />
          <h2 className="temperature">{temp}</h2>
          <p>{shortForecast}</p>
          <div className="text-box-container round shadow--sm">
            <p className=" text-box text-shadow--sm font--25">
              {detailedForecast}
            </p>
          </div>
        </div>
      </div>
    </dvi>
  );
};

export default WeatherApp;
