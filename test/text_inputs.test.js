describe("text inputs", () => {
  test("it reads a number as a string value", () => {
    const page = jsdom.fragment('<input type="text" value="123">')
    const value = jsf.get(page.querySelector('input'))
    expect(value).toEqual("123")
  })

  test("it reads a string as a string value", () => {
    const page = jsdom.fragment('<input type="text" value="badaba">')
    const value = jsf.get(page.querySelector('input'))
    expect(value).toEqual("badaba")
  })
})
