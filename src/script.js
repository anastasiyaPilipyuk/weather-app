  
let apiKey = "9a99caca0eb10bc60aeb3d1a70fd478d";
let units = "metric";
let baseWeatherURL = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=${units}&q=`;

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

function printCityWeather(cityWeather)
{
  setElementValue("#city-label", cityWeather.name);
  setElementValue("#curr-temp-C", getTemperature(cityWeather.temp));
  setElementValue("#curr-temp-F", getTemperature(convertToFarinheit(cityWeather.temp)));
  setElementValue("#curr-humidity", cityWeather.humidity);
  setElementValue("#curr-wind", cityWeather.wind);
  setElementValue("#curr-descr", cityWeather.description);
  setElementValue("#curr-datetime", getFormattedDateTime(cityWeather.timestamp * 1000));
  let weaterImage = document.querySelector("#weather-icon");
  weaterImage.setAttribute("src",     `http://openweathermap.org/img/wn/${cityWeather.icon}@2x.png`);
  weaterImage.setAttribute("alt", cityWeather.description);
}

function getWeatherInfo(response) {

  if (response.status === 200) {
    printCityWeather({
      name: response.data.name,
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
      description: response.data.weather[0].description,
      timestamp: response.data.dt, 
      icon: response.data.weather[0].icon
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

function setElementVisibility(id, value) {
  let element = document.querySelector(id);
  if (element) {
    element.style.display = value;
  }
}

function setElementsVisibility() {
  if (isCelsium == true) {
    setElementVisibility("#curr-temp-C", "inline");
    setElementVisibility("#curr-temp-F", "none");
    setElementVisibility("#alt-measureC-link", "none");
    setElementVisibility("#alt-measureC-label", "inline");
    setElementVisibility("#alt-measureF-link", "inline");
    setElementVisibility("#alt-measureF-label", "none");
  }
  else {
    setElementVisibility("#curr-temp-C", "none");
    setElementVisibility("#curr-temp-F", "inline");
    setElementVisibility("#alt-measureC-link", "inline");
    setElementVisibility("#alt-measureC-label", "none");
    setElementVisibility("#alt-measureF-link", "none");
    setElementVisibility("#alt-measureF-label", "inline");
  }
}

function changeTempToOtherMeasure(event) {
  if (event.target.innerHTML === "C") {
    isCelsium = true;
  } else {
    isCelsium = false;
  }
  setElementsVisibility();
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
document.querySelector("#weather-info-form").addEventListener("submit", updateWeatherInfo);

let cityName = document.querySelector("#city-label");
getWeather(cityName.innerHTML);

//Add event listener to link for changing measure
document.querySelector("#alt-measureC-link").addEventListener("click", changeTempToOtherMeasure);
document.querySelector("#alt-measureF-link").addEventListener("click", changeTempToOtherMeasure);

//Set current measure for celsium
let isCelsium = true;
setElementsVisibility();