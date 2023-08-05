import "../css/styles.css";
const { luminosity, pluralization, fluctuate} = require("./helper");
const {
  formatDateTime,
  formatDay,
  calculateDuration,
  formatNow,
  formatTime,
  ...time
} = require("./time");
const { mockFLR, mockCME } = require("./mock-data");

// let variables used to maintain seperation of concerns between js & jquery functions
let cmeData;
let flrData;
let stats = {
  kelvin: 5772,
  spectral: "G2V",
  metallicity: "Z = 0.0122",
  luminosity: "L⊙ = 4πkI⊙A2",
};

// javascript functions handles data before the dom
function currentDate() {
  console.log(`
   \u00A9 ${time.year} Edwin M. Escobar
   https://github.com/escowin/sun-tracker
   `);
}

function currentDistance() {
  const date = new Date();
  const now = formatNow(date);

  const totalDays = calculateDuration(time.perihelion, now, "day");
  // time, semi-major axis, eccentricity
  const t = (totalDays * 365.25) / 360;
  const a = 149600000;
  const e = 0.017;

  // earth-sun distance equation
  const orbit = (a * (1 - e * e)) / (1 + e * Math.cos(t));
  // console.log(orbit)
  stats.orbit = orbit;
  stats.au = orbit / 149597870.7;
}

// sets units by checked radio value
function displayUnits(unit) {
  const { kelvin } = stats;
  let temp = fluctuate(kelvin)
  let distance;
  // current set up will fluctuate temp each time a unit is selected

  switch (unit) {
    case "metric":
      distance = stats.orbit;
      stats.distance = `${distance.toLocaleString("en-US")} km`;
      stats.temp = `${Math.round(temp - 273.15)} \u2103`;
      break;
    case "imperial":
      distance = stats.orbit / 1.609344;
      stats.distance = `${distance.toLocaleString("en-US")} mi`;
      stats.temp = `${Math.round(temp * (9 / 5) - 459.76)} \u2109`;
      break;
    case "si":
      distance = stats.orbit / 17987547.48;
      stats.distance = `${distance.toLocaleString("en-US")} ly`;
      stats.temp = `${temp} K`;
      break;
    default:
      console.log("default case");
  }
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

  const duration = calculateDuration(
    latestFLR.beginTime,
    latestFLR.endTime,
    "minute"
  );

  flrData = {
    beginTime: latestFLR.beginTime,
    peakTime: latestFLR.peakTime,
    endTime: latestFLR.endTime,
    duration: duration,
    activeRegionNum: latestFLR.activeRegionNum,
    sourceLocation: latestFLR.sourceLocation,
    classType: latestFLR.classType,
  };
}

// jquery functions manipulate DOM elements
$(() => {
  // appends 5 forecast elements to forecast container
  for (let i = 0; i < 5; i++) {
    $("#forecast-container").append(`<article class="day">
    <p>Today</p>
    <div class="sun"></div>
    <p class="temp">${stats.temp}</p>
  </article>`);
  }

  // time
  $("#copyright-year").text(time.year);
  $("#current-date").text(time.currentDate);

  // DOM loads with SI units selected and displayed
  $("#kelvin").prop("checked", true);
  displayUnits($("#kelvin").val());
  $(".temp").text(stats.temp);
  $("#distance").text(stats.distance.toLocaleString("en-US"));

  //  sun stats
  $("#spectral").text(stats.spectral);
  $("#luminosity").append(luminosity(stats.luminosity));
  $("#metallicity").text(stats.metallicity);

  // use event listener to tie radio
  $("#temp-units input").on("click", (e) => {
    displayUnits(e.target.value);
    $(".temp").text(stats.temp.toLocaleString("en-US"));
    $("#distance").text(stats.distance.toLocaleString("en-US"));
  });
  $("#au").text(`${stats.au.toLocaleString("en-US")} au`);

  // recent coronal mass ejection
  $("#cme-time").text(formatDay(cmeData.startTime));
  $("#cme-latitude").text(`${cmeData.latitude}\u00B0`);
  $("#cme-longitude").text(`${cmeData.longitude}\u00B0`);
  $("#cme-angle").text(`${cmeData.halfAngle}\u00B0`);
  $("#cme-speed").text(cmeData.speed);
  $("#cme-type").text(cmeData.type);
  $("#cme-note").text(cmeData.note);

  // recent solar flare
  $("#flr-date").text(
    `${formatDay(flrData.beginTime)} - ${formatTime(flrData.endTime)}`
  );
  $("#flr-peak").text(formatTime(flrData.peakTime));
  $("#flr-duration").text(pluralization(flrData.duration, "minute"));
  $("#flr-region").text(flrData.activeRegionNum);
  $("#flr-location").text(flrData.sourceLocation);
  $("#flr-class").text(flrData.classType);
});

// calls
currentDate();
currentDistance();
// setInterval(currentDistance, 5000);
apiCalls();
