export function isBlank(val) {
  return val === null || val === undefined || val === ""
}

export function compact(array) {
  const out = [];
  array.forEach(el => {
    if (!isBlank()) {
      out.push(el)
    }
  })
  return out
}
