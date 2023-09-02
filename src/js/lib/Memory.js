const API = require("./API");

class Memory extends API {
  constructor() {
    super();
    this.dbName = "sun_tracker_db";
    this.storeNames = ["cme", "flr"];
    this.cmeStore;
    this.flrStore;
    this.openDatabase();
  }

  async openDatabase() {
    // flag to check whether or not to post new objects to stores
    let upgraded = false;

    return await new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, 1);
      request.onerror = (e) => reject(e.target.errorCode);
      request.onupgradeneeded = (e) => {
        this.initDatabase(e);
        upgraded = true;
      };
      request.onsuccess = (e) => {
        if (!upgraded) {
          this.updateStores(e);
        }
        resolve(e.target.request);
      };
    });
  }

  async initDatabase(e) {
    // resolves api promise objects as arrays
    const promises = [this.CME, this.FLR];
    const [cmeData, flrData] = await Promise.all(promises);

    const db = e.target.result;
    this.storeNames.forEach((name) => {
      const store = db.createObjectStore(name, { keyPath: "id" });
      store.transaction.oncomplete = (e) => {
        const cmeStore = db.transaction("cme", "readwrite").objectStore("cme");
        const flrStore = db.transaction("flr", "readwrite").objectStore("flr");
        cmeData.forEach((cme) => cmeStore.add(cme));
        flrData.forEach((flr) => flrStore.add(flr));
      };
    });
  }

  async updateStores(e) {
    const promises = [this.CME, this.FLR];
    const [cmeData, flrData] = await Promise.all(promises);
    const db = e.target.result;

    // modularize if code gets too long
    this.storeNames.forEach((name) => {
      const tx = db.transaction(name, "readwrite");
      const store = tx.objectStore(name);
      // removes current store objects en masse if fetched data array contains objects
      if (name === "cme" && cmeData.length > 0) {
        store.clear();
        store.transaction.oncomplete = (e) => {
          // fetched arrays objects are written to store
          const cmeStore = db.transaction(name, "readwrite").objectStore(name);
          cmeData.forEach((cme) => cmeStore.add(cme));
        };
      } else if (name === "flr" && flrData.length > 0) {
        store.clear();
        store.transaction.oncomplete = (e) => {
          const flrStore = db.transaction(name, "readwrite").objectStore(name);
          flrData.forEach((flr) => flrStore.add(flr));
        };
      } else {
        console.log(
          "did not clear " + name + " store because fetched data is empty"
        );
      }
    });
  }

  async getStore(name) {
    // use indexeddb store data if fetched arrays are empty
    return await new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, 1);
      request.onerror = (e) => reject(e.target.errorCode);
      request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction(name);
        const store = tx.objectStore(name);
        const result = store.getAll();
        result.onsuccess = (e) => resolve(e.target.result);
      };
    });
  }
}

module.exports = Memory;
