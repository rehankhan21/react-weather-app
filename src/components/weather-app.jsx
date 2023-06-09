import React, { useState, useEffect } from "react";
import moment from "moment";
import WeatherIcon from "./weather-icon";
import getWeatherData from "../api/get-weather-data";

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
    const fetchData = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const lat = position.coords.latitude.toFixed(3);
        const long = position.coords.longitude.toFixed(3);

        setDayOfWeek(moment().format("dddd"));
        setTimeOfDay(moment().format("LT"));

        const response = await getWeatherData(lat, long);

        const { city, state, temp, detailedForecast, shortForecast, icon } =
          response;

        setCity(city);
        setState(state);
        setTemp(temp);
        setDetailedForecast(detailedForecast);
        setShortForecast(shortForecast);
        setIcon(icon);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [city]);

  const getWeatherClass = () => {
    if (detailedForecast.includes("rain")) {
      return { weatherBackgroundClass: "rainy", weatherAnimationClass: "rain" };
    } else if (detailedForecast.includes("snow")) {
      return { weatherBackgroundClass: "snowy", weatherAnimationClass: "snow" };
    } else if (detailedForecast.includes("cloud")) {
      return { weatherBackgroundClass: "cloudy", weatherAnimationClass: "fog" };
    } else if (detailedForecast.includes("clear")) {
      return { weatherBackgroundClass: "sunny", weatherAnimationClass: "sun" };
    } else if (detailedForecast.includes("haze")) {
      return { weatherBackgroundClass: "hazy", weatherAnimationClass: "fog" };
    } else {
      return { weatherBackgroundClass: "", weatherAnimationClass: "" };
    }
  };

  if (city === "") return <p className="weather-app">Loading...</p>;

  return (
    <div
      className={`weather-app ${getWeatherClass().weatherBackgroundClass} ${
        getWeatherClass().weatherAnimationClass
      }`}
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
          <p className="text-box text-shadow--sm font--25">
            {detailedForecast}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
