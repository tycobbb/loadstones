import { Options } from "./options.js"

// -- constants --
const kTypes = {
  Int: 0,
}

const kOptions = Options.parse([
  { name: "levels", type: kTypes.Int, min: 0 },
])

const kTemplate = `
  ${kOptions.render(({ name, type, min }) => `
    ${type == kTypes.Int && `
      <div class="Field">
        <label for="${name}" class="Field-title">${name}</label>
        <input id="${name}" class="Field-input" name="${name}" type="number" min="${min}">
      </div>
    `}
  `)}
`

// -- props --
let $mParams = null
let $mInputs = null

// -- lifetime --
export function init() {
  // render select
  $mParams = document.getElementById("params")
  $mParams.innerHTML = kTemplate

  // cache input
  $mInputs = $mParams.querySelectorAll("input")

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
  for (const $el of $mInputs) {
    const key = $el.name
    const val = $el.value

    const dsc = kOptions.get(key)
    switch (dsc.type) {
      case kTypes.Int:
        data[key] = Math.max(Number.parseInt(val) || 0, dsc.min); break
    }
  }

  return data
}
