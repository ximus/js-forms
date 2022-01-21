import { isBlank, compact } from './util'


export const SERIALIZED = 'serialized'
export const DATA_SERIALIZED = `data-${SERIALIZED}`

export const parse = JSON.parse
export const dump = val => {
  if (val && val.constructor === FileList) {
    val = [...val].map(el => dump(el))
  }
  if (val && val.constructor === File) {
    val = file.path
  }
  return JSON.stringify(val)
}

// this reads off value off value holder (<option> or <input> but not <select>)
function getSingleDOMValue(target, valueHolder) {
  const { type, tagName } = target
  if (tagName === 'INPUT') {
    if (type === 'date') {
      return valueHolder.valueAsDate
    }
    if (type === 'number' || type === 'range') {
      return valueHolder.valueAsNumber
    }
    if (type === 'file') {
      return valueHolder.files[0] || null
    }
  }
  return valueHolder.value || null // null: empty string should just be null
}

function getValueHolder(target) {
  const { tagName } = target
  if (tagName === "SELECT") {
    return target.selectedOptions[0]
  }
  return target
}

// only applies to `multiple` selection inputs
function getSelectedValueHolders(target) {
  const { tagName, type } = target
  if (tagName === "SELECT") {
    return [...target.selectedOptions]
  }
  if (tagName === "INPUT" && type === 'checkbox') {
    const siblings = checkboxGetSiblings(target)
    return siblings.filter(cb => cb.checked)
  }
  throw new Error('invalid getSelectedValueHolders call')
}

// args are same as properties on a DOM Element
export function isValuePreDetermined({ tagName, type }) {
  return !(
    tagName === 'INPUT' && (
      type !== 'checkbox' &&
      type !== 'radio'
    ) ||
    tagName === 'TEXTAREA'
  )
}

// args are same as properties on a DOM Element
function isValueConditional({ tagName, type }) {
  return (
    tagName === 'INPUT' && (
      type === 'checkbox' ||
      type === 'radio'
    )
  )
}

function checkboxIsMultiple(checkbox) {
  return checkboxGetSiblings(checkbox).length > 1
}

// maybe your form isn't currently mounted on the dom, hence just getting the
function getFarthestParentOrBody(node) {
  let farthest = node.parentElement
  while (farthest) {
    const next = farthest.parentElement
    if (!next || farthest === document.body) {
      return farthest
    }
    farthest = next
  }
  return null
}

// PERF: this should be cached for each `get` invokation, it's called more than once
function checkboxGetSiblings(checkbox) {
  if (!checkbox.name) return []
  const scope = checkbox.closest('form') || getFarthestParentOrBody(checkbox)
  if (!scope) return [] // basically is not mounted in the dom *and* has no parent
  return [...scope.querySelectorAll(`input[type=checkbox][name="${checkbox.name}"]`)]
}

function hasMultipleValues(target) {
  const { type, tagName, multiple } = target
  return (
    (tagName === "SELECT" && multiple) ||
    (tagName === 'INPUT' && (
      (type === 'checkbox' && checkboxIsMultiple(target)) ||
      (type === 'file' && multiple) ||
      (type === 'email' && multiple)
    ))
  )
}

export function get(target) {
  if (hasMultipleValues(target)) {
    return getMultiple(target)
  }
  return getOne(target)
}

function getMultiple(target) {
  const { type } = target

  if (type === 'email') {
    return compact(target.value.split(','))
  }

  if (type === 'file') {
    return target.files
  }

  const out = []
  const valueHolders = getSelectedValueHolders(target)
  valueHolders.forEach(valueHolder => {
    const value = getOne(target, valueHolder);
    if (value !== undefined) {
      out.push(value)
    }
  })
  return out
}

function getOne(target, valueHolder = null) {
  valueHolder = valueHolder || getValueHolder(target)

  if (isValueConditional(target) && !valueHolder.checked) {
    return null
  }

  if (isValuePreDetermined(target)) {
    const serialized = valueHolder.dataset[SERIALIZED]

    if (serialized) {
      return parse(serialized)
    }
  }

  return getSingleDOMValue(target, valueHolder)
}
