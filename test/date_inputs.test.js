describe("date inputs", () => {
  test("it reads blank as a null value", () => {
    const page = jsdom.fragment('<input type="date">')
    const value = jsf.get(page.querySelector('input'))
    expect(value).toEqual(null)
  })

  test("it reads date as a Date value", () => {
    const page = jsdom.fragment('<input type="date" value="2018-09-27">')
    const value = jsf.get(page.querySelector('input'))
    expect(value).toEqual(new Date("2018-09-27"))
  })
})
