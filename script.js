const apiKey = "95ffd74275e687c9baaa507a3b94d156";

let historyContainer = document.querySelector('#history');
let inputForm = document.querySelector('#searchbar');
let inputField = document.querySelector('#city-input');

let generateHistory = true;

function getForecast(event) {
    event.preventDefault();
    generateHistory = true;
    getCoords(inputField.value);
}

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
                getWeather(data[0]);
            } else {
                alert(`${city} not found.`);
            }
        })
}


function getWeather(data) {
    const { lat } = data;
    const { lon } = data;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}`)
        .then(function (res) {
            return res.json();
        }).then(function (weather) {
            console.log(weather);
            console.log(weather.daily[0].temp.day);
            console.log(weather.daily[1].temp.day);
        })
}

function makeHistory(city) {
    let historyEntry = document.createElement('button');
    historyEntry.setAttribute('type', 'button');
    historyEntry.textContent = city;
    historyContainer.append(historyEntry);
}

function searchFromHistory(event) {
    generateHistory = false;
    getCoords(event.target.textContent);
}

historyContainer.addEventListener('click', searchFromHistory);
inputForm.addEventListener('submit', getForecast);