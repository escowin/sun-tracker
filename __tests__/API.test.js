const API = require("../src/js/lib/API");

test("create API object with fetchEndpoint and api config", () => {
  const api = new API();

  expect(typeof api.fetchEndpoint).toBe("function");
  expect(api.api).toBeDefined();
  expect(api.api.base).toContain("nasa.gov");
  expect(api.api.path).toBeDefined();
});