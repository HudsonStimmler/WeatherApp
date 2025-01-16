

function updateNB(){
    const headerURL = document.getElementById("headerURL");
    const userId = localStorage.getItem("user_id");
    if(userId){
        headerURL.innerHTML = `
            <a href="profile.html">Profile</a>
            <a href="#" id="signOutLink">Sign Out</a>
        `;
        document.getElementById("signOutLink").addEventListener("click", () => {
            localStorage.removeItem("user_id"); 
            alert("You have been signed out.");
            window.location.href = "index.html";
        });
    } 
	else{
        headerURL.innerHTML = `
            <a href="login.html">Sign In</a>
            <a href="register.html">Register</a>
        `;
    }
}
var map;
var isMapInitialized = false; 

function togSI(){
    const searchType = document.querySelector('input[name="searchType"]:checked').value;
    const searchFormHead = document.getElementById("searchFormHead");
    if(searchType === "city"){
        searchFormHead.innerHTML = `
            <input type="text" id="searchInput" placeholder="Enter city name">
            <button id="searchButton" disabled title="Search functionality is disabled">
                <img src="images/magnifying_glass.jpeg" alt="Search Icon">
            </button>
        `;
        const searchButton = document.getElementById("searchButton");
        searchButton.addEventListener("click", (e) => {
            e.preventDefault(); 
        });
    } 
	else if(searchType === "latlong"){
        searchFormHead.innerHTML = `
            <input type="text" id="latitudeInput" placeholder="Latitude" style="margin-right: 5px;">
            <input type="text" id="longitudeInput" placeholder="Longitude">
            <button id="mapButton">
                <img src="images/MapIcon.png" alt="Map Icon">
            </button>
        `;
        document.getElementById("mapButton").addEventListener("click", handleCord);
    }
}

function handleCord(){
    const latitudeInput = document.getElementById("latitudeInput");
    const longitudeInput = document.getElementById("longitudeInput");
    const googleApi = document.getElementById("googleApi");
    googleApi.style.display = "block"; 
    if(!map){
        map = new google.maps.Map(document.getElementById("api"), {
            center: { lat: 34.0522, lng: -118.2437 },
            zoom: 8,
        });
    }
    if(!isMapInitialized){
        map.addListener("click", (event) => {
            const selectedLat = event.latLng.lat().toFixed(6);
            const selectedLng = event.latLng.lng().toFixed(6);
            latitudeInput.value = selectedLat;
            longitudeInput.value = selectedLng;
            googleApi.style.display = "none";
        });
        isMapInitialized = true;
    }
}

function movesTOh(){
    const headerContent = document.querySelector('.headerContent');
    const searchContainer = document.getElementById('searchContainer');
    headerContent.appendChild(searchContainer);
    searchContainer.classList.remove('centered');
}

function movesTOc(){
    const page = document.querySelector('.content');
    const searchContainer = document.getElementById('searchContainer');
    const logoImg = document.querySelector('.logo-img');
    page.insertBefore(searchContainer, logoImg.nextSibling);
    searchContainer.classList.add('centered');
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("apiBacking").addEventListener("click", () => {
        document.getElementById("googleApi").style.display = "none";
    });

    if(!localStorage.getItem("user_id")){
        localStorage.removeItem("user_id");
    }
    updateNB();
    togSI();
    document.querySelectorAll('input[name="searchType"]').forEach((radio) => {
        radio.addEventListener("change", togSI);
    });
    document.getElementById("sortOptions").addEventListener("change", sortr);
    document.getElementById("display-all").addEventListener("click", getWeath);
    const searchContainer = document.getElementById('searchContainer');
    searchContainer.classList.add('centered');
});

function getWeath(event){
    if(event){ 
		event.preventDefault(); 
	}
    const cityDetails = document.getElementById("cityDetails");
    cityDetails.style.display = "none";
    const searchType = document.querySelector('input[name="searchType"]:checked').value;
    var query = "";
    var searchQuery = "";
    if(searchType === "city"){
        const city = document.getElementById("searchInput").value;
        if (!city) {
            alert("Please enter a city name.");
            return;
        }
        query = `q=${encodeURIComponent(city)}`;
        searchQuery = city;
    } 
	else{
        const lat = document.getElementById("latitudeInput").value;
        const lon = document.getElementById("longitudeInput").value;
        if(!lat || !lon){
            alert("Please enter both latitude and longitude.");
            return;
        }
        query = `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
        searchQuery = `${lat}, ${lon}`;
    }
    fetch(`https://api.openweathermap.org/data/2.5/find?${query}&units=imperial&appid=key`)
        .then(response => response.json())
        .then(result => {
            if (result.cod && result.cod !== "200") {
                alert(result.message || "An error occurred while fetching weather data.");
            } 
			else{
                display(result);
                var userId = localStorage.getItem("user_id");
                if(userId){
                    fetch("http://localhost:8080/WeatherApp/search", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: "user_id=" + encodeURIComponent(userId) + "&search_query=" + encodeURIComponent(searchQuery)
                    })
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        if(data.error){
                            console.error("Error saving search:", data.error);
                        }
                    })
                    .catch(function(error) {
                        console.error("Error saving search:", error);
                    });
                }
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("An error occurred while fetching weather data.");
        });
}

