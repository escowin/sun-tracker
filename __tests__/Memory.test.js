const Memory = require("../src/js/lib/Memory");

test("inherits API constructor resolved promises", async () => {
  const memory = new Memory();

  // checks for pending promises
  expect(memory.CME).toBeInstanceOf(Promise);
  expect(memory.FLR).toBeInstanceOf(Promise);
  // checks for fullfilled promises through async/await construction
  await expect(memory.CME).resolves.toBeInstanceOf(Object);
  await expect(memory.FLR).resolves.toBeInstanceOf(Object);
});

test("contructor contains indexeddb-relevant strings", () => {
  const memory = new Memory();

  expect(memory.dbName).toBe("sun_tracker_db");
  expect(memory.storeNames).toContain("cme");
  expect(memory.storeNames).toContain("flr");
});

// to-do: testing frameworks for indexeddb-methods