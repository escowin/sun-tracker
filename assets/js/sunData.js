const { utcNow, perihelion, duration } = require("./time");

class Sun {
  constructor() {
    this.distance = this.currentDistance(utcNow, perihelion);
    this.irradiance  = this.calculateIrradiance ((1.3608));
    this.luminosity = this.calculateLuminosity();
    this.metallicity = "Z = 0.0122";
    this.spectral = "G2V";
    this.temp = this.calculateTemp(5772);
  }

  calculateIrradiance (num) {
    const min = num - 0.0005;
    const max = num + 0.0005;
    const result = Math.random() * (max - min) + min
    
    // converts kilowatts to watts
    return result * 1000;
  }
  
  calculateLuminosity() {
    // constant, solar irridance, au^2 in meters
    const k = this.distance;
    const Io = this.irradiance ;
    const A = 149597870700 ** 2;

    // luminosity formula L☉ = 4πkI☉A²
    const result = 4 * Math.PI * k * Io * A;
    const yw = 1e-24

    // converts watts to rounded yottawatts
    return Math.round(((result * (yw)) * 10)) / 10;
  }

  calculateTemp(num) {
    // sets a random high low range sun temp to then randomly return a number within that range
    const high = num + Math.round(Math.random() * 3000);
    const low = num + Math.round((Math.random() - 0.5) * 1000);
    const current = Math.round(low + Math.random() * (high - low));
    return { current, high, low };
  }

  currentDistance(now, perihelion) {
    const day = duration(perihelion, now, "day") + 1;
    // au, semi-major axis length, eccentricity
    const au = 1;
    const t = 360/365.256363; // deg full rotation, mean solar days
    const e = 0.01671022;
    // distance between earth and sun
    const orbit = au - e * Math.cos(t * (day - 4))

    return orbit;
  }

  lightMinutes() {
    const lightMinutes = (this.distance / 17987547.48).toLocaleString("en-US");
    return `${lightMinutes} light minutes`;
  }
}

module.exports = Sun;
