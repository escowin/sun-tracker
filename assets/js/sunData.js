const { fluctuate } = require("./helper");
const { utcNow, perihelion } = require("./time")

const sun = {
  temp: fluctuate(5772),
  spectral: "G2V",
  metallicity: "Z = 0.0122",
  luminosity: "L⊙ = 4πkI⊙A2",
  distance: currentDistance(utcNow, perihelion),
  lm: () =>
    `${(stats.distance / 17987547.48).toLocaleString("en-US")} light minutes`,
};

module.exports = { sun };
