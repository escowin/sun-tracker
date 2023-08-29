import "../css/styles.css";
const { displayData } = require("./utils/displayData");
const { year } = require("./utils/time");
const { mockFLR, mockCME } = require("./mock/data");
const Memory = require("./lib/Memory")
const memory = new Memory();

memory.openDatabase();
// console.log(memory)

// javascript functions handle data before the dom
console.log(`
   \u00A9 ${year} Edwin M. Escobar
   https://github.com/escowin/sun-tracker
   `);


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