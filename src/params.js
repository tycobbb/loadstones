import { Options } from "./options.js"
import { Menu } from "./menu.js"

// -- constants --
const T = Menu.Types

// -- props --
let mMenu = null

// -- lifetime --
export function init() {
  if (mMenu != null) {
    return mMenu
  }

  // set props
  mMenu = new Menu("params",
    Options.parse([{
      name: "depth",
      type: T.Int,
      val: 1, min: 0,
      clear: 0,
    }, {
      name: "scale",
      type: T.Float,
      val: 1.0, min: 0.0, step: 0.1,
    }, {
      name: "aspect",
      type: T.FloatRange,
      val: [1.0, 1.3], min: 0, step: 0.1,
      clear: [1.0, 1.0]
    }, {
      name: "taper",
      type: T.FloatRange,
      val: [0.7, 0.9], min: 0, max: 1.0, step: 0.1,
      clear: [1.0, 1.0]
    }, {
      name: "shrink",
      type: T.FloatRange,
      val: [0.6, 0.8], min: 0, step: 0.1,
      clear: [0.9, 0.9],
    }, {
      name: "inset",
      type: T.FloatRange,
      val: [0.3, 0.7], min: 0, step: 0.1,
      clear: [0.0, 0.0],
    }, {
      name: "cone",
      type: T.FloatRange,
      val: [-0.5, 0.5], min: -0.5, max: 0.5, step: 0.1,
      clear: [0.0, 0.0],
    }, {
      name: "sweep",
      type: T.FloatRange,
      val: [0.0, 2.0], min: 0, max: 2.0, step: 0.1,
    }, {
      name: "attitude",
      type: T.FloatRange,
      val: [-0.1, 0.1], min: -2.0, max: 2.0, step: 0.1,
      clear: [0.0, 0.0],
    }, {
      name: "roll",
      type: T.FloatRange,
      val: [-2.0, 2.0], min: -2.0, max: 2.0, step: 0.1,
      clear: [0.0, 0.0],
    }, {
      name: "children (count)",
      type: T.IntRange,
      val: [4, 7], min: 0, step: 1,
      clear: [1, 1],
    }, {
      name: "children (decay)",
      type: T.Int,
      val: 3, min: 0, step: 1,
      clear: 0,
    }])
  )

  return mMenu
}
