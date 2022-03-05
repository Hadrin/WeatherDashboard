const apiKey = "95ffd74275e687c9baaa507a3b94d156";

let historyContainer = document.querySelector('#history');
let inputForm = document.querySelector('#searchbar');
let inputField = document.querySelector('#city-input');
let weatherContainer = document.querySelector('#weather-display');

let generateHistory = true;
let useStorage = false;

//Handler for form submission
function getForecast(event) {
    event.preventDefault();
    generateHistory = true;
    getCoords(inputField.value);
}

//Retrieves coords given a city, required to retrieve weather data via getWeather
function getCoords(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (data[0]) {
                if (generateHistory) {
                    makeHistory(city);
                }
                getWeather(data[0], city);
            } else {
                alert(`${city} not found.`);
            }
        })
}

//retrieve weather data using json returned from getCoords
function getWeather(data, name) {
    const { lat } = data;
    const { lon } = data;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}`)
        .then(function (res) {
            return res.json();
        }).then(function (weather) {
            console.log(weather);
            console.log(weather.daily[0].temp.day);
            console.log(weather.daily[1].temp.day);
            displayWeather(name, weather.current.temp, weather.current.humidity, weather.current.wind_speed, weather.current.uvi);
        })
}

//Creates new history button when search is run
//Also handles local storage
function makeHistory(city) {
    let historyEntry = document.createElement('button');
    historyEntry.setAttribute('type', 'button');
    historyEntry.textContent = city;
    historyContainer.append(historyEntry);

    //If block necessary to prevent loading from localStorage from overwriting itself
    if (useStorage) {
        localStorage.setItem('History3', localStorage.getItem('History2'));
        localStorage.setItem('History2', localStorage.getItem('History1'));
        localStorage.setItem('History1', city);
    }
}

//Searches using button text, does not create new history button
function searchFromHistory(event) {
    generateHistory = false;
    getCoords(event.target.textContent);
}

//Loads in history from localStorage
function init() {
    for (var i = 3; i > 0; i--) {
        let history = localStorage.getItem(`History${i}`);
        if (history && !(history == "null")) {
            makeHistory(history);
        }
    }
    useStorage = true;
}

//Creates a card on the page which displays the current weather for selected city
function displayWeather(name, temp, humidity, wind, uv){
    if(weatherContainer.firstChild){
        weatherContainer.removeChild(weatherContainer.firstChild);
    }
    let currentWeather = document.createElement('section');
    let currentName = document.createElement('h2');
    let currentTemp = document.createElement('p');
    let currentHumid = document.createElement('p');
    let currentWind = document.createElement('p');
    let currentUv = document.createElement('p');

    currentWeather.setAttribute('class', 'weatherCard');
    currentDate = new Date();

    currentName.textContent = "Weather In " + name + " For " + (currentDate.getMonth() + 1) + "/" + (currentDate.getDay() - 1);
    currentTemp.textContent = "Temp: " + temp;
    currentHumid.textContent = "Humidity: " + humidity;
    currentWind.textContent = "Wind Speed: " + wind;
    currentUv.textContent = "UV Index: " + uv;

    currentWeather.append(currentName, currentTemp, currentHumid, currentWind, currentUv);
    weatherContainer.append(currentWeather);
}



historyContainer.addEventListener('click', searchFromHistory);
inputForm.addEventListener('submit', getForecast);
init();