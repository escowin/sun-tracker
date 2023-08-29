import "../css/styles.css";
const { displayData } = require("./utils/displayData");
const { year } = require("./utils/time");
const { mockFLR, mockCME } = require("./mock/data");
const Display = require("./lib/Display")
const display = new Display();

console.log(`
   \u00A9 ${year} Edwin M. Escobar
   https://github.com/escowin/sun-tracker
   `);

display.openDatabase();
display.displayData();
// console.log(display)

// calls
// apiCalls();

// DEVELOPMENT CALL
async function development() {
  try {
    const cmeData = await getCME(mockCME)
    const flrData = await getFLR(mockFLR)

    displayData(cmeData, flrData)
  } catch (err) {
    console.error(err)
  }
}

development()