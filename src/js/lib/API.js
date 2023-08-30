const { duration, apiStart, apiEnd } = require("../utils/time");

class API {
  constructor() {
    this.FLR = this.apiCall("FLR");
    this.CME = this.apiCall("CME");
  }

  // returns API data through promises
  async apiCall(endpoint) {
    // variables used to dynamically create URL for fetch requests
    const api = {
      base: "https://api.nasa.gov/DONKI/",
      key: "UJO2NYWIRwCuDl6l431qKvjZviS8TPLUatA1E0xd",
      start: apiStart,
      end: apiEnd,
      path: function () {
        return `${this.base}${endpoint}?startDate=${this.start}&endDate=${this.end}&api_key=${this.key}`;
      },
    };

    console.log(api.path())
    // const promise = await this.getSunActivity(api.path, endpoint)
    // try {
    //   // creates an array of promises by mapping endpoints as fetch arguments
    //   const promises = api.endpoints.map((endpoint) =>
    //     getSunActivity(api.path(endpoint), endpoint)
    //   );
    //   // awaits to resolve promises. results assigned to corresponding variables
    //   const [cmeData, flrData] = await Promise.all(promises);

    //   // retrieved data is handled in jquery function for dom manipulation
    //   displayData(cmeData, flrData);
    // } catch (err) {
    //   console.error(err);
    // }
  }

  // makes fetch requests to NASA API for specified endpoints
  getSunActivity(url, endpoint) {
    // selects appropriate fetch & data handling functions
    switch (endpoint) {
      case "CME":
        return fetch(url).then((res) =>
          res.json().then((data) => getCME(data))
        );
      case "FLR":
        return fetch(url).then((res) =>
          res.json().then((data) => getFLR(data))
        );
      default:
        return Promise.reject("failed fetch request");
    }
  }

  async getCME(CME) {
    const newArray = [];
    const reverse = CME.reverse();
    reverse.forEach((cme) => {
      const cmeObj = {
        startTime: cme.startTime,
        note: cme.note,
        latitude: cme.cmeAnalyses[0].latitude,
        longitude: cme.cmeAnalyses[0].longitude,
        halfAngle: cme.cmeAnalyses[0].halfAngle,
        speed: cme.cmeAnalyses[0].speed,
        type: cme.cmeAnalyses[0].type,
      };

      newArray.push(cmeObj);
    });

    return newArray;
  }

  async getFLR(FLR) {
    const newArray = [];
    const reverse = FLR.reverse();
    reverse.forEach((flare) => {
      const flrObj = {
        beginTime: flare.beginTime,
        peakTime: flare.peakTime,
        endTime: flare.endTime,
        duration: duration(flare.beginTime, flare.endTime, "minute"),
        activeRegionNum: flare.activeRegionNum,
        sourceLocation: flare.sourceLocation,
        classType: flare.classType,
      };

      newArray.push(flrObj);
    });

    return newArray;
  }
}

module.exports = API;