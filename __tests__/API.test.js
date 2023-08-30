const API = require("../src/js/lib/API")

test("create API object", () => {
    const api = new API();
    console.log(api)

    expect(api.CME).toStrictEqual(expect.any(Object))
    expect(api.FLR).toStrictEqual(expect.any(Object))
})