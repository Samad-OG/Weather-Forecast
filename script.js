 const apiKey = "1893a50ceeb82342cb7155224a6d10ed";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

// 1. Page load hote hi current location fetch karega
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        }, () => {
            checkWeather("Chandigarh"); // Default city agar location denied ho
        });
    }
});

async function fetchWeatherByCoords(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    let data = await response.json();
    updateUI(data);
}

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.status == 404) {
        alert("City not found!");
        return;
    }
    let data = await response.json();
    updateUI(data);
}

function updateUI(data) {
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    
    // Wind Speed Fix (km/h conversion)
    document.querySelector(".wind").innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";
    document.getElementById("weather-desc").innerHTML = data.weather[0].description;

    // Date & Day logic
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("date-time").innerHTML = now.toLocaleDateString('en-US', options);

    // Weather Condition based BG (Dark & Eye-friendly)
    let weatherMain = data.weather[0].main;
    let bgImg = "";
    let cardBg = "rgba(0, 0, 0, 0.5)"; // Darker glass effect

    if (weatherMain == "Clouds") {
        bgImg = "url('https://images.unsplash.com/photo-1483977399921-6cf3832d77a5?q=80&w=1920')"; 
    } else if (weatherMain == "Clear") {
        bgImg = "url('
