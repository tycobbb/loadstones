import { Options } from "./options.js"
import { getIntFromHex } from "./utils.js"

// -- constants --
const kColors = Options.parse([
  "#aaffaa",
  "#ff00ff",
  "#afaf00",
  "#ffffff",
])

const kOptions = Options.parse([
  { name: "bg", value: 0 },
  { name: "rock", value: 1 },
  { name: "emissive", value: 2 },
  { name: "light", value: 3 },
])

const kTemplate = kOptions.render(({ name, value }) => `
  <div class="ColorPicker Field" name="${name}">
    <p class="Field-title">
      ${name}
    </p>

    <div class="Select Field-input">
      <select class="Select-input">
        ${kColors.render((color, i) => `
          <option
            value="${i}"
            style="color: ${getStyleHex(color)};"
            ${i === value ? "selected" : ""}
          >
            ${color}
          </option>
        `)}

        <option
          class="ColorPicker-customOption"
          value="custom"
          style="color: black;"
        >
          custom
        </option>
      </select>
    </div>

    <input
      class="ColorPicker-custom"
      type="color"
      name="color"
      value="#000000"
    >
  </div>
`)

// -- props --
let $mColors = null

// -- lifetime --
export function init() {
  // render color pickers
  $mColors = document.getElementById("colors")
  $mColors.innerHTML = kTemplate

  // init pickers
  for (const $el of $mColors.children) {
    // set initial value
    setPickerColor($el, $el.querySelector("select").value)
    // add events
    $el.addEventListener("input", didClickOption)
  }

  // export
  return {
    onChange
  }
}

// -- commands --
function onChange(action) {
  action(getColors())

  $mColors.addEventListener("input", () => {
    action(getColors())
  })
}

function setPickerColor($el, color) {
  const hex = getColorHex($el, color)
  const value = getColorValue(color)
  const isCustom = value === "custom"

  // set current value
  $el.setAttribute("color", hex)

  // update select value, color
  const $select = $el.querySelector(".Select-input")
  $select.value = value
  $select.style.color = $el.getAttribute("name") !== "bg" ? getStyleHex(hex) : "black"

  // update custom option color
  const $option = $select.querySelector(".ColorPicker-customOption")
  $option.style.color = isCustom ? getStyleHex(hex) : "black"

  // show custom picker if necessary
  $el.classList.toggle("is-custom", isCustom)
}

// -- queries --
function getColors() {
  const colors = {}

  for (const $el of Array.from($mColors.children)) {
    colors[$el.getAttribute("name")] = getIntFromHex($el.getAttribute("color"))
  }

  return colors
}

function getColorHex($el, color) {
  const i = Number.parseInt(color)
  if (!Number.isNaN(i)) {
    return kColors.get(i)
  } else if (color === "custom") {
    return $el.querySelector(".ColorPicker-custom").value
  } else {
    return color
  }
}

function getColorValue(color) {
  if (!Number.isNaN(Number.parseInt(color))) {
    return color
  } else {
    return "custom"
  }
}

function getStyleHex(hex) {
  if (hex === "#ffffff") {
    return "black"
  } else {
    return hex
  }
}

// -- events --
function didClickOption(evt) {
  const $el = evt.currentTarget
  const $select = evt.target
  setPickerColor($el, $select.value)
}
