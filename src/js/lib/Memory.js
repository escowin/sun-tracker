const API = require("./API");
// to-do:
// - use promises to handle indexedDB & API methods
// - post latest api data to indexedDB stores
// -- delete existing objects from store that are 7 days older than most recent object.
// -- retain existing objects if latest object cannot be retrieved (offline, fetch data not avaiable, etc)

class Memory extends API {
  constructor() {
    super();
    this.dbName = "sun_tracker_db";
    this.storeNames = ["cme", "flr"];
    this.openDatabase();
  }

  initDatabase(e) {
    const db = e.target.result;
    this.storeNames.forEach((name) => {
      const store = db.createObjectStore(name, { autoIncrement: true });
      store.transaction.oncomplete = (e) => {
        const tx = db.transaction(name, "readwrite").objectStore(name)
        if (tx.name === "flr") {
          console.log("this is the flr store transaction")
          console.log(this.FLR)
        } else  {
          console.log("this is something else")
        }
        console.log(e)
        console.log(tx)
      }
    });
  }

  async openDatabase() {
    const promise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, 1);
      request.onerror = (e) => reject(e.target.errorCode);
      request.onupgradeneeded = (e) => this.initDatabase(e);
      request.onsuccess = (e) => resolve(e.target.request);
    });

    console.log(promise);
  }
}

module.exports = Memory;
