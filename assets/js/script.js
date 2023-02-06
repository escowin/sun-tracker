// data.dom
// const selectUnits = document.querySelector("#temp-units");
// const kelvinRadio = document.querySelector("#kelvin");
// const fahrenheitRadio = document.querySelector("#fahrenheit");
// const celsiusRadio = document.querySelector("#celsius");

// api call | loops through api object's name array to get the latest CME & FLR data
function getApi() {
  const api = {
    url: "https://api.nasa.gov/DONKI",
    key: "6A1y0rvnJMsU6o8M6uarriaTvGLsCSeQbaIuLfU0",
    startDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
    donki: ["CME", "FLR"],
  };

  api.donki.forEach((name) => {
    const path = `${api.url}/${name}?startDate=${api.startDate}&endDate=${api.endDate}&api_key=${api.key}`;

    fetch(path)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`fetch error | ${res.status}`);
        }
        return res.json();
      })
      .then((donkiArr) => {
        donkiArr.reverse();
        if (path.includes("CME")) {
          displayCME(donkiArr);
        }
        if (path.includes("FLR")) {
          console.log(path);
          displayFLR("testing flr");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function displayCME(cme) {
  const cmeEl = document.getElementById('cme');
  let templateArr = []

  cme.forEach((object) => {
    const activityId = object.activityID;
    const start = object.startTime;
    const latitude = object.cmeAnalyses[0].latitude;
    const longitude = object.cmeAnalyses[0].longitude;
    const halfAngle = object.cmeAnalyses[0].halfAngle;
    const note = object.cmeAnalyses[0].note;
    const speed = object.cmeAnalyses[0].speed;
    const time = object.cmeAnalyses[0].time;
    const type = object.cmeAnalyses[0].type;

    const template = `<article class="donki-card">
      <h3>${activityId}</h3>
      <p>Type</p> <p>${type}</p>
      <p>Lat</p> <p>${latitude}</p>
      <p>Time</p> <p>${longitude}</p>
      <p>Time</p> <p>${halfAngle}</p>
      <p>Time</p> <p>${speed}</p>
      <p>Time</p> <p>${start}</p>
      <p class="span-2">${note}</p>
   </article>`;

   templateArr.push(template)
  });

 const final = templateArr.toString().replace(/,/g, " ")
 cmeEl.innerHTML = final
 console.log(cmeEl)
}

function displayFLR(flrArr) {
  console.log(flrArr);
}

function formatDate(data) {
  const splitIndex = data.indexOf("-") + 1;
  let timestamp = data.slice(0, splitIndex - 1);
  let id = data.slice(splitIndex);

  let date = new Date(timestamp);
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  let formattedDate = date.toLocaleString("en-US", options);
  console.log(formattedDate)
//   return `${formattedDate} ${id}`;
}

// non-api functions
function displayForecast() {
  let templateArr = []
  const forecastEl = document.getElementById('forecast')
  const forecast = [
    {
      day: "Today",
      high: Math.floor(Math.random() * (6000 - 5750 + 1) + 5750),
      low: Math.floor(Math.random() * (5750 - 5500 + 1) + 5500)
    },
    {
      day: moment().add(1, "days").format('ddd'),
      high: Math.floor(Math.random() * (6000 - 5750 + 1) + 5750),
      low: Math.floor(Math.random() * (5750 - 5500 + 1) + 5500)
    },
    {
      day: moment().add(2, "days").format('ddd'),
      high: Math.floor(Math.random() * (6000 - 5750 + 1) + 5750),
      low: Math.floor(Math.random() * (5750 - 5500 + 1) + 5500)
    },
    {
      day: moment().add(3, "days").format('ddd'),
      high: Math.floor(Math.random() * (6000 - 5750 + 1) + 5750),
      low: Math.floor(Math.random() * (5750 - 5500 + 1) + 5500)
    },
    {
      day: moment().add(4, "days").format('ddd'),
      high: Math.floor(Math.random() * (6000 - 5750 + 1) + 5750),
      low: Math.floor(Math.random() * (5750 - 5500 + 1) + 5500)
    },
    {
      day: moment().add(5, "days").format('ddd'),
      high: Math.floor(Math.random() * (6000 - 5750 + 1) + 5750),
      low: Math.floor(Math.random() * (5750 - 5500 + 1) + 5500)
    },
    {
      day: moment().add(6, "days").format('ddd'),
      high: Math.floor(Math.random() * (6000 - 5750 + 1) + 5750),
      low: Math.floor(Math.random() * (5750 - 5500 + 1) + 5500)
    },
  ]

  forecast.forEach(day => {
    const template = `<article class="day-forecast">
    <div class="sun"></div>
    <p class="day">${day.day}</p>
    <p class="temp">H: ${day.high}</p>
    <p class="temp">L: ${day.low}</p>
    </article>`

    templateArr.push(template)
  })

  const final = templateArr.toString().replace(/,/g, " ")
  forecastEl.innerHTML = final
}

// logic.display selected units
// function displayUnits(au, lm, km, mi) {
//    const temp = 5772;
//    kelvinRadio.checked = true;

//    // bug : distance values update in console, but display resets to showing AU distance regardless of which radio button is checked.
//    // setInterval(currentDistance, 2000);
//    // console.log(km.toLocaleString("en-US"));

//    $("#temp").text(`${temp} K`)
//    $("#light-minute").text(`${lm.toLocaleString("en-US")} light minutes`);
//    $("#distance").text(`${au.toLocaleString("en-US")} au`);

//    // selecting radio button changes displayed units
//    selectUnits.addEventListener("click", function() {
//       if (kelvinRadio.checked) {
//          $(".temp").text(`${temp} K`);
//          $("#distance").text(`${au.toLocaleString("en-US")} au`);
//       } else if (celsiusRadio.checked) {
//          const celsius = Math.round(temp - 273.15);
//          $(".temp").text(`${celsius} °C`);
//          $("#distance").text(`${km.toLocaleString("en-US")} km`);
//       } else if (fahrenheitRadio.checked) {
//          const fahrenheit = Math.round(temp * 1.8 - 459.67);
//          $(".temp").text(`${fahrenheit} °F`);
//          $("#distance").text(`${mi.toLocaleString("en-US")} mi`);
//       }
//    });
// }

// logic.calculating the distance of the earth from the sun
// function currentDistance () {
//    const perihelion = moment.utc("2022-01-04 06:55:00").format("YYYY-MM-DD HH:mm:ss");
//    const now = moment.utc().format("YYYY-MM-DD HH:mm:ss");

//    // days since perihelion
//    const start = new moment(perihelion);
//    const end = new moment(now);
//    const totalDays = moment.duration(end.diff(start)).as("days");
//    const time = totalDays*365.25/360;

//    // semi-major axis & eccentricity
//    const a = 149600000;
//    const e = .017;

//    // earth-sun distance equation
//    const orbit = a*(1-e*e)/(1+e*(Math.cos(time)));

//    // convert to relevant units of length
//    const au = orbit/149597870.7;
//    const lm = orbit/17987547.48;
//    const km = orbit;
//    const mi = orbit/1.609344;

//    displayUnits(au, lm , km, mi);
// };

// logic.display copyright year
// function copyrightYear() {
//    let year = new Date().getFullYear();
//    const copyrightYearEl = document.querySelector("#copyright-year");
//    copyrightYearEl.textContent = year;
// };

// logic.display current date
// function currentDate() {
//    let date = moment().format("MMMM Do");
//    const currentDateEl = document.querySelector("#current-date");
//    currentDateEl.textContent = date;
//    console.log(`
//    \u00A9 2022 Edwin M. Escobar
//    https://github.com/escowin/solar-weather-app
//    `);
// };

// logic.display days of the week
function forecast() {

};



// function displaySolarFlares(FLR) {
//    const flrDateEl = document.querySelector("#flr-date");
//    const flrDurationEl = document.querySelector("#flr-duration");
//    const flrRegionEl = document.querySelector("#flr-region");
//    const flrBeginTimeEl = document.querySelector("#flr-begin");
//    const flrPeakTimeEl = document.querySelector("#flr-peak");
//    const flrEndTimeEl = document.querySelector("#flr-end");
//    const flrLocationEl = document.querySelector("#flr-location");
//    const flrClassEl = document.querySelector("#flr-class");
//    console.log(`
//    \u00A9 2022 Edwin M. Escobar
//    https://github.com/escowin/solar-weather-app
//    `);

//    // get latest solar flare data
//    const latestFLR = FLR[FLR.length -1];

//    // reformat time
//    const flrDate = moment(latestFLR.beginTime).format("dddd, MMMM Do")
//    const beginTime = moment(latestFLR.beginTime).format("hh:mm a");
//    const peakTime = moment(latestFLR.peakTime).format("hh:mm a");
//    const endTime = moment(latestFLR.endTime).format("hh:mm a");

//    // calculating the solar flare duration
//    const start = new moment(latestFLR.beginTime);
//    const end = new moment(latestFLR.endTime);
//    const duration = moment.duration(end.diff(start)).as("minutes");

//    flrDateEl.textContent = flrDate;
//    flrDurationEl.textContent = `${duration} minutes`;
//    flrRegionEl.textContent = latestFLR.activeRegionNum;
//    flrBeginTimeEl.textContent = beginTime;
//    flrPeakTimeEl.textContent = peakTime;
//    flrEndTimeEl.textContent = endTime;
//    flrLocationEl.textContent = latestFLR.sourceLocation;
//    flrClassEl.textContent = latestFLR.classType;
// };

// calls
// copyrightYear();
// currentDate();
// forecast();
// currentDistance();
// getCoronalMassEjections();
// getSolarFlares();

// getApi();
displayForecast();
