// import "../css/styles.css";
const { displayData } = require("./displayData");
const { duration, apiStart, apiEnd, year } = require("./time");
const { mockCME, mockFLR } = require("./mockData")

// javascript functions handle data before the dom
console.log(`
   \u00A9 ${year} Edwin M. Escobar
   https://github.com/escowin/sun-tracker
   `);

// returns API data through promises
async function apiCalls() {
  // variables used to dynamically create URL for fetch requests
  const api = {
    base: "https://api.nasa.gov/DONKI/",
    key: "UJO2NYWIRwCuDl6l431qKvjZviS8TPLUatA1E0xd",
    endpoints: ["CME", "FLR"],
    start: apiStart,
    end: apiEnd,
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
    const [cmeData, flrData] = await Promise.all(promises);

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
  const cmeObj = {
    startTime: startTime,
    note: note,
    latitude: latitude,
    longitude: longitude,
    halfAngle: halfAngle,
    speed: speed,
    type: type,
  };

  return cmeObj;
}

async function getFLR(FLR) {
  // get latest solar flare data
  const latestFLR = FLR[FLR.length - 1];

  const flrObj = {
    beginTime: latestFLR.beginTime,
    peakTime: latestFLR.peakTime,
    endTime: latestFLR.endTime,
    duration: duration(latestFLR.beginTime, latestFLR.endTime, "minute"),
    activeRegionNum: latestFLR.activeRegionNum,
    sourceLocation: latestFLR.sourceLocation,
    classType: latestFLR.classType,
  };

  return flrObj;
}

// calls
// apiCalls();

// DEVELOPMENT
async function development() {
  try {
    const cmeData = await getCME(mockCME)
    const flrData = await getFLR(mockFLR)

    displayData(cmeData, flrData)
  } catch (err) {
    console.error(err)
  }
}

development();

