const { utcNow, perihelion, duration } = require("../utils/time");

class Sun {
  constructor() {
    this.distance = this.currentDistance(utcNow);
    this.irradiance = this.calculateIrradiance(1.3608);
    this.luminosity = this.calculateLuminosity();
    this.metallicity = "1.22%";
    this.spectral = "G2V";
    this.temp = this.calculateTemp(5772);
    this.lightMinutes = this.calculateLightMinutes();
  }

  calculateIrradiance(num) {
    const min = num - 0.0005;
    const max = num + 0.0005;
    const result = Math.random() * (max - min) + min;

    // converts kilowatts to watts
    return result * 1000;
  }

  calculateLuminosity() {
    // constant, solar irridance, au^2 in meters
    const k = this.distance;
    const Io = this.irradiance;
    const A = 149597870700 ** 2;

    // luminosity formula L☉ = 4πkI☉A²
    const result = 4 * Math.PI * k * Io * A;
    const yw = 1e-24;

    // converts watts to rounded yottawatts
    return Math.round(result * yw * 100) / 100;
  }

  calculateTemp(num) {
    // sets a random high low range sun temp to then randomly return a number within that range
    const high = num + Math.round(Math.random() * 3000);
    const low = num + Math.round((Math.random() - 0.5) * 1000);
    const current = Math.round(low + Math.random() * (high - low));
    return { current, high, low };
  }

  currentDistance(now) {
    // uses seconds to get a more accurate day length for realtime distance calculations
    const seconds = duration(perihelion, now, "seconds") + 1;
    const day = (seconds / (60 * 60 * 24)) + 1
    // au, semi-major axis length, eccentricity
    const au = 1;
    const t = 360 / 365.256363;
    const e = 0.01671022;

    // distance between earth and sun in AU
    const orbit = au - e * Math.cos(t * (day - 4));
    console.log(day)
    console.log(orbit)
    return orbit;
  }

  calculateLightMinutes() {
    const meters = this.distance * 149597870.7 * 1000;
    const result = meters / 299792458 / 60;
    return result;
  }
}

module.exports = Sun;
