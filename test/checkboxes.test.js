import { DATA_SERIALIZED } from '../src'

describe("checkboxes", () => {
  describe("singles", () => {
    test("it reads an absence of selection as a null value", () => {
      const page = jsdom.fragment('<input type="checkbox" value="123">')
      const value = jsf.get(page.querySelector('input'))
      expect(value).toEqual(null)
    })

    test("it reads a selected non-serialized number value as a string", () => {
      const page = jsdom.fragment('<input type="checkbox" value="123" checked>')
      const value = jsf.get(page.querySelector('input'))
      expect(value).toEqual("123")
    })

    test("it reads a selected serialized number value as a number", () => {
      const page = jsdom.fragment(`<input type="checkbox" ${DATA_SERIALIZED}="123" checked>`)
      const value = jsf.get(page.querySelector('input'))
      expect(value).toEqual(123)
    })

    test("it reads a selected serialized number value as a number, over a non-serialized value", () => {
      const page = jsdom.fragment(`<input type="checkbox" ${DATA_SERIALIZED}="123" value="123" checked>`)
      const value = jsf.get(page.querySelector('input'))
      expect(value).toEqual(123)
    })
  })

  describe("multiples", () => {
    test("it reads an absence of selection as an empty array", () => {
      const page = jsdom.fragment(`
        <input type="checkbox" value="123" name="foo">
        <input type="checkbox" value="124" name="foo">
      `)
      const value = jsf.get(page.querySelector('input'))
      expect(value).toEqual([])
    })

    test("it reads a non-serialized selection as a string value", () => {
      const page = jsdom.fragment(`
        <input type="checkbox" value="123" name="foo">
        <input type="checkbox" value="124" name="foo" checked>
      `)
      const value = jsf.get(page.querySelector('input'))
      expect(value).toEqual(["124"])
    })
  })
})
