// List to store searched locations
let searchedLocationsList = [];

/**
 * Fetches the coordinates of the location entered in the search bar, then fetches the weather data of the location
 * @returns {Promise<void>}
 */
async function getCoordinates() {
    const searchBar = document.getElementById("search-bar");

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${
        encodeURIComponent(searchBar.value.toLowerCase())}&count=1&language=en&format=json`;

    // Fetch the coordinates of the location
    try {
        const response = await fetch(url)
        console.log('Response:', response);

        // Clear the search bar
        searchBar.value = "";

        if (!response.ok) {

            throw new Error(`Response status: ${response.status}`);
        }

        const coordinatesData = await response.json();

        // Check if the location was found
        if (!coordinatesData.results || coordinatesData.results.length === 0) {
            throw new Error("Location not found");
        }

        // Get the latitude, longitude and name of the location
        const {latitude, longitude, name} = coordinatesData.results[0];

        console.log('Latitude:', latitude, 'Longitude:', longitude);

        // Clear the searchedLocationsList if it contains more than 5 locations
        if(searchedLocationsList.length > 5){
            searchedLocationsList.length = 0;
            document.createElement("weather-results").innerHTML = "";
        }

        // Add the searched location to the searchedLocationsList
        searchedLocationsList.push({latitude, longitude, name});

        // Fetch the weather data of the location
        fetchWeather(latitude, longitude, name);
    } catch (error) {
        console.error(error.message);
        alert("Location not found, please try a different location.");
    }
}

/**
 * Fetches the weather data of the location
 * @param latitude
 * @param longitude
 * @param name
 */
function fetchWeather(latitude, longitude, name) {
    // Fetch the weather data of the location based on the latitude and longitude
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" +
        longitude + "&current=temperature_2m,precipitation,rain,wind_speed_10m&wind_speed_unit=ms")
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

/**
 * Checks if the weather results container contains the default placeholders
 * @returns {boolean}
 */
function containsDefaultPlaceholders(){
    const weatherResultsContainer = document.getElementById("weather-results");
    const defaultPlaceholders = ["Location", "Temperature", "Precipitation", "Rain", "Wind)"];

    // Check if the weather results container contains the default placeholders
    for(let article of weatherResultsContainer.children){
        const foundDefaults = Array.from(
            article.querySelectorAll("h1, p")).map(element => element.textContent.trim());
        if (defaultPlaceholders.every(placeholder => foundDefaults.includes(placeholder))){
            return true;
        }
    }
    return false;
}

/**
 * Displays the weather data of the location
 * @param weatherData
 * @param name
 */
function displayResults(weatherData, name) {
    const weatherResultsContainer = document.getElementById("weather-results");

    // Clear the weather results container if it contains 5 locations
    // and the location is already in the searchedLocationsList
    if (weatherResultsContainer.children.length === 5 && (searchedLocationsList.some(location =>
        location.name === name) || containsDefaultPlaceholders())) {
        weatherResultsContainer.innerHTML = "";
    } else {
        // Remove the existing search if it exists
        const existingSearch = Array.from(weatherResultsContainer.children).find(article =>
            article.querySelector("h1").textContent === name);
        if (existingSearch) {
            weatherResultsContainer.removeChild(existingSearch);
        }
    }

    // Create the weather search
    const weatherSearch = document.createElement("article");
    weatherSearch.classList.add("weather-search");

    const location = document.createElement("h1");
    const temperature = document.createElement("p");
    const precipitation = document.createElement("p");
    const rain = document.createElement("p");
    const windSpeed = document.createElement("p");

    location.textContent = name;
    temperature.textContent = "Temperature: " + weatherData.current.temperature_2m + " °C";
    rain.textContent = "Rain: " + weatherData.current.rain + " mm";
    precipitation.textContent = "Precipitation: " + weatherData.current.precipitation + " mm";
    windSpeed.textContent = "Wind Speed (10 m): " + weatherData.current.wind_speed_10m + " m/s";

    weatherSearch.appendChild(location);
    weatherSearch.appendChild(temperature);
    weatherSearch.appendChild(precipitation);
    weatherSearch.appendChild(rain);
    weatherSearch.appendChild(windSpeed);

    // Add the weather search to the weather results container
    weatherResultsContainer.appendChild(weatherSearch);
}

/**
 * Updates the weather data of the locations in the searchedLocationsList
 */
function updateWeather() {
    searchedLocationsList.forEach(location => {
        fetchWeather(location.latitude, location.longitude, location.name);
    });
}

updateWeather();

// Update weather every minute
setInterval(updateWeather, 60000)