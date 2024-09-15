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

async function getWeatherData() {
  const cityName = document.querySelector("header > input").value.trim();
  const errorMessage = document.getElementById("error-message");

  try {
    if (!cityName) {
      throw new Error("Please enter a city name.");
    }
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=8&units=metric&appid=adf0aaf36e0aa6b366d700257417e54f`,
    );
    if (response.status === 404) {
      throw new Error(
        "City not found! Please insert a valid city name or check the spelling.",
      );
    }
    const json = await response.json();
    if (json.cod === "404") {
      throw new Error("City not found");
    }

    errorMessage.style.display = "none";
    return json;
  } catch (error) {
    errorMessage.textContent = `Error: ${error.message}`;
    errorMessage.style.display = "block";
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

function calculateAverage(data, param) {
  return Math.round(
    data.list.reduce((accumulator, item) => {
      return (accumulator += item.main[param]);
    }, 0) / data.list.length,
  );
}

findWeatherButton.addEventListener("click", () => {
  getWeatherData()
    .then((weatherData) => {
      const averageId =
        weatherData.list.reduce((accumulator, item) => {
          return (accumulator += item.weather[0].id);
        }, 0) / weatherData.list.length;
      generalWeatherIcon.src = selectIcon(Math.round(averageId));

      selectFigCaption(Math.round(averageId));

      humidity.textContent = calculateAverage(weatherData, "humidity") + "%";
      pressure.textContent = calculateAverage(weatherData, "pressure");
      minTemp.textContent = calculateAverage(weatherData, "temp_min") + "°";
      maxTemp.textContent = calculateAverage(weatherData, "temp_max") + "°C";

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
    })
    .catch((error) => console.log(error));
  document.querySelector(".app__main").style.display = "flex";
});
