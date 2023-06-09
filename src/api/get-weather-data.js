import axios from "axios";

export default async function getWeatherData(lat, long) {
  try {
    const weatherData = {
      city: "",
      state: "",
      temp: "",
      detailedForecast: "",
      shortForecast: "",
      icon: "",
    };

    const response = await axios.get(
      `https://api.weather.gov/points/${lat},${long}`
    );
    weatherData.city =
      response.data.properties.relativeLocation.properties.city;
    weatherData.state =
      response.data.properties.relativeLocation.properties.state;

    const forecastResponse = await axios.get(response.data.properties.forecast);
    weatherData.temp =
      forecastResponse.data.properties.periods[0].temperature +
      "°" +
      forecastResponse.data.properties.periods[0].temperatureUnit;
    weatherData.detailedForecast =
      forecastResponse.data.properties.periods[0].detailedForecast;
    weatherData.shortForecast =
      forecastResponse.data.properties.periods[0].shortForecast;
    weatherData.icon = forecastResponse.data.properties.periods[0].icon;

    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}
