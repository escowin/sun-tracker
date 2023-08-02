const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const now = dayjs().utc().format();
const year = dayjs(now).format("YYYY");
const currentDate = dayjs(now).format("MMMM Do, YYYY");
const apiStart = dayjs(now).subtract(7, "days").format("YYYY-MM-DD");
const apiEnd = dayjs(now).format("YYYY-MM-DD");

// bug returns NaN
function flareDuration(start, end) {
  const startTime = dayjs(start, "h:mm a");
  const endTime = dayjs(end, "h:mm a");
  return endTime.diff(startTime, "minute");
}
console.log(flareDuration("12:00 am", "12:15 am"));
