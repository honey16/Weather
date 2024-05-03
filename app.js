
//Select Elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

//App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}


//App constants
const KELVIN = 273;
//Api key
const key = "82005d27a116c2880c8f0fcb866998a0";

//Check if browser supports geolocation - Most important
if ('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else{
    notificationElement.computedStyleMap.display = "block";
    notificationElement.innerHTML = "<p> Browser doesn't support Geolocation </p>"
}

//Set user's postion
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

//Show error when issue with geolocation service
function showError(error){
    notificationElement.style.display = "block";notificationElement.innerHTML = `<p> ${error.message} </p>`
}

//Get weather Important
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api).then(function(response){
        let data = response.json();
        console.log(data);
        return data;
    }).then(function(data){
        //Save values to our weather object
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    }).then(function(){
        displayWeather();
    });
}

//Display Weather to UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`
    tempElement.innerHTML = `${weather.temperature.value}&deg;<span>C</span>`;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    descElement.innerHTML = `${weather.description}`;
}

//C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// When user clicks on temperature element change unit
tempElement.addEventListener("click", function() {
    if (weather.temperature.value === undefined) return ;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}&deg;<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
    
});

