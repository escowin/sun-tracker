const { formatDay, formatTime, forecast, now, year } = require("./time");
const { convertUnit, pluralization } = require("./helper");
const Sun = require("./sunData")

const sun = new Sun();
console.log(sun.distance)
console.log(sun.lightMinutes)

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
      $("#forecast-container").append(`<li class="day">
        <p>${forecast(i + 1)}</p>
        <p class="temp" data-type="temp">${sun.temp.current}</p>
      </li>`);
    }

    // time
    $("#copyright-year").text(year);
    currentTime();

    // DOM loads with SI units selected and displayed
    $("#kelvin").prop("checked", true);
    // displayUnits($("#kelvin").val());

    //  sun stats
    $(".temp").text(sun.temp.current);
    $("#distance").text(`${sun.distance.toLocaleString("en-US")} au`);
    $("#spectral").text(sun.spectral);
    $("#luminosity").append(`${sun.luminosity} YW`);
    $("#metallicity").text(sun.metallicity);

    // use event listener to tie radio
    $("#units input").on("click", (e) => {
      const unit = e.target.value;
      // set & capture data-type
      $(".temp").text(convertUnit(sun.temp.current, unit, $(".temp").data("type")));
      $("#distance").text(convertUnit(sun.distance, unit, $("#distance").data("type")));
    });
    $("#lm").text(`${sun.lightMinutes.toLocaleString("en-US")} light minutes`);

    // recent coronal mass ejection
    if (CME) {
      $("#cme-time").text(formatDay(CME.startTime));
      $("#cme-latitude").text(`${CME.latitude}\u00B0`);
      $("#cme-longitude").text(`${CME.longitude}\u00B0`);
      $("#cme-angle").text(`${CME.halfAngle}\u00B0`);
      $("#cme-speed").text(CME.speed);
      $("#cme-type").text(CME.type);
      $("#cme-note").text(CME.note);
    }

    // recent solar flare
    if (FLR) {
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

module.exports = { displayData };
