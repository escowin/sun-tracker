const { calculateDuration } = require("./time");

const formattedStrings = {
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
    // stats.orbit = orbit;
    // stats.lm = orbit / 17987547.48;
    console.log(orbit);

    return orbit
  },
};

module.exports = formattedStrings;
