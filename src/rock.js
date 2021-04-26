import * as T from "../lib/three@0.128.0.min.js"
import { Slab } from "./slab.js"

// -- impls --
export class Rock {
  // -- props --
  group = null

  // -- lifetime --
  constructor() {
    this.group = new T.Group()
  }

  // -- commands --
  generate() {
    const rock = this

    rock.gen(
      0,
      new Slab(
        0.0, 0.0, 0.0,
        1.0, 1.0,
      )
    )
  }

  gen(depth, slab) {
    const rock = this

    // add this slab
    rock.add(slab)

    // bottom out
    if (depth == 2) {
      return
    }

    // calc some parent attributes
    const pp = slab.pos
    const sp = slab.scl

    // top, edge mag
    const pt = pp.y + sp.y * 0.5
    const pe = pp.x + sp.x * 0.5

    // generate some children
    const scx = sp.x * 0.5
    const scy = sp.y * 0.5

    const spx = pt + scx * 0.5
    const spy = pe + scy * 0.5

    rock.gen(
      depth + 1,
      new Slab(
        pe - scx * 0.5, pt + scy * 0.5, scx * 0.5 - pe,
        scx, scy,
      )
    )

    rock.gen(
      depth + 1,
      new Slab(
        scx * 0.5 - pe, pt + scy * 0.5, pe - scx * 0.5,
        scx, scy,
      )
    )
  }

  // -- c/helpers
  add(slab) {
    this.group.add(slab.ref)
  }

  // -- queries --
  get ref() {
    return this.group
  }
}
