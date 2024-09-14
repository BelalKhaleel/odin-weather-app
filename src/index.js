import "./style.css";
import fakeWeather from "./data/fake-weather.json";

// console.log(fakeWeather.list[0].main);
// const response = fetch(`https://api.openweathermap.org/data/2.5/forecast?q=London&cnt=8&units=metric&appid=adf0aaf36e0aa6b366d700257417e54f`)
const getHumidity = () => {
  let totalHumidity = 0;
  for (let i = 5; i < 12; i++) {
    totalHumidity += fakeWeather.list[i].main.humidity;
  }
  return Math.round(totalHumidity / 7);
};

const getPressure = () => {
  let totalPressure = 0;
  for (let i = 5; i < 12; i++) {
    totalPressure += fakeWeather.list[i].main.pressure;
  }
  return (totalPressure / 7).toFixed(2);
};

const getTemperature = () => {
  let totalTemperature = 0;
  for (let i = 5; i < 12; i++) {
    totalTemperature += fakeWeather.list[i].main.temp - 273.15;
  }
  return totalTemperature / 7;
};

const minTemp = document.getElementById("min-temp");
minTemp.textContent = Math.floor(getTemperature()) + "°";
const maxTemp = document.getElementById("max-temp");
maxTemp.textContent = Math.ceil(getTemperature()) + "°C";
const humidity = document.getElementById("humidity");
humidity.textContent = `${getHumidity()}%`;
const pressure = document.getElementById("pressure");
pressure.textContent = getPressure();
const findWeatherButton = document.querySelector("button");
const generalWeatherIcon = document.querySelector(".general_weather > img");

(function printDayTemps(hour = 3, id = 5) {
  for (let i = 0; i < 7; i++) {
    const tempElement = document.getElementById(`temp-at-${hour}`);
    if (tempElement) {
      tempElement.textContent = convertKelvinToCelsius(
        fakeWeather.list[id].main.temp,
      );
    }
    hour += 3;
    id += 1;
  }
})();

function convertKelvinToCelsius(temp) {
  return `${Math.round(temp - 273.15)}°C`;
}

findWeatherButton.addEventListener("click", (e) => {
  const cityName = document.querySelector("header > input").value.trim();
});
