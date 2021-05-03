import { Options } from "./options.js"
import { Menu, Types } from "./menu.js"

// -- props --
let mMenu = null

// -- lifetime --
export function init() {
  if (mMenu != null) {
    return mMenu
  }

  // set props
  mMenu = new Menu("more",
    Options.parse([{
      name: "emissive (intensity)",
      type: Types.Float,
      val: 1.0, min: 0, max: 1.0, step: 0.1
    }])
  )

  return mMenu
}
