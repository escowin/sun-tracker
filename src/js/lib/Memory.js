class Memory {
  constructor() {
    this.dbName = "sun_tracker_db";
    this.storeNames = ["cme", "flr"];
  }

  initDatabase(e) {
    const db = e.target.result;
    this.storeNames.forEach((store) =>
      db.createObjectStore(store, { autoIncrement: true })
    );
  }

  async openDatabase() {
    const promise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, 1);
      request.onerror = (e) => reject(e.target.errorCode);
      request.onupgradeneeded = (e) => this.initDatabase(e);
      request.onsuccess = (e) => resolve(e.target.request);
    });

    console.log(promise)
  }
}
