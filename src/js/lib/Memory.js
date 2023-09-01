const API = require("./API");

class Memory extends API {
  constructor() {
    super();
    this.dbName = "sun_tracker_db";
    this.storeNames = ["cme", "flr"];
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
      const store = db.createObjectStore(name, { autoIncrement: true });
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

    const db = e.target.result

    // modularize if code gets too long
    this.storeNames.forEach(name => {
      const tx = db.transaction([name], "readonly")
      const store = tx.objectStore(name)
      const result = store.getAll()
      console.log(result)

      // compare the fetched arrays w/ existing store objects
      // - retain idb store objects that match fetched array objects 
      // - if store has different (older than 7 days) objects, remove/delete objects from store
      // - if fetched array has different (newer) objects, add/write objects to store
      // - if fetched array are empty/null/undefined (bc fetch could not be made), dont modify store
    })
  }
}

module.exports = Memory;
