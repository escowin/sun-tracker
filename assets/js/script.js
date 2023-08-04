import "../css/styles.css";
const { formatDateTime, calculateDuration, ...time } = require("./time");
const { mockFLR, mockCME } = require("./mock-data");

// let variables used to maintain seperation of concerns between js & jquery functions
let cmeData;
let flrData;
let stats = {
  temp: 5772,
  distance,
  au,
  spectral: "G2V",
  metallicity: "Z = 0.0122",
};

// javascript functions handles data before the dom
function currentDate() {
  console.log(`
   \u00A9 ${time.year} Edwin M. Escobar
   https://github.com/escowin/sun-tracker
   `);
}

function currentDistance() {
  const totalDays = calculateDuration(time.perihelion, time.now, "day");
  // time, semi-major axis, eccentricity
  const t = (totalDays * 365.25) / 360;
  const a = 149600000;
  const e = 0.017;

  // earth-sun distance equation
  const orbit = (a * (1 - e * e)) / (1 + e * Math.cos(t));
  stats.distance = orbit;
  stats.au = orbit / 149597870.7
}

// sets units by checked radio value
function displayUnits(unit) {
  if (unit === "metric") {
    stats.temp = Math.round(stats.temp - 273.15);
    stats.distance;
  }
  // convert to relevant units of length
  // const lm = stats.distance / 17987547.48;
  // const km = stats.distance;
  // const mi = stats.distance / 1.609344;
}

// variables used to dynamically create URL for fetch requests
function apiCalls() {
  const URL = "https://api.nasa.gov/DONKI";
  const key = "UJO2NYWIRwCuDl6l431qKvjZviS8TPLUatA1E0xd";
  const { apiStart, apiEnd } = time;
  const sunActivity = ["CME", "FLR"];

  // DEVELOPMENT CODE
  displayCoronalMassEjections(mockCME);
  displaySolarFlares(mockFLR);

  //  PRODUCTION CODE
  // sunActivity.forEach((activity) =>
  //   getSunActivity(
  //     `${URL}/${activity}?startDate=${apiStart}&endDate=${apiEnd}&api_key=${key}`
  //   )
  // );
}

// makes fetch requests to NASA API to get data,
function getSunActivity(apiUrl) {
  fetch(apiUrl).then((res) => {
    // formats response as a JSON object
    res.json().then((data) => {
      // URL composition determines function call
      if (apiUrl.includes("CME")) {
        displayCoronalMassEjections(data);
      } else if (apiUrl.includes("FLR")) {
        displaySolarFlares(data);
      } else {
        console.log("failed fetch request");
      }
    });
  });
}

function displayCoronalMassEjections(CME) {
  // selects last object in CME array to get the most recent data
  const latestCME = CME[CME.length - 1];
  // retrieves relevant variables through object destructuring
  const { startTime, note, cmeAnalyses } = latestCME;
  const { latitude, longitude, halfAngle, speed, type } = cmeAnalyses[0];
  // CME object is
  cmeData = {
    startTime,
    note,
    latitude,
    longitude,
    halfAngle,
    speed,
    type,
  };
}

function displaySolarFlares(FLR) {
  // get latest solar flare data
  const latestFLR = FLR[FLR.length - 1];
  // retrieves relevant variables through object destructuring
  const {
    beginTime,
    peakTime,
    endTime,
    activeRegionNum,
    sourceLocation,
    classType,
  } = latestFLR;

  // console.log(FLR);
}

// jquery functions manipulate DOM elements
$(() => {
  // time
  $("#copyright-year").text(time.year);
  $("#current-date").text(time.currentDate);
  // use event listener to tie radio
  displayUnits("metric");
  $(".temp").text(stats.temp);
  $("#spectral").text(stats.spectral);
  $("#metallicity").text(stats.metallicity);
  $("#distance").text(stats.distance.toLocaleString("en-US"));
  $("#au").text(`${stats.au.toLocaleString("en-US")} au`);

  console.log(cmeData);
});

// calls
currentDate();
currentDistance();
// calculateStats();
apiCalls();
