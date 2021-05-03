import { Options } from "./options.js"
import { Menu } from "./menu.js"

// -- constants --
const T = Menu.Types

// -- lifetime --
export function init() {
  return new Menu("more", Options.parse([
    { name: "emissive (intensity)", type: T.Float, val: 1.0, min: 0, max: 1.0, step: 0.1 },
  ]))
}
