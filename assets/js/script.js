import "../css/styles.css";
const { formatDateTime, calculateDuration, ...formattedTime} = require("./time");
console.log(formattedTime)

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
  const perihelion = dayjs
    .utc("2022-01-04 06:55:00")
    .format("YYYY-MM-DD HH:mm:ss");
  const now = dayjs.utc().format("YYYY-MM-DD HH:mm:ss");

  // days since perihelion
  const start = dayjs(perihelion);
  const end = dayjs(now);
  const totalDays = end.diff(start, "day");
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

// logic.display current date
function currentDate() {
  const { now, year } = formattedTime;
  const currentDateEl = document.querySelector("#current-date");
  const copyrightYearEl = document.querySelector("#copyright-year");

  currentDateEl.textContent = now;
  copyrightYearEl.textContent = year;
  console.log(`
   \u00A9 ${year} Edwin M. Escobar
   https://github.com/escowin/sun-tracker
   `);
}

// logic.api set-up
// to-do : hide real api key
function apiCalls() {
  const apiKey = "UJO2NYWIRwCuDl6l431qKvjZviS8TPLUatA1E0xd";
  const { apiStart, apiEnd } = formattedTime;
  const sunActivity = ["CME", "FLR"];

  sunActivity.forEach((activity) => {
    getSunActivity(activity, apiKey, apiStart, apiEnd);
  });
}

// makes fetch requests to NASA API to get data
function getSunActivity(type, key, start, end) {
  const apiUrl = `https://api.nasa.gov/DONKI/${type}?startDate=${start}&endDate=${end}&api_key=${key}`;

  // fetch request response is formmated as a JSON object that is then passed as an argument depending on activity
  fetch(apiUrl).then((res) => {
    if (apiUrl.includes("CME")) {
      res.json().then((data) => displayCoronalMassEjections(data));
    }
    if (apiUrl.includes("FLR")) {
      res.json().then((data) => displaySolarFlares(data));
    }
  });
}

function displayCoronalMassEjections(CME) {
  // selects last object in CME array to get the most recent data
  const latestCME = CME[CME.length - 1];
  console.log(latestCME);
  // retrieves relevant variables through object destructuring
  const { startTime, note, sourceLocation, cmeAnalyses } = latestCME;
  const { latitude, longitude, halfAngle, speed, type } = cmeAnalyses[0];

  const temp = formatDateTime(startTime)
  console.log(temp)
}

function displaySolarFlares(FLR) {
  // get latest solar flare data
  const latestFLR = FLR[FLR.length - 1];
  console.log(latestFLR);
  // retrieves relevant variables through object destructuring
  const { beginTime, peakTime, endTime, activeRegionNum, sourceLocation, classType } = latestFLR;
}

// calls
currentDate();
// forecast();
currentDistance();
apiCalls();
