async function getCoordinates() {
    const searchBar = document.getElementById("search-bar");

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent
    (searchBar.value.toLowerCase())}&count=1&language=en&format=json`;

    try {
        const response = await fetch(url)
        console.log('Response:', response);

        searchBar.value = "";

        if (!response.ok) {

            throw new Error(`Response status: ${response.status}`);
        }

        const coordinatesData = await response.json();

        if (!coordinatesData.results || coordinatesData.results.length === 0) {
            throw new Error("Location not found");
        }

        const {latitude, longitude, name} = coordinatesData.results[0];

        console.log('Latitude:', latitude, 'Longitude:', longitude);

        fetchWeather(latitude, longitude, name);
    } catch (error) {
        console.error(error.message);
        alert("Location not found, please try a different location.");
    }
}

function fetchWeather(latitude, longitude, name) {
    fetch("https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+
        longitude+"&current=temperature_2m,precipitation,rain,wind_speed_10m&wind_speed_unit=ms")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error when fetching from api: " + response.status);
            }
            response.json().then((weatherData) => {
                console.log('Weather data:', weatherData);
                displayResults(weatherData, name);
            });
        })
}

function displayResults(weatherData, name) {
    const weatherResultsContainer = document.getElementById("weather-results");
    if (weatherResultsContainer.children.length === 5){
        weatherResultsContainer.innerHTML = "";
    }

    const weatherSearch = document.createElement("article");
    weatherSearch.classList.add("weather-search");

    const location = document.createElement("h1");
    const temperature = document.createElement("p");
    const precipitation = document.createElement("p");
    const windSpeed = document.createElement("p");

    location.textContent = name;
    temperature.textContent = "Temperature: " + weatherData.current.temperature_2m + " °C";
    precipitation.textContent = "Precipitation: " + weatherData.current.precipitation + " mm";
    windSpeed.textContent = "Wind: " + weatherData.current.wind_speed_10m+ " m/s";

    weatherSearch.appendChild(location);
    weatherSearch.appendChild(temperature);
    weatherSearch.appendChild(precipitation);
    weatherSearch.appendChild(windSpeed);

    weatherResultsContainer.appendChild(weatherSearch);
}