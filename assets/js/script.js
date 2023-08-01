// data.dom
const selectUnits = document.querySelector("#temp-units");
const kelvinRadio = document.querySelector("#kelvin");
const fahrenheitRadio = document.querySelector("#fahrenheit");
const celsiusRadio = document.querySelector("#celsius");

// logic.display selected units
const displayUnits = function (au, lm, km, mi) {
  const temp = 5772;
  kelvinRadio.checked = true;

  $("#temp").text(`${temp} K`);
  $("#light-minute").text(`${lm.toLocaleString("en-US")} light minutes`);
  $("#distance").text(`${au.toLocaleString("en-US")} au`);

  // selecting radio button changes displayed units
  selectUnits.addEventListener("click", function () {
    if (kelvinRadio.checked) {
      $(".temp").text(`${temp} K`);
      $("#distance").text(`${au.toLocaleString("en-US")} au`);
    } else if (celsiusRadio.checked) {
      const celsius = Math.round(temp - 273.15);
      $(".temp").text(`${celsius} °C`);
      $("#distance").text(`${km.toLocaleString("en-US")} km`);
    } else if (fahrenheitRadio.checked) {
      const fahrenheit = Math.round(temp * 1.8 - 459.67);
      $(".temp").text(`${fahrenheit} °F`);
      $("#distance").text(`${mi.toLocaleString("en-US")} mi`);
    }
  });
};

// logic.calculating the distance of the earth from the sun
const currentDistance = function () {
  const perihelion = moment
    .utc("2022-01-04 06:55:00")
    .format("YYYY-MM-DD HH:mm:ss");
  const now = moment.utc().format("YYYY-MM-DD HH:mm:ss");

  // days since perihelion
  const start = new moment(perihelion);
  const end = new moment(now);
  const totalDays = moment.duration(end.diff(start)).as("days");
  const time = (totalDays * 365.25) / 360;

  // semi-major axis & eccentricity
  const a = 149600000;
  const e = 0.017;

  // earth-sun distance equation
  const orbit = (a * (1 - e * e)) / (1 + e * Math.cos(time));

  // convert to relevant units of length
  const au = orbit / 149597870.7;
  const lm = orbit / 17987547.48;
  const km = orbit;
  const mi = orbit / 1.609344;

  displayUnits(au, lm, km, mi);
};

// logic.display copyright year
const copyrightYear = function () {
  let year = new Date().getFullYear();
  const copyrightYearEl = document.querySelector("#copyright-year");
  copyrightYearEl.textContent = year;
};

// logic.display current date
const currentDate = function () {
  let date = moment().format("MMMM Do");
  const currentDateEl = document.querySelector("#current-date");
  currentDateEl.textContent = date;
  console.log(`
   \u00A9 2022 Edwin M. Escobar
   https://github.com/escowin/solar-weather-app
   `);
};

// logic.display days of the week
const forecast = function () {
  const day2El = document.querySelector("#day-2");
  const day3El = document.querySelector("#day-3");
  const day4El = document.querySelector("#day-4");
  const day5El = document.querySelector("#day-5");

  const tomorrow = moment().add(1, "days");
  day2El.textContent = tomorrow.format("dddd");

  const day3 = moment().add(2, "days");
  day3El.textContent = day3.format("dddd");

  const day4 = moment().add(3, "days");
  day4El.textContent = day4.format("dddd");

  const day5 = moment().add(4, "days");
  day5El.textContent = day5.format("dddd");
};

// logic.display api data
const displayCoronalMassEjections = function (CME) {
  const cmeTimeEl = document.querySelector("#cme-time");
  const cmeLatitudeEl = document.querySelector("#cme-latitude");
  const cmeLongitudeEl = document.querySelector("#cme-longitude");
  const cmeAngleEl = document.querySelector("#cme-angle");
  const cmeSpeedEl = document.querySelector("#cme-speed");
  const cmeTypeEl = document.querySelector("#cme-type");
  const cmeNoteEl = document.querySelector("#cme-note");

  // get latest coronal mass ejection data
  latestCME = CME[CME.length - 1];

  // reformat time
  const startTime = moment(latestCME.startTime).format("dddd, MMMM Do h:mm a");

  // display data
  cmeTimeEl.textContent = startTime;
  cmeLatitudeEl.textContent = `${latestCME.cmeAnalyses[0].latitude}°`;
  cmeLongitudeEl.textContent = `${latestCME.cmeAnalyses[0].longitude}°`;
  cmeAngleEl.textContent = `${latestCME.cmeAnalyses[0].halfAngle}°`;
  cmeSpeedEl.textContent = `${latestCME.cmeAnalyses[0].speed} kph`;
  cmeTypeEl.textContent = latestCME.cmeAnalyses[0].type;
  cmeNoteEl.textContent = latestCME.note;
};

const displaySolarFlares = function (FLR) {
  const flrDateEl = document.querySelector("#flr-date");
  const flrDurationEl = document.querySelector("#flr-duration");
  const flrRegionEl = document.querySelector("#flr-region");
  const flrBeginTimeEl = document.querySelector("#flr-begin");
  const flrPeakTimeEl = document.querySelector("#flr-peak");
  const flrEndTimeEl = document.querySelector("#flr-end");
  const flrLocationEl = document.querySelector("#flr-location");
  const flrClassEl = document.querySelector("#flr-class");

  // get latest solar flare data
  const latestFLR = FLR[FLR.length - 1];

  // reformat time
  const flrDate = moment(latestFLR.beginTime).format("dddd, MMMM Do");
  const beginTime = moment(latestFLR.beginTime).format("hh:mm a");
  const peakTime = moment(latestFLR.peakTime).format("hh:mm a");
  const endTime = moment(latestFLR.endTime).format("hh:mm a");

  // calculating the solar flare duration
  const start = new moment(latestFLR.beginTime);
  const end = new moment(latestFLR.endTime);
  const duration = moment.duration(end.diff(start)).as("minutes");

  flrDateEl.textContent = flrDate;
  flrDurationEl.textContent = `${duration} minutes`;
  flrRegionEl.textContent = latestFLR.activeRegionNum;
  flrBeginTimeEl.textContent = beginTime;
  flrPeakTimeEl.textContent = peakTime;
  flrEndTimeEl.textContent = endTime;
  flrLocationEl.textContent = latestFLR.sourceLocation;
  flrClassEl.textContent = latestFLR.classType;
};

// logic.api set-up
// to-do : hide real api key
const apiKey = "DEMO_KEY";
const startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
const endDate = moment().format("YYYY-MM-DD");

const getCoronalMassEjections = function () {
  const apiUrl = `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;

  // fetching the array of recent coronal mass ejections
  fetch(apiUrl).then(function (response) {
    // method formats the response as json. returns a promise. the then() method captures the actual data
    response.json().then(function (data) {
      displayCoronalMassEjections(data);
    });
  });
};

const getSolarFlares = function () {
  const apiUrl = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;

  // fetching the array of recent solar flares
  fetch(apiUrl).then(function (response) {
    // method formats the response as json. returns a promise. the then() method captures the actual data
    response.json().then(function (data) {
      displaySolarFlares(data);
    });
  });
};

// calls
copyrightYear();
currentDate();
forecast();
currentDistance();
getCoronalMassEjections();
getSolarFlares();
