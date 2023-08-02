const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const formattedTime = {
  // variables
  dayjs,
  now: dayjs().utc().format(),
  year: dayjs(this.now).format("YYYY"),
  currentDate: dayjs(this.now).format("MMMM Do, YYYY"),
  apiStart: dayjs(this.now).subtract(7, "days").format("YYYY-MM-DD"),
  apiEnd: dayjs(this.now).format("YYYY-MM-DD"),

  // functions to calculate & format UTC strings
  calculateDuration: (start, end) => end.diff(start, "minute"),
  formatDateTime: (string) => dayjs(string).format("MMMM Do, h:mm a"),
};

module.exports = formattedTime;
