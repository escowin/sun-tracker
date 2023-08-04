const {formatDateTime, calculateDuration, ...formattedTime} = require("./time")

const a = formatDateTime("2023-08-02T09:12Z")

const b = calculateDuration("2023-08-02T09:12Z", "2023-08-02T09:35Z")
console.log(b)