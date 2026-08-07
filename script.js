const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const WeatherResult = document.getElementById('WeatherResult');
const clearBtn = document.getElementById('clearBtn');
const loader = document.getElementById('loader');
const lastUpdatedEl = document.getElementById('lastUpdated');

function getWeather(city) {
    const trimmed = city.trim();
    if (!trimmed) {
        WeatherResult.innerHTML = '<p>⚠️ Please enter a city name.</p>';
        WeatherResult.classList.add('show');
        return;
    }

    WeatherResult.classList.remove('show');
    WeatherResult.innerHTML = '';
    loader.style.display = 'block';
    lastUpdatedEl.textContent = '';

    const apiKey = '28121f82d1c96932a75c6c22dd81946f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmed)}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            loader.style.display = 'none';

            localStorage.setItem('lastCity', trimmed);

            let alertMessage = '';
            if (data.main.humidity > 80) {
                alertMessage = '<span class="alert">⚠️ High Humidity Warning</span>';
            } else if (data.wind.speed > 10) {
                alertMessage = '<span class="alert">💨 High Wind Advisory</span>';
            }

            const condition = data.weather[0].main;
            const iconClass = getIcon(condition);

            WeatherResult.innerHTML = `
                <h2>${data.name}</h2>
                ${alertMessage}
                <i class="fas ${iconClass} weather-icon"></i>
                <p><strong>${data.main.temp}°C</strong> — ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind: ${data.wind.speed} m/s</p>
            `;
            WeatherResult.classList.add('show');

            document.body.className = condition.toLowerCase();

            const now = new Date();
            lastUpdatedEl.textContent = `Last updated: ${now.toLocaleTimeString()}`;
        })
        .catch((error) => {
            loader.style.display = 'none';
            WeatherResult.innerHTML = `<p>City not found. Please check the spelling and try again.</p>`;
            WeatherResult.classList.add('show');
            document.body.className = '';
            lastUpdatedEl.textContent = '';
            console.warn('Weather fetch error:', error);
        });
}


function getIcon(condition) {
    const map = {
        Clouds: 'fa-cloud',
        Rain: 'fa-cloud-showers-heavy',
        Clear: 'fa-sun',
        Snow: 'fa-snowflake',
        Mist: 'fa-smog',
        Fog: 'fa-smog',
        Haze: 'fa-smog',
        Thunderstorm: 'fa-bolt',
        Drizzle: 'fa-cloud-rain',
    };
    return map[condition] || 'fa-question-circle';
}

searchBtn.addEventListener('click', () => {
    getWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        getWeather(cityInput.value);
    }
});

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('lastCity');
    cityInput.value = '';
    WeatherResult.innerHTML = '';
    WeatherResult.classList.remove('show');
    document.body.className = '';
    lastUpdatedEl.textContent = '';
    loader.style.display = 'none';
});

window.addEventListener('DOMContentLoaded', () => {
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
        cityInput.value = savedCity;
        getWeather(savedCity);
    }
});