let currentTime = document.querySelector("#current-time");
let date = new Date();
let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] 
let currentDay = weekDays[date.getDay()];
let dateMinutes = date.getMinutes();
if(dateMinutes < 10){
  dateMinutes = `0${dateMinutes}`;
}
currentTime.innerHTML = `${currentDay} ${date.getHours()}:${dateMinutes}`;

function showTemperature(response){
  console.log(response);
  let temperature = Math.round(response.data.main.temp);
  let cityElement = document.querySelector("#city");
  let temperatureElement = document.querySelector("#degrees");
  let windElement = document.querySelector("#wind");
  let humidityElement = document.querySelector("#humidity");
  let pressureElement = document.querySelector("#pressure");
  let descriptionElement = document.querySelector("#description");

  temperatureElement.innerHTML = temperature;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = response.data.wind.speed;
  cityElement.innerHTML = response.data.name;
  pressureElement.innerHTML = response.data.main.pressure;
  descriptionElement.innerHTML = response.data.weather[0].description;
}

function changeCity(event){
  event.preventDefault();
  let search = document.querySelector("#search");
  if(search.value.trim() !== ""){
    let apiKey = "3cc14af1cc614dc49a125b2e4cd9bfdf";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search.value}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(showTemperature);
  }
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", changeCity);

function showPosition(position){
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "3cc14af1cc614dc49a125b2e4cd9bfdf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentLocation(){
  navigator.geolocation.getCurrentPosition(showPosition);
}

let current = document.querySelector("#current");
current.addEventListener("click", getCurrentLocation);

function changeDegrees(event){
  event.preventDefault();
  let temperatureElement = document.querySelector("#degrees");
  let city = document.querySelector("#city").innerHTML;
  let apiKey = "3cc14af1cc614dc49a125b2e4cd9bfdf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(function (response){
    let temperature = Math.round(response.data.main.temp);
    if(event.target.id === "celcius"){
      console.log(temperature);
      temperatureElement.innerHTML = temperature;
    } else {
      console.log((temperature * 9 / 5) + 32);
      temperatureElement.innerHTML = Math.round((temperature * 9 / 5) + 32);
    }
  });
}

let celcius = document.querySelector("#celcius");
celcius.addEventListener("click", changeDegrees);

let farenheit = document.querySelector("#farenheit");
farenheit.addEventListener("click", changeDegrees);