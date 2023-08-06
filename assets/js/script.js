import "../css/styles.css";
const { luminosity, pluralization, fluctuate } = require("./helper");
const {
  calculateDuration,
  formatDateTime,
  formatDay,
  formatNow,
  formatTime,
  forecast,
  ...time
} = require("./time");

// let variables used to maintain seperation of concerns between js & jquery functions
let cmeData;
let flrData;
let stats = {
  kelvin: fluctuate(5772),
  spectral: "G2V",
  metallicity: "Z = 0.0122",
  luminosity: "L⊙ = 4πkI⊙A2",
};

// javascript functions handle data before the dom
console.log(`
   \u00A9 ${time.year} Edwin M. Escobar
   https://github.com/escowin/sun-tracker
   `);

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
  stats.orbit = orbit;
  stats.au = orbit / 149597870.7;
}

// sets units by checked radio value
function displayUnits(unit) {
  const { kelvin } = stats;
  let temp = kelvin;
  let distance;

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
      stats.distance = `${distance.toLocaleString("en-US")} lm`;
      stats.temp = `${temp} K`;
      break;
    default:
      console.log("default case");
  }
}

// returns API data through promises
async function apiCalls() {
  // variables used to dynamically create URL for fetch requests
  const api = {
    base: "https://api.nasa.gov/DONKI/",
    key: "UJO2NYWIRwCuDl6l431qKvjZviS8TPLUatA1E0xd",
    endpoints: ["CME", "FLR"],
    start: time.apiStart,
    end: time.apiEnd,
    path: function (param) {
      return `${this.base}${param}?startDate=${this.start}&endDate=${this.end}&api_key=${this.key}`;
    },
  };

  try {
    // creates an array of promises by mapping endpoints as fetch arguments
    const promises = api.endpoints.map((endpoint) =>
      getSunActivity(api.path(endpoint), endpoint)
    );
    // awaits to resolve promises. results assigned to corresponding variables
    const [cmeResult, flrResult] = await Promise.all(promises);
    cmeData = cmeResult;
    flrData = flrResult;

    // retrieved data is handled in jquery function for dom manipulation
    displayData(cmeData, flrData);
  } catch (err) {
    console.error(err);
  }
}

// makes fetch requests to NASA API for specified endpoints
function getSunActivity(url, endpoint) {
  // selects appropriate fetch & data handling functions
  switch (endpoint) {
    case "CME":
      return fetch(url).then((res) => res.json().then((data) => getCME(data)));
    case "FLR":
      return fetch(url).then((res) => res.json().then((data) => getFLR(data)));
    default:
      return Promise.reject("failed fetch request");
  }
}

async function getCME(CME) {
  // selects last object in CME array to get the most recent data
  const latestCME = CME[CME.length - 1];
  // retrieves relevant variables through object destructuring
  const { startTime, note, cmeAnalyses } = latestCME;
  const { latitude, longitude, halfAngle, speed, type } = cmeAnalyses[0];
  // CME object is
  cmeData = {
    startTime: startTime,
    note: note,
    latitude: longitude,
    longitude: latitude,
    halfAngle: halfAngle,
    speed: speed,
    type: type,
  };

  return cmeData;
}

async function getFLR(FLR) {
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

  return flrData;
}

// jquery function manipulates DOM elements
function displayData(CME, FLR) {
  $(() => {
    // appends 5 forecast elements to forecast container
    // goal: unqiue temp for each day
    for (let i = 0; i < 5; i++) {
      $("#forecast-container").append(`<article class="day">
      <p>${forecast(i)}</p>
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
    if (cmeData) {
      $("#cme-time").text(formatDay(CME.startTime));
      $("#cme-latitude").text(`${CME.latitude}\u00B0`);
      $("#cme-longitude").text(`${CME.longitude}\u00B0`);
      $("#cme-angle").text(`${CME.halfAngle}\u00B0`);
      $("#cme-speed").text(CME.speed);
      $("#cme-type").text(CME.type);
      $("#cme-note").text(CME.note);
    }

    // recent solar flare
    if (flrData) {
      $("#flr-date").text(
        `${formatDay(FLR.beginTime)} - ${formatTime(FLR.endTime)}`
      );
      $("#flr-peak").text(formatTime(FLR.peakTime));
      $("#flr-duration").text(pluralization(FLR.duration, "minute"));
      $("#flr-region").text(FLR.activeRegionNum);
      $("#flr-location").text(FLR.sourceLocation);
      $("#flr-class").text(FLR.classType);
    }
  });
}

// calls
currentDistance();
apiCalls();
