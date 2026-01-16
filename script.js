 const apiKey = "1893a50ceeb82342cb7155224a6d10ed";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

// Page load hote hi location maangne ke liye
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
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
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    const weatherMain = data.weather[0].main;
    const body = document.body;
    const card = document.querySelector(".card");

    // Dynamic BG based on weather
    let bgImage = "";
    let cardColor = "";

    if (weatherMain == "Clouds") {
        bgImage = "url('https://images.unsplash.com/photo-1534088568595-a066f7105a21')";
        cardColor = "rgba(100, 116, 139, 0.4)"; // Grayish for clouds
    } else if (weatherMain == "Clear") {
        bgImage = "url('https://images.unsplash.com/photo-1506466010722-395aa2bef877')";
        cardColor = "rgba(245, 158, 11, 0.3)"; // Golden for sun
    } else if (weatherMain == "Rain") {
        bgImage = "url('https://images.unsplash.com/photo-1534274988757-a28bf1a57c17')";
        cardColor = "rgba(30, 58, 138, 0.4)"; // Deep blue for rain
    } else {
        bgImage = "linear-gradient(45deg, #1d3557, #457b9d)";
        cardColor = "rgba(255, 255, 255, 0.15)";
    }

    body.style.backgroundImage = bgImage;
    card.style.background = cardColor; // Card ka bg change
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
