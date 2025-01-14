function hansub(event){
    event.preventDefault(); 
    var username = document.getElementById("userr").value;
    var password = document.getElementById("passr").value;
    var resultingError = document.getElementById("resultingError");
    fetch("http://localhost:8080/WeatherApp/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)
    })
    .then(function(response){
        return response.json();
    })
    .then(function(result){
        if(result.status === "success"){
            localStorage.setItem("user_id", result.user_id);
            window.location.href = "index.html"; 
        } 
        else{
            resultingError.textContent = result.message;
        }
    })
    .catch(function(error) {
        console.error("Error during login:", error);
        resultingError.textContent = "An  error occurred. try again.";
    });
}
document.getElementById("lcon").addEventListener("submit", hansub);


