const {
  formatDay,
  formatHr,
  forecast,
  forecastLong,
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
    this._activeActivityType = null;
  }

  async displayData() {
    $(async () => {
      // appends each generated forecast list element to parent ul container
      for (let i = 0; i < 5; i++) {
        const forecastTemp = sun.calcTemp(sun.temp.current);
        // use forecast for mobile dipslay, forecastLong for desktop
        $("#forecast-container").append(`<li class="day flex" id="day-${i}">
          <p class="label"><span class="mobile">${forecast(i + 1)}</span><span class="desktop">${forecastLong(i + 1)}</span></p>
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
      await this.initActivityView();

      // event listeners (delegation ensures clicks are captured)
      $("#api-selection").on("click", "button", (e) => this.handleClick(e));
      $("#units input").on("click", (e) => this.handleUnits(e));
    });
  }

  async initActivityView() {
    await this.openDatabase();

    window.addEventListener(Memory.EVENT_DATA_UPDATED, (e) => {
      const { storeName } = e.detail || {};
      if (this._activeActivityType && storeName === this._activeActivityType) {
        this.renderActivityList(storeName);
      }
    });

    const types = ["cme", "flr"];
    const index = Math.floor(Math.random() * types.length);
    await this.renderActivityList(types[index]);
    this.setActiveButton(types[index]);
  }

  async handleClick(e) {
    const type = $(e.currentTarget).attr("data-type");
    if (type === "cme" || type === "flr") {
      this._activeActivityType = type;
      await this.renderActivityList(type);
      this.setActiveButton(type);
    }
  }

  setActiveButton(type) {
    $("#api-selection button").removeClass("active-btn");
    $(`#api-selection button[data-type="${type}"]`).addClass("active-btn");
  }

  async renderActivityList(type) {
    const $container = $("#activity-list");
    if (!$container.length) return;

    this._activeActivityType = type;
    const array = await this.getStore(type);
    $container.empty();

    if (type === "cme") {
      $container.attr("aria-label", "Coronal mass ejections list");
      array.forEach((cme) => {
        $container.append(`<li class="item cme grid">
          <h3 class="subheader">${formatDay(cme.startTime)}</h3>
          <p class="label">latitude</p>
          <p>${cme.latitude ?? "—"}\u00B0</p>
          <p class="label">longitude</p>
          <p>${cme.longitude ?? "—"}\u00B0</p>
          <p class="label">half angle</p>
          <p>${cme.halfAngle ?? "—"}θ</p>
          <p class="label">speed</p>
          <p class="speed">${cme.speed ?? "—"} km/s</p>
          <p class="label">type</p>
          <p>${cme.type ?? "—"}</p>
          <details class="cme-note" name="cme-note" aria-label="Coronal mass ejection note">
            <summary class="label">cme note</summary>
            <p>${cme.note ?? ""}</p>
          </details>
        </li>`);
      });
    } else if (type === "flr") {
      $container.attr("aria-label", "Solar flares list");
      array.forEach((flr) => {
        const durationText = flr.duration != null ? pluralization(flr.duration, "minute") : "—";
        $container.append(`<li class="item grid flr">
          <h3 class="subheader">${formatDay(flr.beginTime)} - ${formatHr(flr.endTime)}</h3>
          <p class="label">peak</p>
          <p>${formatHr(flr.peakTime)}</p>
          <p class="label">duration</p>
          <p>${durationText}</p>
          <p class="label">active region</p>
          <p>${flr.activeRegionNum ?? "—"}</p>
          <p class="label">location</p>
          <p>${flr.sourceLocation ?? "—"}</p>
          <p class="label">class</p>
          <p>${flr.classType ?? "—"}</p>
        </li>`);
      });
    }
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
    }, 1000);
  }

  async displayTime() {
    setInterval(() => {
      $("#current-date").text(now());
    }, 1000);
  }

}

module.exports = Display;
