const {
  formatDay,
  formatHr,
  forecast,
  now,
  year,
  formatUTC,
} = require("../utils/time");
const { convertUnit, pluralization } = require("../utils/helper");
const Memory = require("./Memory");
const Sun = require("./Sun");
const sun = new Sun();

// mock data
const { mockCME, mockFLR } = require("../mock/data");

// display class handles dom manipulation through jquery methods
class Display extends Memory {
  constructor() {
    super();
  }

  async displayData() {
    $(() => {
      // appends each generated forecast list element to parent ul container
      for (let i = 0; i < 5; i++) {
        const forecastTemp = sun.calcTemp(sun.temp.current);
        $("#forecast-container").append(`<li class="day flex" id="day-${i}">
          <p class="label">${forecast(i + 1)}</p>
          <p class="temp forecast" data-type="temp" data-forecast=${
            forecastTemp.current
          }>${forecastTemp.current} K</p>
        </li>`);
      }

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
      $("#lm").text(
        `${sun.lightMinutes.toLocaleString("en-US")} light minutes`
      );

      // time
      $("#copyright-year").text(year);

      // method calls
      this.updateDistance();
      this.displayTime();
      this.displayCME();
      this.displayFLR();
      this.displaySelected();

      // event listeners
      $("#api-selection button").on("click", (e) => this.handleClick(e));
      $("#units input").on("click", (e) => this.handleUnits(e));
    });
  }

  async handleClick(e) {
    const targetList = $(e.target).data("target");
    const activeBtn = $(e.target)
    this.displaySelected(targetList, activeBtn);
  }

  async displaySelected(targetList) {
    let selected;

    if (targetList) {
      selected = targetList;
    } else {
      // randomly determine which activity list is displayed;
      const lists = $("#activity ul");
      selected = lists[Math.floor(Math.random() * lists.length)];
    }

    // Show the target list and hide the other one
    $(selected).css("display", "flex");
    $("#activity ul").not(selected).css("display", "none");
  }

  async handleUnits(e) {
    const unit = e.target.value;
    const temp = $(".temp").data("type");
    const distance = $("#distance").data("type");

    // set & capture data-type
    $("#distance").text(convertUnit(sun.distance, unit, distance));
    $("#temp-now").text(convertUnit(sun.temp.current, unit, temp));
    $("#temp-high").text(convertUnit(sun.temp.high, unit, temp));
    $("#temp-low").text(convertUnit(sun.temp.low, unit, temp));
    // uses the unique data-forecast value of each forecast element
    $(".forecast").each(function () {
      const forecastValue = $(this).data("forecast");
      $(this).text(convertUnit(forecastValue, unit, temp));
    });
  }

  async updateDistance() {
    setInterval(() => {
      const time = formatUTC(new Date());
      const dist = sun.calcDistance(time);
      $("#lm").text(
        `${sun.calcLightMinutes(dist).toLocaleString("en-US")} light minutes`
      );

      if ($("#celsius").is(":checked")) {
        $("#distance").text(convertUnit(dist, "metric", "dist"));
      } else if ($("#fahrenheit").is(":checked")) {
        $("#distance").text(convertUnit(dist, "imperial", "dist"));
      } else {
        $("#distance").text(convertUnit(dist, "si", "dist"));
      }
    }, 2000);
  }

  async displayTime() {
    setInterval(() => {
      $("#current-date").text(now());
    }, 1000);
  }

  async displayCME() {
    // empty fetch array triggers idb store retrieval, ensuring offline display

    // production data
    // let array;
    // await (async () => {
    //   const arr = await this.CME;
    //   arr.length === 0 ? (array = await this.getStore("cme")) : (array = arr);
    // })();

    const array = mockCME;

    array.forEach((cme) => {
      $("#cme-list").append(`<li class="item cme grid">
        <h3 class="subheader">${formatDay(cme.startTime)}</h3>
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
    // production data
    // let array;
    // await (async () => {
    //   const arr = await this.FLR;
    //   arr.length === 0 ? (array = await this.getStore("flr")) : (array = arr);
    // })();

    // mock data
    const array = mockFLR;

    array.forEach((flr) => {
      $("#flr-list").append(`<li class="item grid flr">
        <h3 class="subheader">${formatDay(flr.beginTime)} - ${formatHr(
        flr.endTime
      )}</h3>
        <p class="label">peak</p>
        <p>${formatHr(flr.peakTime)}</p>
  
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
