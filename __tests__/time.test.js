const { duration, perihelion, formatUTC } = require("../src/js/utils/time");

test("calculates by the second", () => {
    const now = formatUTC(new Date())
    const x = duration(perihelion, now, "day")
    console.log(x)
})