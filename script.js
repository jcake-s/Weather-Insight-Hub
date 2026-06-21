const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');

searchBtn.addEventListener('click', function() {
    const cityName = cityInput.value;

    if (cityName !== "") {
        getWeather(cityName);
    } else {
        weatherResult.innerHTML = "<p>Please enter a city name.</p>";
    }
});

function getWeather(city) {
    const apiKey = '28121f82d1c96932a75c6c22dd81946f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            weatherResult.innerHTML = `
                <h2>${data.name}</h2>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Condition: ${data.weather[0].description}</p>`;
        })
        .catch(error => {
            weatherResult.innerHTML = "<p>City not found. Please pick a goddamn existing country!</p>";
        });
}