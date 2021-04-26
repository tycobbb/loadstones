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
    const g = this.group
    g.add(new Slab(0.0, 0.0, 0.0).ref())
    g.add(new Slab(0.5, 0.5, -0.25).ref())
    g.add(new Slab(-0.5, 0.75, 0.25).ref())
  }

  // -- queries --
  ref() {
    return this.group
  }
}
