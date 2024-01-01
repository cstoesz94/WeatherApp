// API keys
const weatherApiKey = '074c0872ebdebc27ab230f233ff1679a'; // Enter API Key 
const timeApiKey = 'AmlynUsMejbtwFtmXWZ6dvEnsBkWmvpoKR-1EIWhPv0b5V-JPQQEG8hwhDyA7xf-'; // Enter API Key

// Variables
const form = document.querySelector("#form");
const cityInput = document.querySelector("#cityInput");
let errorMessage = document.querySelector("#error-message");
let weatherContainer = document.querySelector("#weather-container");
let weatherImg = document.querySelector("#weatherImg");

// Fetches the API data for the selected city.
async function checkWeather(city){
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?&appid=${weatherApiKey}&units=metric&q=${city}`);
        const data = await response.json();

        displayWeather(data);
        displayWeatherImage(data);

        checkTime(data.coord.lat, data.coord.lon);
    } catch {
        displayError();
    }
};

// Display weather data for selected city.
function displayWeather(data){
    document.querySelector("#city").innerHTML = data.name
    document.querySelector("#temp").innerHTML = `Temperature: ${Math.round(data.main.temp)}°C`;
    document.querySelector("#real-temp").innerHTML = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    document.querySelector("#wind").innerHTML = `Wind: ${Math.round(data.wind.speed)} km/h`;
}

// Displays appropriate weather image depending on weather data for selected city.
function displayWeatherImage(data){
    weatherImg.style.visibility = "visible";
    if (data.weather[0].main == "Mist"){
        weatherImg.src = 'images/mist.svg';
    } else if (data.weather[0].main == 'Clouds'){
        weatherImg.src = 'images/clouds.svg';
    } else if (data.weather[0].main == 'Rain'){
        if (data.weather[0].description == 'heavy intensity rain'){
            weatherImg.src = 'images/thunder.svg';
        } else {
            weatherImg.src = 'images/rain.svg';
        }
    } else if (data.weather[0].main == 'Snow'){
        weatherImg.src = 'images/Snow.svg';
    } else if (data.weather[0].main == 'Clear'){
        weatherImg.src = 'images/clear.svg';
    };
}

// Fetches the API data from the selected lat/long coords.
async function checkTime(lat, long){
    try {
        const response = await fetch(`https://dev.virtualearth.net/REST/v1/TimeZone/${lat},${long}?&key=${timeApiKey}`);
        const data = await response.json();

        displayTime(data);
    } catch(e) {
        displayError();
    }
}

// Display time data for selected lat/long coords.
function displayTime(data){
    let time = new Date(data.resourceSets[0].resources[0].timeZone.convertedTime.localTime).toLocaleString();
    document.querySelector("#time").innerHTML = `Date & Time: ${time}`;
}

// Shows the error block if city is not found.
function displayError(){
    errorMessage.innerHTML = 'City not found.';
    errorMessage.style.display = "block";
    weatherContainer.style.display = "none";
}

// Resets the display on form submit - clearing the error message and shows the weather container.
function resetDisplay(){
    errorMessage.style.display = "none";
    errorMessage.innerHTML = '';
    weatherContainer.style.display = "block";
}

// Event listener for form submission which then resets the display and displays the requested weather data.
form.addEventListener("submit", function(event){
    event.preventDefault();
    resetDisplay();
    checkWeather(cityInput.value);
})