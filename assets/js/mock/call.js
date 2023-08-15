const { mockCME, mockFLR } = require("./data")

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