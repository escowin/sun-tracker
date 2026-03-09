const { duration, apiStart, apiEnd } = require("../utils/time");

/** HTTP status codes that should NOT trigger a retry (404, 401, 403) */
const NO_RETRY_STATUSES = [404, 401, 403];

/**
 * Fetches an endpoint and returns a structured result.
 * @returns {Promise<{ ok: boolean, data?: array, status?: number, retryable?: boolean }>}
 */
class API {
  constructor() {
    this.api = {
      base: "https://api.nasa.gov/DONKI/",
      key: "UJO2NYWIRwCuDl6l431qKvjZviS8TPLUatA1E0xd",
      start: apiStart,
      end: apiEnd,
      path: (endpoint) =>
        `${this.api.base}${endpoint}?startDate=${this.api.start}&endDate=${this.api.end}&api_key=${this.api.key}`,
    };
  }

  async fetchEndpoint(endpoint) {
    const url = this.api.path(endpoint);

    try {
      const res = await fetch(url);

      if (res.ok) {
        const raw = await res.json();
        const data =
          endpoint === "CME" ? await this.getCME(raw) : await this.getFLR(raw);
        return { ok: true, data };
      }

      const status = res.status;
      const retryable = !NO_RETRY_STATUSES.includes(status);
      return { ok: false, status, retryable };
    } catch (err) {
      console.error(`[API] ${endpoint} fetch error:`, err);
      return { ok: false, retryable: true };
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
