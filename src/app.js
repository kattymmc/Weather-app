function formatDate(timestamp){
  let date = new Date(timestamp);
  let hours = date.getHours();
  if(hours < 10){
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if(minutes < 10){
    minutes = `0${minutes}`;
  }
  let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = weekDays[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function showTemperature(response){
  console.log(response);

  farenheit.classList.remove("active");
  celcius.classList.add("active");

  let cityElement = document.querySelector("#city");
  let temperatureElement = document.querySelector("#degrees");
  let windElement = document.querySelector("#wind");
  let humidityElement = document.querySelector("#humidity");
  let pressureElement = document.querySelector("#pressure");
  let descriptionElement = document.querySelector("#description");
  let currentTime = document.querySelector("#current-time");
  let iconElement = document.querySelector("#icon");

  celciusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celciusTemperature);
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = response.data.wind.speed;
  cityElement.innerHTML = response.data.name;
  pressureElement.innerHTML = response.data.main.pressure;
  descriptionElement.innerHTML = response.data.weather[0].description;
  currentTime.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt",response.data.weather[0].description);
}

function changeCity(city){
  if(city.trim() !== ""){
    let apiKey = "3cc14af1cc614dc49a125b2e4cd9bfdf";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(showTemperature);
  }
}

function handleSubmit(event){
  event.preventDefault();
  let search = document.querySelector("#search");
  changeCity(search.value);
}

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

function displayFarenheitTemperature(event){
  event.preventDefault();
  let temperatureElement = document.querySelector("#degrees");
  celcius.classList.remove("active");
  farenheit.classList.add("active");
  let farenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(farenheitTemperature);
}

function displayCelciusTemperature(event){
  event.preventDefault();
  let temperatureElement = document.querySelector("#degrees");
  farenheit.classList.remove("active");
  celcius.classList.add("active");
  temperatureElement.innerHTML = Math.round(celciusTemperature);
}

let celciusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let celcius = document.querySelector("#celcius");
celcius.addEventListener("click", displayCelciusTemperature);

let farenheit = document.querySelector("#farenheit");
farenheit.addEventListener("click", displayFarenheitTemperature);

changeCity("Lima");