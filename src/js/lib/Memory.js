const API = require("./API");

const RETRY_DELAY_MS = 2 * 60 * 1000; // 2 minutes
const STORE_MAP = { CME: "cme", FLR: "flr" };
const EVENT_DATA_UPDATED = "sundata-updated";

class Memory extends API {
  constructor() {
    super();
    this.dbName = "sun_tracker_db";
    this.storeNames = ["cme", "flr"];
    this._db = null;
    this._retryTimeouts = {};
  }

  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        this.storeNames.forEach((name) => {
          db.createObjectStore(name, { keyPath: "id" });
        });
      };
      request.onsuccess = async (e) => {
        this._db = e.target.result;
        await this._fetchAndStore();
        resolve(this._db);
      };
    });
  }

  async _fetchAndStore() {
    const endpoints = ["CME", "FLR"];

    for (const endpoint of endpoints) {
      const result = await this.fetchEndpoint(endpoint);
      const storeName = STORE_MAP[endpoint];

      if (result.ok) {
        await this._writeStore(storeName, result.data);
        this._clearRetry(endpoint);
        this._dispatchDataUpdated(storeName);
      } else if (result.retryable) {
        this._scheduleRetry(endpoint);
      }
    }
  }

  async _writeStore(storeName, data) {
    const db = this._db;
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        const items = Array.isArray(data) ? data : [];
        if (items.length === 0) {
          resolve();
          return;
        }
        items.forEach((item) => store.add(item));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      clearReq.onerror = () => reject(clearReq.error);
    });
  }

  _scheduleRetry(endpoint) {
    this._clearRetry(endpoint);
    this._retryTimeouts[endpoint] = setTimeout(async () => {
      const result = await this.fetchEndpoint(endpoint);
      const storeName = STORE_MAP[endpoint];

      if (result.ok) {
        await this._writeStore(storeName, result.data);
        this._clearRetry(endpoint);
        this._dispatchDataUpdated(storeName);
      } else if (result.retryable) {
        this._scheduleRetry(endpoint);
      }
    }, RETRY_DELAY_MS);
  }

  _clearRetry(endpoint) {
    if (this._retryTimeouts[endpoint]) {
      clearTimeout(this._retryTimeouts[endpoint]);
      delete this._retryTimeouts[endpoint];
    }
  }

  _dispatchDataUpdated(storeName) {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent(EVENT_DATA_UPDATED, { detail: { storeName } }));
    }
  }

  async getStore(name) {
    if (!this._db) {
      return [];
    }

    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(name, "readonly");
      const store = tx.objectStore(name);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }
}

Memory.EVENT_DATA_UPDATED = EVENT_DATA_UPDATED;
module.exports = Memory;
