// dom
const currentDateEl = document.querySelector("#current-date");

// logic.get-time
let currentDate = new Date();
let currentDay = currentDate.getDate();
let currentMonth = currentDate.getMonth() + 1;
let currentYear = currentDate.getFullYear();

let endDate = `${currentYear}-${currentMonth}-${currentDay}`
console.log(endDate)

// logic.display-time
currentDateEl.innerHTML = currentDate;
console.log(currentDateEl);


// api.cme
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/DONKI/CME?endDate=${endDate}&api_key=${apiKey}`;

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