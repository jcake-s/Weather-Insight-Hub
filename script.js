const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const WeatherResult = document.getElementById('WeatherResult');

function getWeather(city) {
    const loader = document.getElementById('loader');
    const WeatherResult = document.getElementById('WeatherResult');

    loader.style.display = 'block';
    WeatherResult.innerHTML = '';
    
    const apiKey = '28121f82d1c96932a75c6c22dd81946f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            WeatherResult.innerHTML = `
                <h2>${data.name}</h2>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Condition: ${data.weather[0].description}</p>`;
            
            const weatherCondition = data.weather[0].main;
            document.body.className = weatherCondition.toLowerCase();
        })
        .catch(error => {
            loader.style.display = 'none';
            WeatherResult.innerHTML = "<p>City not found. Please pick a goddamn existing place!</p>";
        });
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