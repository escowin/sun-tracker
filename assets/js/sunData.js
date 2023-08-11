const { utcNow, perihelion, duration } = require("./time");

class Sun {
  constructor() {
    this.distance = this.currentDistance(utcNow, perihelion);
    this.luminosity = "L☉ = 4πkI☉A²";
    this.metallicity = "Z = 0.0122";
    this.spectral = "G2V";
    this.temp = this.fluctuate(5772);
  }

  calculateLuminosity() { 
    const A = this.distance
    // k = solar constant (avg. 1.3608 ± 0.0005  kW/m)
    // I☉ = solar irradiance

    // luminosity formula L☉ = 4πkI☉A²
    const result = (4 * Math.PI() * k);
  }

  fluctuate(num) {
    // sets a random high low range sun temp to then randomly return a number from
    const high = num + Math.round(Math.random() * 3000);
    const low = num + Math.round((Math.random() - 0.5) * 1000);
    const result = Math.round(low + Math.random() * (high - low));
    return result;
  }

  currentDistance(now, perihelion) {
    const totalDays = duration(perihelion, now, "day");
    // time, semi-major axis, eccentricity
    const t = (totalDays * 365.25) / 360;
    const a = 149600000;
    const e = 0.017;
    // earth-sun distance equation
    const orbit = (a * (1 - e * e)) / (1 + e * Math.cos(t));

    return orbit;
  }

  duration(start, end, unit) {
    return duration(start, end, unit)
  };

  lightMinutes() {
    const lightMinutes = (this.distance / 17987547.48).toLocaleString("en-US");
    return `${lightMinutes} light minutes`
  }
}

module.exports = Sun;
