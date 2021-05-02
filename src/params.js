import { render } from "./utils.js"
import { Options } from "./options.js"

// -- constants --
const kTypes = {
  Bool: 0,
  Int: 1,
}

const kOptions = Options.parse([
  { name: "debug", type: kTypes.Bool, prompt: "enabled?" },
  { name: "levels", type: kTypes.Int, min: 0 },
])

const kTemplate = `
  ${kOptions.render(({ name, type, ...p }) => `
    ${render(type == kTypes.Bool && `
      <div class="Field">
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
    ${render(type == kTypes.Int && `
      <div class="Field">
        <label
          for="${name}"
          class="Field-title"
        >
          ${name}
        </label>

        <input
          id="${name}"
          class="Field-input"
          name="${name}"
          type="number"
          min="${p.min}"
        >
      </div>
    `)}
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
      case kTypes.Bool:
        data[key] = $el.checked; break
      case kTypes.Int:
        data[key] = Math.max(Number.parseInt(val) || 0, dsc.min); break
    }
  }

  return data
}
