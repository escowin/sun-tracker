module.exports = {
  pluralization: (num, string) =>
    num !== 1 ? `${num} ${string}s` : `${num} ${string}`,
  convertUnit: (num, unit, type) => {
    switch (unit) {
      case "metric":
        return type === "temp"
          ? `${Math.round(num - 273.15)} \u2103`
          : `${(num * 149597870.7).toLocaleString("en-US")} km`;
      case "imperial":
        return type === "temp"
          ? `${Math.round(num * (9 / 5) - 459.76)} \u2109`
          : `${(num * 92955807.3).toLocaleString("en-US")} mi`;
      case "si":
        return type === "temp"
          ? `${num} K`
          : `${(num).toLocaleString("en-US")} au`;
      default:
        console.log("failed conversion");
    }
  },
};
