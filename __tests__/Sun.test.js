const Sun = require("../assets/js/Sun");

// Sun properties
test("create a Sun object", () => {
  const sun = new Sun();

  console.log(sun)
  expect(sun.distance).toEqual(expect.any(Number));
  expect(sun.luminosity).toEqual(expect.any(Number));
  expect(sun.metallicity).toBe("Z = 0.0122");
  expect(sun.spectral).toBe("G2V");
  expect(sun.temp).toStrictEqual(expect.any(Object));
});

// Sun methods
test("calculate distance of the Sun", () => {
  const sun = new Sun();
  expect(sun.currentDistance()).toEqual(expect.any(Number));
});

test("fluctuate returns object with 3 key-values", () => {
  const sun = new Sun();
  expect(sun.calculateTemp(5000)).toStrictEqual(
    expect.objectContaining({
      current: expect.any(Number),
      high: expect.any(Number),
      low: expect.any(Number),
    })
  );
});

test("returns value near 8 light minutes", () => {
  const sun = new Sun();
  expect(sun.calculateLightMinutes()).toBeCloseTo(8, .25);
});

// tests math formulas for solar variables used in luminosity
test("returns random number within the set range", () => {
  const sun = new Sun();
  const num = 5
  expect(sun.calculateIrradiance (num)).toBeGreaterThanOrEqual(num - 0.0005, num + 0.0005)
})

test("returns luminosity near the nominal value", () => {
  const sun = new Sun()
  const yw = 1e-24
  const avg = Math.round((3.828 * (10**26)) * (yw));

  expect(sun.calculateLuminosity()).toBeGreaterThanOrEqual(avg - 5, avg + 5)
})