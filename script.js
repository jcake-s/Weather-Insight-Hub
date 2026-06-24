const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const WeatherResult = document.getElementById('WeatherResult');
const clearBtn = document.getElementById('clearBtn');

function getWeather(city) {
    const loader = document.getElementById('loader');

    WeatherResult.classList.remove('show');
    loader.style.display = 'block';
    WeatherResult.innerHTML = '';
    
    const apiKey = '28121f82d1c96932a75c6c22dd81946f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            localStorage.setItem('lastCity', city);
            const iconClass = getIcon(data.weather[0].main);
            let alertMessage = '';
            if (data.main.humidity > 80) {
                alertMessage = '<span class="alert"> ⚠️ High Humidity Warning</span>';
            } else if (data.wind.speed > 10) {
                alertMessage = '<span class="alert"> 💨 High Wind Advisory</span>';
            }

            WeatherResult.innerHTML = `
                <h2>${data.name}</h2>
                ${alertMessage}
                <i class="fas ${iconClass} weather-icon"></i>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Condition: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>`;
            WeatherResult.classList.add('show');
            
            document.body.className = data.weather[0].main.toLowerCase();

            setTimeout(() => {WeatherResult.classList.add('show');}, 50);
        })
        .catch(error => {
            loader.style.display = 'none';
            WeatherResult.innerHTML = "<p>City not found. Please pick a goddamn existing place!</p>";
            WeatherResult.classList.add('show');
        });
        clearBtn.addEventListener('click', function() {
            WeatherResult.classList.remove('show');
        });
}

function getIcon(condition) {
    const icons = {
        "Clouds": "fa-cloud",
        "Rain": "fa-cloud-showers-heavy",
        "Clear": "fa-sun",
        "Snow": "fa-snowflake",
        "Mist": "fa-smog"
    };
    return icons[condition] || "fa-question";
}

searchBtn.addEventListener('click', function() {
    const cityName = cityInput.value;

    if (cityName !== "") {
        getWeather(cityName);
    } else {
        WeatherResult.innerHTML = "<p>Please enter a city name.</p>";
    }
});

cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const cityName = cityInput.value;
        if (cityName !== "") {
            getWeather(cityName);
        }
    }
});

window.onload = () => {
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
        document.getElementById('cityInput').value = savedCity;
        getWeather(savedCity);
    }
};

clearBtn.addEventListener('click', function() {
    localStorage.removeItem('lastCity');
    cityInput.value = '';
    WeatherResult.innerHTML = '';
    document.body.className = '';
});