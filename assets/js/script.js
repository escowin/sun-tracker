// dom
const currentDateEl = document.querySelector("#current-date");

// logic.API-time
var startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
console.log(startDate);
var endDate = moment().format("YYYY-MM-DD");
console.log(endDate);

// logic.display-time
var currentDate = moment().format("MMMM Do");
currentDateEl.innerHTML = currentDate;





// api.cme
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;
console.log(apiUrl);

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