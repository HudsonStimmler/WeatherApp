document.addEventListener("DOMContentLoaded", function() {
    var usehead = document.getElementById("usehead");
    var historyTable = document.getElementById("historyTable").querySelector("tbody");
    var userId = localStorage.getItem("user_id"); 
    if (!userId){
        alert("You are not logged in!");
        window.location.href = "login.html";
        return;
    }
    fetch("http://localhost:8080/WeatherApp/profile?user_id=" + encodeURIComponent(userId))
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            if(data.error) {
                alert(data.error);
            } 
            else{
                usehead.textContent = data.username + "'s Search History";
                data.searchHistory.forEach(function(entry) {
                    var row = document.createElement("tr");
                    var stc = document.createElement("td");
                    stc.textContent = entry.searchTerm;
                    stc.style.cursor = "pointer";
                    stc.setAttribute('data-type', entry.type);
                    stc.addEventListener("click", function() {
                        displaysd(entry);
                    });
                    row.appendChild(stc);
                    historyTable.appendChild(row);
                });
            }
        })
        .catch(function(error) {
            console.error("Error:", error);
            alert("An error occurred.");
        });
    var signoutlink = document.getElementById("signoutlink");
    if(signoutlink){
        signoutlink.addEventListener("click", function() {
            localStorage.removeItem("user_id");
            alert("You have been signed out.");
            window.location.href = "index.html"; // Redirect to home page
        });
    }

    function displaysd(entry) {
        var detailsDiv = document.getElementById("detailsDiv");
        if(!detailsDiv){
            detailsDiv = document.createElement("div");
            detailsDiv.id = "detailsDiv";
            historyTable.parentNode.insertBefore(detailsDiv, historyTable.nextSibling);
        }
        detailsDiv.innerHTML = '';
        if(entry.type === "City"){
            getweatherc(entry.searchTerm, detailsDiv);
        } 
        else if(entry.type === "LatLon"){
            var coords = entry.searchTerm.split(",");
            if(coords.length === 2){
                var lat = coords[0].trim();
                var lon = coords[1].trim();
                getweatherll(lat, lon, detailsDiv);
            }
        }
    }

    function getweatherc(city, detailsDiv) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=key`)
            .then(response => response.json())
            .then(data => {
                displaywd(data, detailsDiv);
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                detailsDiv.innerHTML = '<p>Error fetching weather data.</p>';
            });
    }

    function getweatherll(lat, lon, detailsDiv) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=imperial&appid=key`)
            .then(response => response.json())
            .then(data => {
                displaywd(data, detailsDiv);
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                detailsDiv.innerHTML = '<p>Error fetching weather data.</p>';
            });
    }

    function displaywd(data, detailsDiv) {
        detailsDiv.innerHTML = '';
        if (data.cod !== 200) {
            detailsDiv.innerHTML = `<p>Weather data not found: ${data.message}</p>`;
            return;
        }
        var page = `
            <div class="icon-container">
                <!-- First Row -->
                <div class="icon-item">
                    <img src="images/planet-earth.png" alt="Location">
                    <p>${data.name}</p>
                </div>
                <div class="icon-item">
                    <img src="images/snowflake.png" alt="Temp Low">
                    <p>${data.main.temp_min.toFixed(1)}°F</p>
                </div>
                <div class="icon-item">
                    <img src="images/sun.png" alt="Temp High">
                    <p>${data.main.temp_max.toFixed(1)}°F</p>
                </div>
                <div class="icon-item">
                    <img src="images/wind.png" alt="Wind">
                    <p>${data.wind.speed.toFixed(1)} mph</p>
                </div>
                <!-- Second Row -->
                <div class="icon-item">
                    <img src="images/drop.png" alt="Humidity">
                    <p>${data.main.humidity}%</p>
                </div>
                <div class="icon-item">
                    <img src="images/LocationIcon.png" alt="Coordinates">
                    <p>${data.coord.lat.toFixed(0)}, ${data.coord.lon.toFixed(0)}</p>
                </div>
                <div class="icon-item">
                    <img src="images/thermometer.png" alt="Current Temp">
                    <p>${data.main.temp.toFixed(1)}°F</p>
                </div>
                <div class="icon-item">
                    <img src="images/sunrise-icon.png" alt="Sunrise and Sunset">
                    <p>${formt(data.sys.sunrise)} / ${formt(data.sys.sunset)}</p>
                </div>
            </div>
        `;
        detailsDiv.innerHTML = page;
    }

    function formt(stamp) {
        const date = new Date(stamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});
