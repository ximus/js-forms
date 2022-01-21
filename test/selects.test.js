import { DATA_SERIALIZED } from '../src'

describe("selects", () => {
  test("it reads a boolean false option as a boolean value", () => {
    const page = jsdom.fragment(`
      <select name="select">
        <option ${DATA_SERIALIZED}="false" selected>boolean</option>
      </select>
    `)
    const value = jsf.get(page.querySelector('select'))
    expect(value).toEqual(false)
  })

  test("it reads a boolean true option as a boolean value", () => {
    const page = jsdom.fragment(`
      <select name="select">
        <option ${DATA_SERIALIZED}="true" selected>boolean</option>
      </select>
    `)
    const value = jsf.get(page.querySelector('select'))
    expect(value).toEqual(true)
  })

  test("it reads a null option as a null value", () => {
    const page = jsdom.fragment(`
      <select name="select">
        <option ${DATA_SERIALIZED}="null" selected>null</option>
      </select>
    `)
    const value = jsf.get(page.querySelector('select'))
    expect(value).toEqual(null)
  })

  test("it reads a string option as a string value", () => {
    const page = jsdom.fragment(`
      <select name="select">
        <option ${DATA_SERIALIZED}='"foo-string"' selected>string</option>
      </select>
    `)
    const value = jsf.get(page.querySelector('select'))
    expect(value).toEqual("foo-string")
  })

  test("it reads a number option as a number value", () => {
    const page = jsdom.fragment(`
      <select name="select">
        <option ${DATA_SERIALIZED}='123' selected>number</option>
      </select>
    `)
    const value = jsf.get(page.querySelector('select'))
    expect(value).toEqual(123)
  })

  describe("with 'multiple' set", () => {
    test("it reads a single selected option as an array", () => {
      const page = jsdom.fragment(`
        <select name="select" multiple>
          <option ${DATA_SERIALIZED}='true' selected>boolean</option>
        </select>
      `)
      const value = jsf.get(page.querySelector('select'))
      expect(value).toEqual([true])
    })

    test("it reads a multiple selected options as an array", () => {
      const page = jsdom.fragment(`
        <select name="select" multiple>
          <option ${DATA_SERIALIZED}="null" selected>null</option>
          <option ${DATA_SERIALIZED}="123" selected>number</option>
          <option ${DATA_SERIALIZED}="false" selected>boolean</option>
          <option ${DATA_SERIALIZED}='"foo"' selected>string</option>
          <option ${DATA_SERIALIZED}='"foo-2"'>other string</option>
        </select>
      `)
      const value = jsf.get(page.querySelector('select'))
      expect(value).toEqual([null, 123, false, "foo"])
    })
  })
})
