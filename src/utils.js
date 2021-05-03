// -- impls --
export function rand() {
  return Math.random()
}

export function unlerp(val, min, max) {
  return min + val * (max - min)
}

// -- i/fns
export function debounce(action, delay) {
  let id = null

  return function debounced(...args) {
    clearTimeout(id)

    id = setTimeout(() => {
      id = null
      action(...args)
    }, delay)
  }
}

// -- i/rendering
export function rs(value) {
  return value ? value : ""
}

export function rb(test, template) {
  return rs(test && template())
}

export function ro(optional, template) {
  return rs(optional != null && template(optional))
}

// -- i/color
export function getIntFromHex(hex) {
  let str = hex
  if (hex[0] === "#") {
    str = str.slice(1)
  }

  return Number.parseInt(str, 16)
}

export function getRgbaFromHex(hex) {
  const val = getIntFromHex(hex)
  return [
    ((val & 0xFF0000) >> 16) / 255.0,
    ((val & 0x00FF00) >> 8) / 255.0,
    ((val & 0x0000FF) >> 0) / 255.0,
    1
  ]
}

// -- i/equality
// deep-ish equality check
export function equalish(l, r) {
  for (const key in l) {
    const li = l[key]
    const ri = r[key]

    if (li instanceof Object) {
      if (!equalish(li, ri)) {
        return false
      }
    } else if (li !== ri) {
      return false
    }
  }

  return true
}
