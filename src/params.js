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
  { name: "depth", type: kTypes.Int, val: 1, min: 0 },
  { name: "scale", type: kTypes.Float, val: 1.0, min: 0.0, step: 0.1 },
  { name: "aspect", type: kTypes.FloatRange, l: 1.0, r: 1.3, min: 0, step: 0.1 },
  { name: "taper", type: kTypes.FloatRange, l: 0.7, r: 0.9, min: 0, max: 1.0, step: 0.1 },
  { name: "shrink", type: kTypes.FloatRange, l: 0.6, r: 0.8, min: 0, step: 0.1 },
  { name: "inset", type: kTypes.FloatRange, l: 0.3, r: 0.7, min: 0, step: 0.1 },
  { name: "cone", type: kTypes.FloatRange, l: -0.5, r: 0.5, min: -0.5, max: 0.5, step: 0.1 },
  { name: "sweep", type: kTypes.FloatRange, l: 0.0, r: 2.0, min: 0, max: 2.0, step: 0.1 },
  { name: "attitude", type: kTypes.FloatRange, l: -0.1, r: 0.1, min: -2.0, max: 2.0, step: 0.1 },
  { name: "roll", type: kTypes.FloatRange, l: -2.0, r: 2.0, min: -2.0, max: 2.0, step: 0.1 },
  { name: "children (count)", type: kTypes.IntRange, l: 4, r: 7, min: 0, step: 1 },
  { name: "children (decay)", type: kTypes.Int, val: 3, min: 0, step: 1 },
  { name: "emissive (intensity)", type: kTypes.Float, val: 1.0, min: 0, max: 1.0, step: 0.1 },
])

const kNumberInput = (name, val, p) => `
  <input
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
  ${kOptions.render(({ id, name, type, ...p }) => `
    ${rb(type == kTypes.Bool, () => `
      <div class="Field" data-name=${id}>
        <label
          for="${id}"
          class="Field-title"
        >
          ${name}
        </label>

        <div class="Field-line">
          <input
            id="${id}"
            class="Field-input"
            name="${id}"
            type="checkbox"
          >

          <p class="Field-prompt">${p.prompt}</p>
        </div>
      </div>
    `)}
    ${rb(type == kTypes.Int || type == kTypes.Float, () => `
      <div class="Field" data-name=${id}>
        <label
          for="${id}"
          class="Field-title"
        >
          ${name}
        </label>

        ${kNumberInput(id, p.val, p)}
      </div>
    `)}
    ${rb(type == kTypes.IntRange || type == kTypes.FloatRange, () => `
      <div class="Field" data-name=${id}>
        <label
          for="${id}"
          class="Field-title"
        >
          ${name}
        </label>

        <div class="Field-line">
          ${kNumberInput(id, p.l, p)}
          <a class="Field-prompt Field-rangeDivider"></a>
          ${kNumberInput(id, p.r, p)}
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

  // check for clicks on range dividers
  const $links = $mParams.querySelectorAll(".Field-rangeDivider")
  for (const $link of $links) {
    $link.addEventListener("click", didClickRangeDivider)
  }

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
      return getRange(
        getInt($inputs[0].value, dsc),
        getInt($inputs[1].value, dsc),
      )
    case kTypes.FloatRange:
      return getRange(
        getFloat($inputs[0].value, dsc),
        getFloat($inputs[1].value, dsc),
      )
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

function getRange(l, r) {
  return [Math.min(l, r), r]
}

// -- events --
function didClickRangeDivider(evt) {
  evt.preventDefault()

  // find the field
  let $field = evt.target
  while ($field != null && !$field.classList.contains("Field")) {
    $field = $field.parentElement
  }

  if ($field == null) {
    console.error("no field for this range divider!")
    return
  }

  // find the inputs
  const $inputs = $field.querySelectorAll("input")
  if ($inputs.length !== 2) {
    console.error("range did't have two inputs!")
    return
  }

  // set right input equal to left
  $inputs[1].value = $inputs[0].value
  $mParams.dispatchEvent(new InputEvent("input"))
}
