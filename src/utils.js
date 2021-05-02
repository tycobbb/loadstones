// -- impls --
// deep-ish equality check
export function equalish(l, r) {
  for (const key in l) {
    const li = l[key]
    const ri = r[key]

    if (li instanceof Object && !equalish(li, ri)) {
      return false
    } else if (li !== ri) {
      return false
    }
  }

  return true
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

// -- i/lerps
export function unlerp(val, min, max) {
  return min + val * (max - min)
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