function display(result){
    const resultsTable = document.getElementById("resultsTable").querySelector("tbody");
    resultsTable.innerHTML = ""; 
    if(!result.list || result.list.length === 0){
        alert("No results found.");
        return;
    }
    document.body.classList.add("search-view"); 
    movesTOh(); 
    window.weatherData = result.list;
    const sortByContainer = document.querySelector('.sort-by-container');
    if(result.list.length === 1){
        sortByContainer.style.display = 'none';
    } 
	else{
        sortByContainer.style.display = 'flex'; 
    }
    result.list.forEach((citdat, index) => {
        const cityName = citdat.name;
        const lowTemp = citdat.main.temp_min;
        const highTemp = citdat.main.temp_max;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="cursor: pointer;" id="city-${index}">${cityName}</td>
            <td>${lowTemp.toFixed(1)}</td>
            <td>${highTemp.toFixed(1)}</td>
        `;
        row.querySelector(`#city-${index}`).addEventListener("click", () => displaycity(citdat));
        resultsTable.appendChild(row);
    });
    document.getElementById("searchResults").style.display = "block";
}

function displaycity(citdat){
    const searchResults = document.getElementById("searchResults");
    searchResults.style.display = "none"; 
    const cityDetails = document.getElementById("cityDetails");
    cityDetails.style.display = "block"; 
    document.body.classList.remove("search-view");
    movesTOc(); 
    fetch(`https://api.openweathermap.org/data/2.5/weather?id=${citdat.id}&units=imperial&appid=key`)
        .then(response => response.json())
        .then(detailedData => {
            cityDetails.innerHTML = `
                <div class="icon-container">
                    <!-- First Row -->
                    <div class="icon-item">
                        <img src="images/planet-earth.png" alt="Location">
                        <p>${detailedData.name}</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/snowflake.png" alt="Temp Low">
                        <p>${detailedData.main.temp_min.toFixed(1)}°F</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/sun.png" alt="Temp High">
                        <p>${detailedData.main.temp_max.toFixed(1)}°F</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/wind.png" alt="Wind">
                        <p>${detailedData.wind.speed.toFixed(1)} mph</p>
                    </div>
                    <!-- Second Row -->
                    <div class="icon-item">
                        <img src="images/drop.png" alt="Humidity">
                        <p>${detailedData.main.humidity}%</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/LocationIcon.png" alt="Coordinates">
                        <p>${detailedData.coord.lat.toFixed(0)}, ${detailedData.coord.lon.toFixed(0)}</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/thermometer.png" alt="Current Temp">
                        <p>${detailedData.main.temp.toFixed(1)}°F</p>
                    </div>
                    <div class="icon-item">
                        <img src="images/sunrise-icon.png" alt="Sunrise and Sunset">
                        <p>${timeform(detailedData.sys.sunrise)} / ${timeform(detailedData.sys.sunset)}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error fetching detailed weather data:", error);
            alert("An error occurred while fetching detailed weather data.");
        });
}

function timeform(stamp){
    const date = new Date(stamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sortr(){
    const sortBy = document.getElementById("sortOptions").value;
    const resultsTable = document.getElementById("resultsTable").querySelector("tbody");
    var sortedData = [...window.weatherData]; 

    sortedData.sort((a, b) => {
        let aValue, bValue;

        if(sortBy.includes("cityName")){
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            if(sortBy.includes("Asc")){
                return aValue.localeCompare(bValue);
            } 
			else{
                return bValue.localeCompare(aValue);
            }
        } 
		else if(sortBy.includes("tempLow")){
            aValue = a.main.temp_min;
            bValue = b.main.temp_min;
        } 
		else if (sortBy.includes("tempHigh")){
            aValue = a.main.temp_max;
            bValue = b.main.temp_max;
        }
        if(sortBy.includes("Asc")){
            return aValue - bValue;
        } 
		else{
            return bValue - aValue;
        }
    });
    resultsTable.innerHTML = "";
    sortedData.forEach((citdat, index) => {
        const cityName = citdat.name;
        const lowTemp = citdat.main.temp_min;
        const highTemp = citdat.main.temp_max;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="cursor: pointer;" id="city-${index}">${cityName}</td>
            <td>${lowTemp.toFixed(1)}</td>
            <td>${highTemp.toFixed(1)}</td>
        `;
        row.querySelector(`#city-${index}`).addEventListener("click", () => displaycity(citdat));
        resultsTable.appendChild(row);
    });
}

function retmain(){
    const cityDetails = document.getElementById("cityDetails");
    cityDetails.style.display = "none"; 
    document.getElementById("searchResults").style.display = "block"; 
    document.body.classList.add("search-view");
    movesTOh(); 
}
