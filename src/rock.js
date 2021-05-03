import * as T from "../lib/three@0.128.0.min.js"
import { Slab } from "./slab.js"
import { rand, unlerp } from "./utils.js"

// -- impls --
export class Rock {
  // -- props --
  group = null
  params = null

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

    // get initial scale
    const s = rock.params.scale

    // and start over
    rock.gen(
      0,
      new Slab(
        rock.genTaper(),
        0.0, 0.0, 0.0,
        s, s,
        0.0, 0.0, 0.0,
      )
    )
  }

  gen(depth, slab) {
    const rock = this

    // add this slab
    rock.add(slab)

    // bottom out
    if (depth == rock.params.depth) {
      return
    }

    // raycast points on the slab surface to generate children
    const ray = new T.Raycaster()
    const pos = new T.Vector3()
    const dir = new T.Vector3()

    // gen child count
    const n = rock.genChildCount(depth)
    if (n === 0) {
      return
    }

    // gen n new slabs
    for (let i = 0; i < n; i++) {
      // start inside the slab
      pos.copy(slab.pos)

      // pick a random upwards, outwards ray
      dir.setFromSphericalCoords(
        // a distance outside the slab
        20.0,
        // anywhere on the unit circle
        unlerp(rand(), 0.0, 2 * Math.PI),
        // in the upper hemisphere
        unlerp(rand(), -Math.PI, Math.PI),
      )

      // project to a point outside the slab
      pos.add(dir)

      // point back towards the slab
      dir.normalize().negate()

      // and cast a ray into the slab
      ray.set(pos, dir)
      const hit = ray.intersectObject(slab.ref)[0]

      // this shouldn't miss, but don't crash if we do
      if (hit == null) {
        continue
      }

      // get hit location, normal
      const p = hit.point
      const a = hit.face.normal

      // gen child scale based on parent
      const cs = rock.genChildScale(slab)

      // generate the child slab
      rock.gen(
        depth + 1,
        new Slab(
          rock.genTaper(),
          p.x, p.y, p.z,
          cs, cs,
          a.x, a.y, a.z,
        )
      )
    }
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
    return unlerp(rand(), ...this.params.taper)
  }

  genChildCount(level) {
    let count = unlerp(rand(), ...this.params["child-count"])
    count -= level * this.params["child-decay"]
    return Math.max(count, 0)
  }

  genChildScale(slab) {
    const scale = unlerp(rand(), ...this.params["child-shrink"])
    return slab.scl.x * scale
  }

  // -- config --
  setParams(params) {
    this.params = params
  }
}
