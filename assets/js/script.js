// data.dom
const currentDateEl = document.querySelector("#current-date");

// api.coronal-mass-ejection
const apiKey = "DEMO_KEY";
const startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
const endDate = moment().format("YYYY-MM-DD");
const apiUrl = `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;

// logic.displays current time
var currentDate = moment().format("MMMM Do");
currentDateEl.textContent = currentDate;

// logic
var getWeather = function() {
    fetch(apiUrl)
     .then(function (response){
        return response.json();
     })
     .then(function (data) {
        console.log(data);
     });
};

getWeather();