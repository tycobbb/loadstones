import { rb, ro } from "./utils.js"

// -- impls --
export class Menu {
  // -- constants --
  static Types = {
    Bool: 0,
    Int: 1,
    Float: 2,
    IntRange: 3,
    FloatRange: 4,
  }

  // -- props --
  options = null

  // -- p/elements
  $el = null
  $fields = null

  // -- lifetime --
  constructor(id, options) {
    const m = this

    // store props
    m.options = options

    // render select
    m.$el = document.getElementById(id)
    m.$el.innerHTML = m.render(options)

    // check for clicks on range dividers
    const $links = m.$el.querySelectorAll(".Field-rangeDivider")
    for (const $link of $links) {
      $link.addEventListener("click", m.didClickRangeDivider)
    }

    // cache input
    m.$fields = m.$el.querySelectorAll(".Field")
  }

  // -- l/render
  render() {
    const m = this
    const T = Menu.Types

    return `
      ${m.options.render(({ id, name, type, ...p }) => `
        ${rb(type == T.Bool, () => `
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
        ${rb(type == T.Int || type == T.Float, () => `
          <div class="Field" data-name=${id}>
            <label
              for="${id}"
              class="Field-title"
            >
              ${name}
            </label>

            ${m.renderNumberInput(id, p.val, p)}
          </div>
        `)}
        ${rb(type == T.IntRange || type == T.FloatRange, () => `
          <div class="Field" data-name=${id}>
            <label
              for="${id}"
              class="Field-title"
            >
              ${name}
            </label>

            <div class="Field-line">
              ${m.renderNumberInput(id, p.l, p)}
              <a class="Field-prompt Field-rangeDivider"></a>
              ${m.renderNumberInput(id, p.r, p)}
            </div>
          </div>
        `)}
      `)}
    `
  }

  renderNumberInput(id, val, p) {
    return `
      <input
        class="Field-input"
        name="${id}"
        type="number"
        value=${val}
        ${ro(p.min, (v) => `min=${v}`)}
        ${ro(p.max, (v) => `max=${v}`)}
        ${ro(p.step, (v) => `step=${v}`)}
      >
    `
  }

  // -- commands --
  onChange(action) {
    const m = this
    action(m.getData())

    m.$el.addEventListener("input", () => {
      action(m.getData())
    })
  }

  // -- queries --
  getData() {
    const m = this
    const data = {}

    // roll up inputs
    for (const $field of m.$fields) {
      const key = $field.dataset.name
      const dsc = m.options.get(key)
      data[key] = m.getDataFromField($field, dsc)
    }

    return data
  }

  getDataFromField($field, dsc) {
    const m = this
    const T = Menu.Types
    const $inputs = $field.querySelectorAll("input")

    switch (dsc.type) {
      case T.Bool:
        return $inputs[0].checked
      case T.Int:
        return m.getInt(
          $inputs[0].value, dsc
        )
      case T.Float:
        return m.getFloat(
          $inputs[0].value, dsc
        )
      case T.IntRange:
        return m.getRange(
          m.getInt($inputs[0].value, dsc),
          m.getInt($inputs[1].value, dsc),
        )
      case T.FloatRange:
        return m.getRange(
          m.getFloat($inputs[0].value, dsc),
          m.getFloat($inputs[1].value, dsc),
        )
    }
  }

  getInt(str, dsc) {
    const m = this
    return Math.trunc(m.getFloat(str, dsc))
  }

  getFloat(str, dsc) {
    let val = Number.parseFloat(str) || 0.0
    let min = dsc.min || Number.MIN_VALUE
    let max = dsc.max || Number.MAX_VALUE
    return Math.min(Math.max(val, min), max)
  }

  getRange(l, r) {
    return [Math.min(l, r), r]
  }

  // -- events --
  didClickRangeDivider(evt) {
    const m = this

    // stop default link action
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
    m.$el.dispatchEvent(new InputEvent("input"))
  }
}
