function hanreg(event) {
    event.preventDefault(); 
    var username = document.getElementById("userr").value;
    var password = document.getElementById("passr").value;
    var confirmPassword = document.getElementById("confirmr").value;
    var resultingError = document.getElementById("resultingError");
    resultingError.textContent = "";
    if(password !== confirmPassword){
        resultingError.textContent = "Passwords don't match.";
        return;
    }
    fetch("http://localhost:8080/WeatherApp/register", {
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
            resultingError.textContent = result.message || "An error occurred. try again.";
        }
    })
    .catch(function(error) {
        console.error("registration error:", error);
        resultingError.textContent = "An error occurred.  try again.";
    });
}
document.getElementById("rform").addEventListener("submit", hanreg);
