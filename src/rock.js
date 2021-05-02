import * as T from "../lib/three@0.128.0.min.js"
import { Slab } from "./slab.js"
import { unlerp } from "./utils.js"

// -- impls --
export class Rock {
  // -- props --
  group = null
  depth = 0
  taper = [1.0, 1.0]

  // -- lifetime --
  constructor() {
    // build group
    const group = new T.Group()

    // add shadows
    group.castShadow = true
    group.receiveShadow = true

    // store group
    this.group = group
  }

  // -- commands --
  generate() {
    const rock = this

    // clear any extant slabs
    rock.clear()

    // and start over
    rock.gen(
      0,
      new Slab(
        rock.genTaper(),
        0.0, 0.0, 0.0,
        1.0, 1.0,
        0.0, 0.0, 0.0,
      )
    )
  }

  gen(depth, slab) {
    const rock = this

    // add this slab
    rock.add(slab)

    // bottom out
    if (depth == rock.depth) {
      return
    }

    // grab parent attrs
    const pp = slab.pos
    const ps = slab.scl

    // calc parent top, edge
    const pt = pp.y + ps.y * 0.5
    console.log(pp.x)

    // calc child scale
    const csx = ps.x * 0.5
    const csy = ps.y * 0.5

    // calc child top, edge
    const ct = pt + csy * 0.5

    rock.gen(
      depth + 1,
      new Slab(
        rock.genTaper(),
        pp.x, ct, pp.x,
        csx, csy,
        Math.PI / 8 * Math.random(), 2 * Math.PI * Math.random(), Math.PI / 8 * Math.random(),
      )
    )
  }

  clear() {
    const g = this.group

    for (const c of g.children) {
      c.geometry.dispose()
    }

    g.clear()
  }

  // -- c/helpers
  add(slab) {
    this.group.add(slab.ref)
  }

  // -- queries --
  get ref() {
    return this.group
  }

  genTaper() {
    return unlerp(Math.random(), ...this.taper)
  }

  // -- config --
  setDepth(depth) {
    this.depth = depth || 0
  }

  setTaper(taper) {
    this.taper = taper || [1.0, 1.0]
  }

  setColors(colors) {
    this.colors = colors
  }
}
