
let apiKey = "a254804501843d5o84b16tf864cb33f6";
let units = "metric";
let baseWeatherURL=`https://api.shecodes.io/weather/v1/current?key=${apiKey}&units=${units}&query=`;

// write your code here
function getTemperature(value)
{
  return Math.floor(value);
}

function convertToFarinheit(value)
{
  return value * 1.8 + 32;
}

function setElementValue(id, value) {
  let element = document.querySelector(id);
  if (element) {
    element.innerHTML = value;
  }
}

function printForecast(response)
{
  let forecastHTML = '';
  let days = response.data.daily;

  let i = 1;

  while (i < 6) {
    let element = days[i];
    forecastHTML += `                
    <div class="row add-info-row">
      <div class="col-3 justify-content-start p-1">
        <span class="add-label">${getDayOfWeek((new Date(element.time * 1000)).getDay())}</span>
      </div>
      <div class="col-3 p-0 justify-content-start p-lg-1">
        <img
          src="${element.condition.icon_url}"
          alt=${element.condition.description}"
          class="add-weather-pic"
        />
      </div>
      <div class="col-6 justify-content-start p-1">
        <label class="add-temp">${getTemperature(element.temperature.minimum)} °C / ${getTemperature(element.temperature.maximum)} °C</label>
      </div>
    </div>`;
    i++;
  }

  setElementValue("#forecast", forecastHTML);

}

function printCityWeather(cityWeather)
{
  setElementValue("#city-label", cityWeather.name);
  setElementValue("#curr-temp-C", getTemperature(cityWeather.temp));
  setElementValue("#curr-humidity", cityWeather.humidity);
  setElementValue("#curr-wind", cityWeather.wind);
  setElementValue("#curr-descr", cityWeather.description);
  setElementValue("#curr-datetime", getFormattedDateTime(cityWeather.timestamp * 1000));
  let weaterImage = document.querySelector("#weather-icon");

  weaterImage.setAttribute("src",`http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${cityWeather.icon}.png`);
  weaterImage.setAttribute("alt", cityWeather.description);
  
  let url = `https://api.shecodes.io/weather/v1/forecast?query=${cityWeather.name}&units=${units}&key=${apiKey}`;
  axios.get(url).then(printForecast);

}

function getWeatherInfo(response) {
  if (response.status === 200) {
    printCityWeather({
      name: response.data.city,
      temp: response.data.temperature.current,
      humidity: response.data.temperature.humidity,
      wind: response.data.wind.speed,
      description: response.data.condition.description,
      timestamp: response.data.time, 
      icon: response.data.condition.icon,
      coord: response.data.coordinates
    });
  }

}

function getWeather(city)
{
  city = city.trim();

  let url = baseWeatherURL + city;
  axios.get(url).then(getWeatherInfo);
}

function getDayOfWeek(day) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thue", "Fri", "Sat"];
  return days[day];
}

function getCorrectMonth(month) {
  let monthStr = (month + 1).toString();
  if (monthStr.length === 1) {
    monthStr = "0" + monthStr;
  }
  return monthStr;
}

function getTwoDigitValue(value) {
  if (value < 10) {
     return `0${value}`;
  }
  return value;
}

function getFormattedDateTime(timestamp) {
  let currDate = new Date(timestamp);
  return `${getDayOfWeek(currDate.getDay())}. ${currDate.getDate()}.${getCorrectMonth(currDate.getMonth())}.${currDate.getFullYear()} ${getTwoDigitValue(currDate.getHours())}:${getTwoDigitValue(currDate.getMinutes())}`;

}

function updateWeatherInfo(event){
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");

  getWeather(cityInput.value);
  cityInput.value = "";

}

function getCurrentPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  lat = lat.toFixed(2);
  lon = lon.toFixed(2);

  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(url).then(getWeatherInfo);
}

function getweatherByNavigator() {
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}

//Map weather info
let weatherForm = document.querySelector("#weather-info-form");
weatherForm.addEventListener("submit", updateWeatherInfo);

let cityName = document.querySelector("#city-label");
getWeather(cityName.innerHTML);

let elements = document.querySelectorAll('.city-list');

let clickEvent = (e) => {
  getWeather(e.target.innerText);
}
Array.prototype.forEach.call(elements, (item) => {
  item.addEventListener('click', clickEvent);
});