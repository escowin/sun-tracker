const { formatDay, formatTime, forecast, ...time } = require("./time");
const { convertUnit, luminosity, pluralization } = require("./helper")

// jquery methods manipulate dom elements to display parameter data
function displayData(CME, FLR, stats) {
  console.log(stats)
  $(() => {
    // appends each generated forecast list element to  parent ul container
    // goal: unqiue temp for each day
    for (let i = 0; i < 5; i++) {
      $("#forecast-container").append(`<li class="day">
        <p>${forecast(i + 1)}</p>
        <p class="temp" data-type="temp">${stats.temp}</p>
      </li>`);
    }

    // time
    $("#copyright-year").text(time.year);
    $("#current-date").text(time.currentDate);

    // DOM loads with SI units selected and displayed
    $("#kelvin").prop("checked", true);
    // displayUnits($("#kelvin").val());
    $(".temp").text(stats.temp);
    $("#distance").text(stats.distance);

    //  sun stats
    $("#spectral").text(stats.spectral);
    $("#luminosity").append(luminosity(stats.luminosity));
    $("#metallicity").text(stats.metallicity);

    // use event listener to tie radio
    $("#units input").on("click", (e) => {
      const unit = e.target.value;
      // set & capture data-type
      $(".temp").text(convertUnit(stats.temp, unit, $(".temp").data("type")));
      $("#distance").text(stats.distance);
    });
    $("#lm").text(stats.lm());

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
