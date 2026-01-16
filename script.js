 const apiKey = "1893a50ceeb82342cb7155224a6d10ed";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    let data = await response.json();

    if(response.status == 404) {
        alert("City not found!");
        return;
    }

    // Update UI
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.getElementById("weather-desc").innerHTML = data.weather[0].description;

    // Date and Day Logic
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("date-time").innerHTML = now.toLocaleDateString('en-US', options);

    // Background Change Logic
    let weatherMain = data.weather[0].main;
    let bgImage = "";

    if(weatherMain == "Clouds") bgImage = "https://images.unsplash.com/photo-1534088568595-a066f7105a21";
    else if(weatherMain == "Clear") bgImage = "https://images.unsplash.com/photo-1506466010722-395aa2bef877";
    else if(weatherMain == "Rain") bgImage = "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17";
    else if(weatherMain == "Drizzle") bgImage = "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e";
    else if(weatherMain == "Mist") bgImage = "https://images.unsplash.com/photo-1543968996-ee822b8176ba";

    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${bgImage}')`;

    // Fetch AQI (Air Quality)
    fetchAQI(data.coord.lat, data.coord.lon);
}

async function fetchAQI(lat, lon) {
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(aqiUrl);
    const data = await response.json();
    const aqi = data.list[0].main.aqi;
    const aqiLevels = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
    document.getElementById("aqi-val").innerHTML = `${aqi} (${aqiLevels[aqi]})`;
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
