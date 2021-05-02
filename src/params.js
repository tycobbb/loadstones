import { rb, ro } from "./utils.js"
import { Options } from "./options.js"

// -- constants --
const kTypes = {
  Bool: 0,
  Int: 1,
  Float: 2,
  IntRange: 3,
  FloatRange: 4,
}

const kOptions = Options.parse([
  { name: "debug", type: kTypes.Bool, prompt: "enabled?" },
  { name: "levels", type: kTypes.Int, val: 0, min: 0 },
  { name: "taper", type: kTypes.FloatRange, l: 0.7, r: 0.9, min: 0, max: 1.0, step: 0.01 },
])

const kNumberInput = (name, val, p) => `
  <input
    id="${name}"
    class="Field-input"
    name="${name}"
    type="number"
    value=${val}
    ${ro(p.min, (v) => `min=${v}`)}
    ${ro(p.max, (v) => `max=${v}`)}
    ${ro(p.step, (v) => `step=${v}`)}
  >
`

const kTemplate = `
  ${kOptions.render(({ name, type, ...p }) => `
    ${rb(type == kTypes.Bool, () => `
      <div class="Field" data-name=${name}>
        <label
          for="${name}"
          class="Field-title"
        >
          ${name}
        </label>

        <div class="Field-line">
          <input
            id="${name}"
            class="Field-input"
            name="${name}"
            type="checkbox"
          >

          <p class="Field-prompt">${p.prompt}</p>
        </div>
      </div>
    `)}
    ${rb(type == kTypes.Int || type == kTypes.Float, () => `
      <div class="Field" data-name=${name}>
        <label
          for="${name}"
          class="Field-title"
        >
          ${name}
        </label>

        ${kNumberInput(name, p.val, p)}
      </div>
    `)}
    ${rb(type == kTypes.IntRange || type == kTypes.FloatRange, () => `
      <div class="Field" data-name=${name}>
        <label
          for="${name}"
          class="Field-title"
        >
          ${name}
        </label>

        <div class="Field-line">
          ${kNumberInput(name, p.l, p)}
          <p class="Field-divider">...</p>
          ${kNumberInput(name, p.r, p)}
        </div>
      </div>
    `)}
  `)}
`

// -- props --
let $mParams = null
let $mFields = null

// -- lifetime --
export function init() {
  // render select
  $mParams = document.getElementById("params")
  $mParams.innerHTML = kTemplate

  // cache input
  $mFields = $mParams.querySelectorAll(".Field")

  return {
    onChange
  }
}

// -- commands --
function onChange(action) {
  action(getData())

  $mParams.addEventListener("input", () => {
    action(getData())
  })
}

// -- queries --
function getData() {
  const data = {}

  // roll up inputs
  for (const $field of $mFields) {
    const key = $field.dataset.name
    const dsc = kOptions.get(key)
    data[key] = getDataFromField($field, dsc)
  }

  return data
}

function getDataFromField($field, dsc) {
  const $inputs = $field.querySelectorAll("input")

  switch (dsc.type) {
    case kTypes.Bool:
      return $inputs[0].checked
    case kTypes.Int:
      return getInt(
        $inputs[0].value, dsc
      )
    case kTypes.Float:
      return getFloat(
        $inputs[0].value, dsc
      )
    case kTypes.IntRange:
      return [
        getInt($inputs[0].value, dsc),
        getInt($inputs[1].value, dsc),
      ]
    case kTypes.FloatRange:
      return [
        getFloat($inputs[0].value, dsc),
        getFloat($inputs[1].value, dsc),
      ]
  }
}

function getInt(str, dsc) {
  return Math.trunc(getFloat(str, dsc))
}

function getFloat(str, dsc) {
  let val = Number.parseFloat(str) || 0.0
  let min = dsc.min || Number.MIN_VALUE
  let max = dsc.max || Number.MAX_VALUE
  return Math.min(Math.max(val, min), max)
}
