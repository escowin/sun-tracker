const { duration, apiStart, apiEnd } = require("../utils/time");

class API {
  constructor() {
    this.CME = this.apiCall("CME");
    this.FLR = this.apiCall("FLR");
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

    try {
      return await new Promise((resolve, reject) => {
        resolve(this.getSunActivity(api.path(), endpoint));
        reject("promise failed");
      });
    } catch (err) {
      console.error(err);
    }
  }

  getSunActivity(url, endpoint) {
    // passes fetched data into corresponding function. failed request returns an empty array
    switch (endpoint) {
      case "CME":
        return fetch(url)
          .then((res) => res.json().then((data) => this.getCME(data)))
          .catch(() => []);
      case "FLR":
        return fetch(url)
          .then((res) => res.json().then((data) => this.getFLR(data)))
          .catch(() => []);
      default:
        return Promise.reject("failed fetch request");
    }
  }

  async getCME(CME) {
    const newArray = [];
    if (!CME) {
      return newArray;
    }

    const reverse = CME.reverse();
    reverse.forEach((cme) => {
      const cmeObj = {
        id: cme.activityID,
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
    if (!FLR) {
      return newArray;
    }

    const reverse = FLR.reverse();
    reverse.forEach((flare) => {
      const flrObj = {
        id: flare.flrID,
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
