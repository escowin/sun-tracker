const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const formattedTime = {
  dayjs,
  now: dayjs().utc().format(),
  year: dayjs(now).format("YYYY"),
  currentDate: dayjs(now).format("MMMM Do, YYYY"),
  apiStart: dayjs(now).subtract(7, "days").format("YYYY-MM-DD"),
  apiEnd: dayjs(now).format("YYYY-MM-DD"),
  flareDuration: (start, end) => {
    const startTime = dayjs(start, "h:mm a");
    const endTime = dayjs(end, "h:mm a");
    return endTime.diff(startTime, "minute");
  },
};

module.exports = formattedTime;
