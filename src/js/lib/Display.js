const {
  formatDay,
  formatTime,
  forecast,
  now,
  year,
  formatUTC,
} = require("../utils/time");
const { convertUnit, pluralization } = require("../utils/helper");
const Memory = require("./Memory");
const Sun = require("./Sun");
const sun = new Sun();

// display class handles dom manipulation through jquery methods
class Display extends Memory {
  constructor() {
    super();
    this.displayData();
  }

  displayData() {
    $(() => {
      // appends each generated forecast list element to parent ul container
      for (let i = 0; i < 5; i++) {
        const forecastTemp = sun.calculateTemp(sun.temp.current);
        $("#forecast-container").append(`<li class="day flex" id="day-${i}">
          <p class="label">${forecast(i + 1)}</p>
          <p class="temp forecast" data-type="temp" data-forecast=${
            forecastTemp.current
          }>${forecastTemp.current} K</p>
        </li>`);
      }

      // time
      $("#copyright-year").text(year);
      this.displayTime();

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
        const temp = $(".temp").data("type");
        const distance = $("#distance").data("type");

        // set & capture data-type
        $("#distance").text(convertUnit(sun.distance, unit, distance));
        $("#temp-now").text(convertUnit(sun.temp.current, unit, temp));
        $("#temp-high").text(convertUnit(sun.temp.high, unit, temp));
        $("#temp-low").text(convertUnit(sun.temp.low, unit, temp));
        // uses the unique data-forecast value of each forecast element 
        $(".forecast").each(function() {
          const forecastValue = $(this).data("forecast");
          $(this).text(convertUnit(forecastValue, unit, temp));
        });
      });
      $("#lm").text(
        `${sun.lightMinutes.toLocaleString("en-US")} light minutes`
      );
      this.updateDistance();

      // api data
      this.displayCME();
      this.displayFLR();
    });
  }

  updateDistance() {
    setInterval(() => {
      const time = formatUTC(new Date());
      const dist = sun.currentDistance(time);
      $("#lm").text(
        `${sun
          .calculateLightMinutes(dist)
          .toLocaleString("en-US")} light minutes`
      );

      if ($("#celsius").is(":checked")) {
        console.log(convertUnit(dist, "metric", "dist"))
      } else if ($("#fahrenheit").is(":checked")) {
        console.log(convertUnit(dist, "imperial", "dist"))
      } else {
        console.log(convertUnit(dist, "si", "dist"))
      }
    }, 5000);
  }

  displayTime() {
    setInterval(() => {
      $("#current-date").text(now());
    }, 1000);
  }

  async displayCME() {
    // empty fetch array triggers idb store retrieval, ensuring offline display
    let array;
    await (async () => {
      const arr = await this.CME;
      arr.length === 0 ? (array = await this.getStore("cme")) : (array = arr);
    })();

    array.forEach((cme) => {
      $("#cme-list").append(`<li class="item cme grid">
        <h3 class="label">${formatDay(cme.startTime)}</h3>
        <p class="label">latitude</p>
        <p>${cme.latitude}\u00B0</p>

        <p class="label">longitude</p>
        <p>${cme.longitude}\u00B0</p>

        <p class="label">half angle</p>
        <p>${cme.halfAngle}θ</p>

        <p class="label">speed</p>
        <p class="speed">${cme.speed} km/s</p>

        <p class="label">type</p>
        <p>${cme.type}</p>

        <details class="cme-note">
          <summary class="label">cme note</summary>
          <p>${cme.note}</p>
        </details>
      </li>`);
    });
  }

  async displayFLR() {
    let array;
    await (async () => {
      const arr = await this.FLR;
      arr.length === 0 ? (array = await this.getStore("flr")) : (array = arr);
    })();

    array.forEach((flr) => {
      $("#flr-list").append(`<li class="item grid flr">
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
}

module.exports = Display;
