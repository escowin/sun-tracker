// data.dom
const currentDateEl = document.querySelector("#current-date");

// api.coronal-mass-ejection
// to-do | use the real api key but keep it hidden
const apiKey = "DEMO_KEY";
const endDate = moment().format("YYYY-MM-DD");

// logic.displays current time
var currentDate = moment().format("MMMM Do");
currentDateEl.textContent = currentDate;

// fetches the array of recent coronal mass ejections
const getCoronalMassEjections = function() {
   const startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
   const apiUrl = `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;

   // fetching the array of recent solar flares
   fetch(apiUrl).then(function(response) {
      // method formats the response as json. returns a promise. the then() method captures the actual data
      response.json().then(function(data) {
         console.log(data);
      });
   });
}

const getSolarFlares = function() {
   const startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
   const apiUrl = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;

   // fetching the array of recent solar flares
   fetch(apiUrl).then(function(response) {
      // method formats the response as json. returns a promise. the then() method captures the actual data
      response.json().then(function(data) {
         console.log(data);
      });
   });
}

// calls. to-do | maybe combine both calls into getSolarActivity() that takes in different parameters (CME, FLR) to streamline the functions bc they're awfully similar atm
getCoronalMassEjections();
getSolarFlares();