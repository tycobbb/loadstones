import { Options } from "./options.js"
import { Menu } from "./menu.js"

// -- constants --
const T = Menu.Types

// -- lifetime --
export function init() {
  return new Menu("params", Options.parse([
    { name: "depth", type: T.Int, val: 1, min: 0 },
    { name: "scale", type: T.Float, val: 1.0, min: 0.0, step: 0.1 },
    { name: "aspect", type: T.FloatRange, l: 1.0, r: 1.3, min: 0, step: 0.1 },
    { name: "taper", type: T.FloatRange, l: 0.7, r: 0.9, min: 0, max: 1.0, step: 0.1 },
    { name: "shrink", type: T.FloatRange, l: 0.6, r: 0.8, min: 0, step: 0.1 },
    { name: "inset", type: T.FloatRange, l: 0.3, r: 0.7, min: 0, step: 0.1 },
    { name: "cone", type: T.FloatRange, l: -0.5, r: 0.5, min: -0.5, max: 0.5, step: 0.1 },
    { name: "sweep", type: T.FloatRange, l: 0.0, r: 2.0, min: 0, max: 2.0, step: 0.1 },
    { name: "attitude", type: T.FloatRange, l: -0.1, r: 0.1, min: -2.0, max: 2.0, step: 0.1 },
    { name: "roll", type: T.FloatRange, l: -2.0, r: 2.0, min: -2.0, max: 2.0, step: 0.1 },
    { name: "children (count)", type: T.IntRange, l: 4, r: 7, min: 0, step: 1 },
    { name: "children (decay)", type: T.Int, val: 3, min: 0, step: 1 },
  ]))
}
