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
        bgImg = "url('https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=1920')"; 
    } else if (weatherMain == "Rain" || weatherMain == "Drizzle") {
        bgImg = "url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1920')"; 
    } else if (weatherMain == "Mist" || weatherMain == "Haze" || weatherMain == "Smoke") {
        bgImg = "url('https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?q=80&w=1920')"; 
    } else {
        bgImg = "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920')"; 
    }

    // Apply background with a dark overlay for comfort
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), ${bgImg}`;
    document.querySelector(".card").style.background = cardBg;

    // Fetch AQI
    fetchAQI(data.coord.lat, data.coord.lon);
}

async function fetchAQI(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const data = await response.json();
    const aqi = data.list[0].main.aqi;
    const aqiLevels = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
    const aqiSpan = document.getElementById("aqi-val");
    aqiSpan.innerHTML = `${aqi} (${aqiLevels[aqi]})`;
    
    // AQI colors
    if(aqi <= 2) aqiSpan.style.color = "#00ff88";
    else if(aqi == 3) aqiSpan.style.color = "#ffcc00";
    else aqiSpan.style.color = "#ff4d4d";
}

searchBtn.addEventListener("click", () => { checkWeather(searchBox.value); });
searchBox.addEventListener("keypress", (e) => { if(e.key === "Enter") checkWeather(searchBox.value); });
