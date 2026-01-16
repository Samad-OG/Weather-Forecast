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
            checkWeather("Chandigarh"); // Agar user deny kare toh default city
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
    // City & Temp
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    
    // Wind Speed Fix: Meter/sec ko km/h mein convert kiya (data.wind.speed * 3.6)
    document.querySelector(".wind").innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";
    document.getElementById("weather-desc").innerHTML = data.weather[0].description;

    // Date & Day update
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("date-time").innerHTML = now.toLocaleDateString('en-US', options);

    // Weather Condition based BG & Card color
    let weatherMain = data.weather[0].main;
    let bgImg = "";
    let cardBg = "";

    if (weatherMain == "Clouds") {
        bgImg = "url('https://images.unsplash.com/photo-1534088568595-a066f7105a21')";
        cardBg = "rgba(100, 116, 139, 0.3)";
    } else if (weatherMain == "Clear") {
        bgImg = "url('https://images.unsplash.com/photo-1506466010722-395aa2bef877')";
        cardBg = "rgba(245, 158, 11, 0.2)";
    } else if (weatherMain == "Rain" || weatherMain == "Drizzle") {
        bgImg = "url('https://images.unsplash.com/photo-1534274988757-a28bf1a57c17')";
        cardBg = "rgba(30, 58, 138, 0.4)";
    } else if (weatherMain == "Mist" || weatherMain == "Haze") {
        bgImg = "url('https://images.unsplash.com/photo-1543968996-ee822b8176ba')";
        cardBg = "rgba(255, 255, 255, 0.1)";
    } else {
        bgImg = "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b')";
        cardBg = "rgba(255, 255, 255, 0.2)";
    }

    document.body.style.backgroundImage = bgImg;
    document.querySelector(".card").style.background = cardBg;

    // AQI Fetch
    fetchAQI(data.coord.lat, data.coord.lon);
}

async function fetchAQI(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const data = await response.json();
    const aqi = data.list[0].main.aqi;
    const aqiLevels = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
    const aqiSpan = document.getElementById("aqi-val");
    aqiSpan.innerHTML = `${aqi} (${aqiLevels[aqi]})`;
    
    // AQI color change based on severity
    if(aqi <= 2) aqiSpan.style.color = "#00ff88";
    else if(aqi == 3) aqiSpan.style.color = "#ffcc00";
    else aqiSpan.style.color = "#ff4d4d";
}

searchBtn.addEventListener("click", () => { checkWeather(searchBox.value); });
searchBox.addEventListener("keypress", (e) => { if(e.key === "Enter") checkWeather(searchBox.value); });
