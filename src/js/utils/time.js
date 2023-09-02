const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const time = {
  // time variables
  dayjs,
  year: dayjs().format("YYYY"),
  nowUtc: dayjs().utc(),
  apiStart: dayjs().subtract(7, "days").format("YYYY-MM-DD"),
  apiEnd: dayjs().format("YYYY-MM-DD"),
  perihelion: dayjs("2022-01-04 06:55:00").utc().format(),
  // calculates time
  now: () => dayjs().format("MMMM Do, h:mm:ss a"),
  duration: (start, end, length) => dayjs(end).diff(dayjs(start), length),
  // formats strings
  formatDay: (string) => dayjs(string).local().format("dddd, h:mm a"),
  formatHr: (string) => dayjs(string).local().format("h:mm a"),
  forecast: (num) => dayjs().add(num, "day").format("ddd"),
  formatUTC: (string) => dayjs(string).utc().format()
};

module.exports = time;
