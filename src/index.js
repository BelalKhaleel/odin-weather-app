import "./style.css";
import clearIcon from "./weather-icons/clear.svg";
import cloudyIcon from "./weather-icons/cloudy.svg";
import drizzleIcon from "./weather-icons/drizzle.svg";
import fogIcon from "./weather-icons/fog.svg";
import mostlyCloudy from "./weather-icons/mostlycloudy.svg";
import partlyCloudy from "./weather-icons/partlycloudy.svg";
import rainIcon from "./weather-icons/rain.svg";
import snowIcon from "./weather-icons/snow.svg";
import stormIcon from "./weather-icons/storm.svg";
import unknownIcon from "./weather-icons/unknown.svg";

const minTemp = document.getElementById("min-temp");
const maxTemp = document.getElementById("max-temp");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const weatherChanges = document.querySelector(".weather_changes");
const findWeatherButton = document.querySelector("button");
const generalWeatherIcon = document.querySelector(".general_weather > img");

// function convertKelvinToCelsius(temp) {
//   return `${Math.round(temp - 273.15)}°C`;
// }

async function getWeatherData() {
  const cityName = document.querySelector("header > input").value.trim();
  const cachedWeatherData = localStorage.getItem(cityName);

  if (cachedWeatherData) {
    console.log("Using cached data");
    return JSON.parse(cachedWeatherData);
  }
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=8&units=metric&appid=adf0aaf36e0aa6b366d700257417e54f`,
    );
    const json = await response.json();
    localStorage.setItem(cityName, JSON.stringify(json));
    // console.log(json);
    return json;
  } catch (error) {
    console.log(error);
  }
}

const weatherData = JSON.parse(localStorage.getItem("london"));
console.log(weatherData);

const averageId =
  weatherData.list.reduce((accumulator, item) => {
    return (accumulator += item.weather[0].id);
  }, 0) / weatherData.list.length;
generalWeatherIcon.src = selectIcon(averageId);
selectFigCaption(Math.round(averageId));

function selectIcon(id) {
  if (id < 300) {
    return stormIcon;
  } else if (id >= 300 && id <= 499) {
    return drizzleIcon;
  } else if (id >= 500 && id <= 599) {
    return rainIcon;
  } else if (id >= 600 && id <= 699) {
    return snowIcon;
  } else if (id >= 700 && id <= 799) {
    return fogIcon;
  } else if (id === 800) {
    return clearIcon;
  } else if (id === 801) {
    return partlyCloudy;
  } else if (id > 801 && id <= 805) {
    return mostlyCloudy;
  } else {
    return unknownIcon;
  }
}

function selectFigCaption(id) {
  const figCaption = document.querySelector("figcaption");

  if (id < 300) {
    figCaption.textContent = "Thunderstorms";
  } else if (id >= 300 && id <= 499) {
    figCaption.textContent = "Light rain or drizzle";
  } else if (id >= 500 && id <= 599) {
    figCaption.textContent = "Rainy weather";
  } else if (id >= 600 && id <= 699) {
    figCaption.textContent = "Snowy conditions";
  } else if (id >= 700 && id <= 799) {
    figCaption.textContent = "Foggy weather";
  } else if (id === 800) {
    figCaption.textContent = "Clear Sky";
  } else if (id === 801) {
    figCaption.textContent = "Partly Cloudy";
  } else if (id > 801 && id <= 805) {
    figCaption.textContent = "Mostly Cloudy";
  } else {
    figCaption.textContent = "Unknown or Unexpected Weather";
  }
}

(function printWeatherTimeIntervals() {
  weatherData.list.forEach((item) => {
    const article = document.createElement("article");
    const span1 = document.createElement("span");
    const date = new Date(item.dt_txt);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    span1.textContent = `${hours}:${minutes}`;
    const img = document.createElement("img");
    img.src = selectIcon(item.weather[0].id);
    const span2 = document.createElement("span");
    span2.textContent = Math.round(item.main.temp) + "°C";
    article.append(span1, img, span2);
    weatherChanges.appendChild(article);
  });
})();

function calculateAverage(param) {
  return Math.round(
    weatherData.list.reduce((accumulator, item) => {
      return (accumulator += item.main[param]);
    }, 0) / weatherData.list.length,
  );
}

humidity.textContent = calculateAverage("humidity") + "%";

pressure.textContent = calculateAverage("pressure").toFixed(2);

minTemp.textContent = calculateAverage("temp_min") + "°";

maxTemp.textContent = calculateAverage("temp_max") + "°C";

findWeatherButton.addEventListener("click", () => {
  getWeatherData()
    .then((weatherData) => {
      console.log(weatherData);

      const averageId =
        weatherData.list.reduce((accumulator, item) => {
          return (accumulator += item.weather[0].id);
        }, 0) / weatherData.list.length;
      generalWeatherIcon.src = selectIcon(Math.round(averageId));

      selectFigCaption(Math.round(averageId));

      humidity.textContent = calculateAverage("humidity") + "%";
      pressure.textContent = calculateAverage("pressure").toFixed(2);
      minTemp.textContent = calculateAverage("temp_min") + "°";
      maxTemp.textContent = calculateAverage("temp_max") + "°C";

      weatherData.list.forEach((item) => {
        const article = document.createElement("article");
        const span1 = document.createElement("span");
        const date = new Date(item.dt_txt);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        span1.textContent = `${hours}:${minutes}`;
        const img = document.createElement("img");
        img.src = selectIcon(item.weather[0].id);
        const span2 = document.createElement("span");
        span2.textContent = Math.round(item.main.temp) + "°C";
        console.log(span2);
        article.append(span1, img, span2);
        weatherChanges.appendChild(article);
      });
    })
    .catch((error) => console.log(error));
});
