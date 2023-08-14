const { formatDay, formatTime, forecast, now, year } = require("./time");
const { convertUnit, pluralization } = require("./helper");
const Sun = require("./Sun");

const sun = new Sun();

// jquery methods manipulate dom elements to display parameter data
function currentTime() {
  setInterval(() => {
    $("#current-date").text(now());
  }, 1000);
}

function displayData(CME, FLR) {
  $(() => {
    // appends each generated forecast list element to  parent ul container
    // goal: unqiue temp for each day
    for (let i = 0; i < 5; i++) {
      const forecastTemp = sun.calculateTemp(sun.temp.current);

      $("#forecast-container").append(`<li class="day" id="day-${i}">
        <p class="label">${forecast(i + 1)}</p>
        <p class="temp" data-type="temp">${forecastTemp.current} K</p>
      </li>`);
    }

    // time
    $("#copyright-year").text(year);
    currentTime();

    // DOM loads with SI units selected and displayed
    $("#kelvin").prop("checked", true);

    // temp
    $("#temp-now").text(`${sun.temp.current} K`);
    $("#temp-high").text(`${sun.temp.high} K`);
    $("#temp-low").text(`${sun.temp.low} K`);

    // stats
    $("#spectral").text(sun.spectral);
    $("#luminosity").append(`${sun.luminosity} yw`);
    $("#metallicity").text(sun.metallicity);
    $("#distance").text(`${sun.distance.toLocaleString("en-US")} au`);

    // use event listener to tie radio
    $("#units input").on("click", (e) => {
      const unit = e.target.value;

      // set & capture data-type
      $(".temp").text(convertUnit(sun.temp.current, unit, tempData));
      $("#temp-high").text(convertUnit(sun.temp.high, unit, tempData));
      $("#temp-low").text(convertUnit(sun.temp.low, unit, tempData));
      $("#distance").text(convertUnit(sun.distance, unit, distData));
    });
    $("#lm").text(`${sun.lightMinutes.toLocaleString("en-US")} light minutes`);

    // api data
    if (CME) {
      displayCME(CME);
    }

    if (FLR) {
      displayFLR(FLR);
    }
  });
}

function displayCME(array) {
  array.forEach((cme) => {
    $("#cme-list").append(`<li class="item cme">
      <h3 class="label">${formatDay(cme.startTime)}</h3>
      <div>
        <p class="label">latitude</p>
        <p>${cme.latitude}\u00B0</p>

        <p class="label">longitude</p>
        <p>${cme.longitude}\u00B0</p>

        <p class="label">half &angle;</p>
        <p>${cme.halfAngle}\u00B0</p>

        <p class="label">speed</p>
        <p>${cme.speed}</p>

        <p class="label">type</p>
        <p>${cme.type}</p>
      </div>
        
      <details class="cme-note">
        <summary class="label">cme note</summary>
        <p>${cme.note}</p>
      </details>
    </li>`);
  });
}

function displayFLR(array) {
  array.forEach((flr) => {
    $("#flr-list").append(`<li class="item flr">
      <h3 class="label">${formatDay(flr.beginTime)} - ${formatTime(
      flr.endTime
    )}</h3>
      <p class="label">peak</p>
      <p>${formatTime(flr.peakTime)}</p>

      <p class="label">duration</p>
      <p>${pluralization(flr.duration, "minute")}</p>

      <p class="label">active region</p>
      <p>${flr.activeRegionNum}</p>

      <p class="label">location</p>
      <p>${flr.sourceLocation}</p>

      <p class="label">class</p>
      <p>${flr.classType}</p>
    </li>`);
  });
}

module.exports = { displayData };
