module.exports = {
  luminosity: (string) =>
    "L<span class='sub'>&#8857;</span> = 4&#960;kI<span class='sub'>&#8857;</span>A<span class='sup'>2</span>",
  pluralization: (num, string) =>
    num !== 1 ? `${num} ${string}s` : `${num} ${string}`,
  convertUnit: (num, unit, type) => {
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
