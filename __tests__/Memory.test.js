const Memory = require("../src/js/lib/Memory");

test("inherits API constructor resolved promises", () => {
  const memory = new Memory();

  // checks for pending promises
  expect(memory.CME).toBeInstanceOf(Promise);
  expect(memory.FLR).toBeInstanceOf(Promise);
  // checks for fullfilled promises
  expect(memory.CME).resolves.toBeInstanceOf(Object);
  expect(memory.FLR).resolves.toBeInstanceOf(Object);
});
