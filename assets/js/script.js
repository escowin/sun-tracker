import "../css/styles.css";
const { formatDateTime, calculateDuration, ...time } = require("./time");

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
  console.log(`
   \u00A9 ${time.year} Edwin M. Escobar
   https://github.com/escowin/sun-tracker
   `);
}

// variables used to dynamically create URL for fetch requests
function apiCalls() {
  const URL = "https://api.nasa.gov/DONKI";
  const key = "UJO2NYWIRwCuDl6l431qKvjZviS8TPLUatA1E0xd";
  const { apiStart, apiEnd } = time;
  const sunActivity = ["CME", "FLR"];

  sunActivity.forEach((activity) =>
    getSunActivity(
      `${URL}/${activity}?startDate=${apiStart}&endDate=${apiEnd}&api_key=${key}`
    )
  );
}

// makes fetch requests to NASA API to get data,
function getSunActivity(apiUrl) {
  fetch(apiUrl).then((res) => {
    // formats response as a JSON object. URL composition determines function call
    res.json().then((data) => {
      if (apiUrl.includes("CME")) {
        displayCoronalMassEjections(data);
      } else if (apiUrl.includes("FLR")) {
        displaySolarFlares(data);
      } else {
        console.log("failed fetch request")
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
  const object = {
    startTime,
    note,
    latitude,
    longitude,
    halfAngle,
    speed,
    type,
  };
  console.log(object);
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
}

// jquery functions execute once dom is fully loaded
$(() => {
  $("#copyright-year").text(time.year);
  $("#current-date").text(time.currentDate);

  $(".temp").text("jQuery test");
});

// calls
currentDate();
// forecast();
currentDistance();
apiCalls();
