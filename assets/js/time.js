const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const formattedTime = {
  dayjs,
  now: dayjs().utc().format(),
  year: dayjs(this.now).format("YYYY"),
  currentDate: dayjs(this.now).format("MMMM Do, YYYY"),
  apiStart: dayjs(this.now).subtract(7, "days").format("YYYY-MM-DD"),
  apiEnd: dayjs(this.now).format("YYYY-MM-DD"),
  
  flareDuration: (start, end) => {
    const startTime = dayjs(start, "h:mm a");
    const endTime = dayjs(end, "h:mm a");
    return endTime.diff(startTime, "minute");
  },
};

module.exports = formattedTime;
