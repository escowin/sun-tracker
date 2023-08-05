const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const time = {
  // time string variables
  dayjs,
  now: dayjs().utc().format(),
  year: dayjs(this.now).format("YYYY"),
  currentDate: dayjs(this.now).format("MMMM Do, YYYY h:mm a"),
  apiStart: dayjs(this.now).subtract(7, "days").format("YYYY-MM-DD"),
  apiEnd: dayjs(this.now).format("YYYY-MM-DD"),
  perihelion: dayjs("2022-01-04 06:55:00").utc().format(),
  totalDays: dayjs(this.now),

  // time functions
  calculateDuration: (start, end, length) =>
    dayjs(end).diff(dayjs(start), length),
  formatDateTime: (string) => dayjs(string).local().format("MMMM Do, h:mm a"),
  formatNow: (string) => dayjs(string).utc().format(),
  formatDay: (string) => dayjs(string).local().format("dddd, h:mm a"),
  formatTime: (string) => dayjs(string).local().format("h:mm a"),
  forecast: function (num) {
    return dayjs(this.now).add(num, "day").format("dddd");
  },
};

module.exports = time;
