const Sun = require("../assets/js/sunData");
const { utcNow, perihelion } = require("../assets/js/time");

// Sun properties
test("create a Sun object", () => {
  const sun = new Sun();

  expect(sun.distance).toEqual(expect.any(Number));
  expect(sun.luminosity).toBe("L☉ = 4πkI☉A²");
  expect(sun.metallicity).toBe("Z = 0.0122");
  expect(sun.spectral).toBe("G2V");
  expect(sun.temp).toStrictEqual(expect.any(Object));
});

// Sun methods
test("calculate distance of the Sun", () => {
  const sun = new Sun();
  expect(sun.currentDistance()).toEqual(expect.any(Number));
});

test("calculate duration between time", () => {
  const sun = new Sun();
  expect(sun.duration(perihelion, utcNow, "day")).toEqual(expect.any(Number));
});

test("fluctuate returns object with 3 key-values", () => {
  const sun = new Sun();
  expect(sun.fluctuate(5000)).toStrictEqual(
    expect.objectContaining({
      current: expect.any(Number),
      high: expect.any(Number),
      low: expect.any(Number),
    })
  );
});

test("return light minutes as string", () => {
  const sun = new Sun();
  expect(sun.lightMinutes()).toEqual(expect.stringContaining("light minutes"));
});
