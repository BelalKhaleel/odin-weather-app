import "./style.css";
import { closestTo } from "date-fns";
import clearIcon from "./weather-icons/clear.svg";
import drizzleIcon from "./weather-icons/drizzle.svg";
import fogIcon from "./weather-icons/fog.svg";
import mostlyCloudy from "./weather-icons/mostlycloudy.svg";
import partlyCloudy from "./weather-icons/partlycloudy.svg";
import rainIcon from "./weather-icons/rain.svg";
import snowIcon from "./weather-icons/snow.svg";
import stormIcon from "./weather-icons/storm.svg";
import unknownIcon from "./weather-icons/unknown.svg";

const findWeatherButton = document.querySelector("button");

async function getWeatherData(location) {
  try {
    if (!location) {
      throw new Error("Please enter a city name.");
    }
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&cnt=8&units=metric&appid=adf0aaf36e0aa6b366d700257417e54f`,
    );
    if (response.status === 404) {
      throw new Error(
        "City not found! Please insert a valid city name or check the spelling.",
      );
    }
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
}

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

function calculateAverage(data, param) {
  return Math.round(
    data.list.reduce((accumulator, item) => {
      return (accumulator += item.main[param]);
    }, 0) / data.list.length,
  );
}

async function displayData() {
  const location = document.querySelector("input").value.trim();
  const minTemp = document.querySelector(".min-temp");
  const maxTemp = document.querySelector(".max-temp");
  const humidity = document.querySelector(".humidity");
  const pressure = document.querySelector(".pressure");
  const weatherChanges = document.querySelector(".weather_changes");
  const generalWeatherIcon = document.querySelector(
    ".general_weather > figure > img",
  );
  const figCaption = document.querySelector("figcaption");
  const title = document.querySelector("header > p");
  const errorMessage = document.querySelector(".error-message");

  while (weatherChanges.firstChild) {
    weatherChanges.removeChild(weatherChanges.firstChild);
  }

  const result = await getWeatherData(location);

  if (result instanceof Error) {
    errorMessage.textContent = `Error: ${result.message}`;
    errorMessage.style.display = "block";
    return;
  }
  console.log(result);
  errorMessage.style.display = "none";

  title.textContent = `Showing results for : "${location}"`;
  humidity.textContent = `${calculateAverage(result, "humidity")}%`;
  pressure.textContent = `${calculateAverage(result, "pressure")}hPa`;
  minTemp.textContent =
    Math.round(Math.min(...result.list.map((item) => item.main.temp_min))) +
    "°";
  maxTemp.textContent =
    Math.round(Math.max(...result.list.map((item) => item.main.temp_max))) +
    "°C";

  const dates = result.list.map((item) => new Date(item.dt_txt));
  const closest = closestTo(new Date(), dates);
  const index = dates.findIndex((date) => date.getTime() === closest.getTime());
  const currentWeather = result.list[index];
  generalWeatherIcon.src = selectIcon(currentWeather.weather[0].id);
  figCaption.textContent = currentWeather.weather[0].description;

  result.list.forEach((item) => {
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
}

findWeatherButton.addEventListener("click", displayData);

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    displayData();
  }
});
