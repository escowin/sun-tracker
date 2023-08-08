const { calculateDuration } = require("./time");

module.exports = {
  luminosity: (string) =>
    "L<span class='sub'>&#8857;</span> = 4&#960;kI<span class='sub'>&#8857;</span>A<span class='sup'>2</span>",
  pluralization: (num, string) =>
    num !== 1 ? `${num} ${string}s` : `${num} ${string}`,
  fluctuate: (num) => {
    // sets a random high low range sun temp to then randomly return a number from
    const high = num + Math.round(Math.random() * 3000);
    const low = num + Math.round((Math.random() - 0.5) * 1000);
    const result = Math.round(low + Math.random() * (high - low));
    return result;
  },
  currentDistance: (now, perihelion) => {
    const totalDays = calculateDuration(perihelion, now, "day");
    // time, semi-major axis, eccentricity
    const t = (totalDays * 365.25) / 360;
    const a = 149600000;
    const e = 0.017;

    // earth-sun distance equation
    const orbit = (a * (1 - e * e)) / (1 + e * Math.cos(t));
    // const lm = orbit / 17987547.48;
    return orbit;
  },
  convertUnit: (num, unit, type) => {
    console.log(num, unit, type)
    switch (unit) {
      case "metric":
        return type === "temp"
          ? `${Math.round(num - 273.15)} \u2103`
          : `${num.toLocaleString("en-US")} km`;
      case "imperial":
        return type === "temp"
          ? `${Math.round(num * (9 / 5) - 459.76)} \u2109`
          : `${(num / 1.609344).toLocaleString("en-US")} mi`;
      case "si":
        return type === "temp"
          ? `${num} K`
          : `${(num / 149597870.7).toLocaleString("en-US")} au`;
      default:
        console.log("failed conversion");
    }
  },
};
