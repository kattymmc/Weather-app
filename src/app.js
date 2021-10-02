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

function icons(){
  var iconsObj = {
    "01d": "sun", "01n": "moon",
    "02d": "cloud-sun", "02n": "cloud-sun",
    "03d": "cloud", "03n": "cloud",
    "04d": "cloud", "04n": "cloud",
    "09d": "rain", "09n": "rain",
    "10d": "rain", "10n": "rain",
    "11d": "lightning", "11n": "lightning",
    "13d": "snow", "13n": "snow",
    "50d": "mist", "50n": "mist"
  }
  return iconsObj;
}
function formatDateDay(timestamp){
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"];
  return days[day];
}
function formatDateHour(timestamp){
  let date = new Date(timestamp * 1000);
  let hour = date.getHours();
  let hourString = "";
  if(hour > 12){
    hour = hour - 12;
    hourString = hour + ' p.m.';
  } else if (hour == 0) {
    hourString = '12 a.m.';
  } else if (hour == 12) {
    hourString = '12 p.m.';
  }else {
    hourString = hour + ' a.m.';
  }
  return hourString;
}

function displayForecast(response){
  console.log(response.data);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  forecastHTML += '<div class="row">';
  let forecast = response.data.daily;
  forecast.forEach(function(forecastDay, index){
    if(index<6){
      let iconImage = icons()[forecastDay.weather[0].icon];
      forecastHTML += `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDateDay(forecastDay.dt)}</div>
        <img src="img/${iconImage}.png" alt="" width="50"/>
        <div class="weather-forecast-temperature">
            <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temp.max)}°</span>
            <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temp.min)}°</span>
        </div>
      </div>`
    }
  })
  forecastHTML += '</div>';
  forecastElement.innerHTML = forecastHTML;

  let forecastHourlyElement = document.querySelector("#hourly-forecast");
  let forecastHourlyHTML = "";
  forecastHourlyHTML += '<div class="row">';
  let forecastHourly = response.data.hourly;
  forecastHourly.forEach(function(forecastHour, index){
    if(index<6){
      let iconImage = icons()[forecastHour.weather[0].icon];
      forecastHourlyHTML += `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDateHour(forecastHour.dt)}</div>
        <img src="img/${iconImage}.png" alt="" width="50"/>
        <div class="weather-forecast-temperature">
            <span class="weather-forecast-temperature-max">${Math.round(forecastHour.temp)}°</span>
        </div>
      </div>`
    }
  });
  forecastHourlyHTML += '</div>';
  forecastHourlyElement.innerHTML = forecastHourlyHTML;
}

function getForecast(coordinates){
  console.log(coordinates);
  let apiKey = "3cc14af1cc614dc49a125b2e4cd9bfdf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
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

  let iconImage = icons()[response.data.weather[0].icon];
  console.log(iconImage);
  celciusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celciusTemperature);
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = response.data.wind.speed;
  cityElement.innerHTML = response.data.name;
  pressureElement.innerHTML = response.data.main.pressure;
  descriptionElement.innerHTML = response.data.weather[0].description;
  currentTime.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute("src",`img/${iconImage}.png`);
  iconElement.setAttribute("alt",response.data.weather[0].description);
  getForecast(response.data.coord);
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

function cityDefault(event){
  event.preventDefault();
  let cityName = event.target.innerHTML;
  changeCity(cityName);
}

let celciusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let celcius = document.querySelector("#celcius");
celcius.addEventListener("click", displayCelciusTemperature);

let farenheit = document.querySelector("#farenheit");
farenheit.addEventListener("click", displayFarenheitTemperature);

let lisbon = document.querySelector("#lisbon");
lisbon.addEventListener("click", cityDefault);
let paris = document.querySelector("#paris");
paris.addEventListener("click", cityDefault);
let sydney = document.querySelector("#sydney");
sydney.addEventListener("click", cityDefault);
let sanFrancisco = document.querySelector("#san-francisco");
sanFrancisco.addEventListener("click", cityDefault);
let tokyo = document.querySelector("#tokyo");
tokyo.addEventListener("click", cityDefault);

changeCity("Lima");
displayForecast();