const API = require("../src/js/lib/API")

test("create API object", () => {
    const api = new API();

    expect(api.CME).toStrictEqual(expect.any(Object))
    expect(api.FLR).toStrictEqual(expect.any(Object))
})