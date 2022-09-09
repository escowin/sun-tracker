// logic.display copyright year
const copyrightYear = function() {
   let year = new Date().getFullYear();
   const copyrightYearEl = document.querySelector("#copyright-year");
   copyrightYearEl.textContent = year;
};

// logic.display current date
const currentDate = function() {
   let date = moment().format("MMMM Do");
   const currentDateEl = document.querySelector("#current-date");
   currentDateEl.textContent = date;
};

// logic.display api data
const displayCoronalMassEjections = function (CME) {
   const cmeIdEl = document.querySelector("#cme-id");
   const cmeLatitudeEl = document.querySelector("#cme-latitude");
   const cmeLongitudeEl = document.querySelector("#cme-longitude");
   const cmeAngleEl = document.querySelector("#cme-angle");
   const cmeSpeedEl = document.querySelector("#cme-speed");
   const cmeTypeEl = document.querySelector("#cme-type");
   const cmeNoteEl = document.querySelector("#cme-note");

   // console.log(CME);
   for (let i = 0; i < CME.length; i++) {
      cmeIdEl.textContent = CME[i].activityID;
      cmeLatitudeEl.textContent = CME[i].cmeAnalyses[0].latitude;
      cmeLongitudeEl.textContent = CME[i].cmeAnalyses[0].longitude;
      cmeAngleEl.textContent = CME[i].cmeAnalyses[0].halfAngle;
      cmeSpeedEl.textContent = CME[i].cmeAnalyses[0].speed;
      cmeTypeEl.textContent = CME[i].cmeAnalyses[0].type;
      cmeNoteEl.textContent = CME[i].note;
   }
};

const displaySolarFlares = function (FLR) {
   const flrIdEl = document.querySelector("#flr-id");
   const flrBeginTimeEl = document.querySelector("#flr-begin");
   const flrPeakTimeEl = document.querySelector("#flr-peak");
   const flrEndTimeEl = document.querySelector("#flr-end");
   const flrLocationEl = document.querySelector("#flr-location");
   const flrClassEl = document.querySelector("#flr-class");

   // console.log(FLR);
   for (let i = 0; i < FLR.length; i++) {
      flrIdEl.textContent = FLR[i].flrID;
      flrBeginTimeEl.textContent = FLR[i].beginTime;
      flrPeakTimeEl.textContent = FLR[i].peakTime;
      flrEndTimeEl.textContent = FLR[i].endTime;
      flrLocationEl.textContent = FLR[i].sourceLocation;
      flrClassEl.textContent = FLR[i].classType;
   }
};

// logic.api set-up
// to-do : hide real api key
const apiKey = "DEMO_KEY";
const startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
const endDate = moment().format("YYYY-MM-DD");

const getCoronalMassEjections = function() {
   const apiUrl = `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;

   // fetching the array of recent coronal mass ejections
   fetch(apiUrl).then(function(response) {
      // method formats the response as json. returns a promise. the then() method captures the actual data
      response.json().then(function(data) {
         // console.log(data);
         displayCoronalMassEjections(data)
      });
   });
};

const getSolarFlares = function() {
   const apiUrl = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;

   // fetching the array of recent solar flares
   fetch(apiUrl).then(function(response) {
      // method formats the response as json. returns a promise. the then() method captures the actual data
      response.json().then(function(data) {
         // console.log(data);
         displaySolarFlares(data);
      });
   });
};


// calls. to-do | maybe combine both calls into getSolarActivity() that takes in different parameters (CME, FLR) to streamline the functions bc they're awfully similar atm
copyrightYear();
currentDate();
getCoronalMassEjections();
getSolarFlares();

