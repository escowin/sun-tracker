const Memory = require("../src/js/lib/Memory");

test("exposes fetchEndpoint and getStore", () => {
  const memory = new Memory();

  expect(typeof memory.fetchEndpoint).toBe("function");
  expect(typeof memory.getStore).toBe("function");
});

test("constructor contains indexeddb-relevant strings", () => {
  const memory = new Memory();

  expect(memory.dbName).toBe("sun_tracker_db");
  expect(memory.storeNames).toContain("cme");
  expect(memory.storeNames).toContain("flr");
});

test("EVENT_DATA_UPDATED is defined", () => {
  expect(Memory.EVENT_DATA_UPDATED).toBe("sundata-updated");
});

// to-do: testing frameworks for indexeddb-methods