import * as T from "../lib/three@0.128.0.min.js"
import { Slab } from "./slab.js"
import { rand, unlerp } from "./utils.js"

// -- tmp --
// -- t/rays
const ray = new T.Raycaster()
const pos = new T.Vector3()
const dir = new T.Vector3()

// -- t/misc
const vec = new T.Vector3()
const rot = new T.Quaternion()

// -- t/constant
const zero = new T.Vector3()

// -- impls --
export class Rock {
  // -- props --
  // group = null
  // params = null

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
    const rs = rock.genScale(vec, rock.params.scale)

    // get initial pos
    pos.copy(zero)
    pos.y += rs.y / 2 - 0.5

    // and start over
    rock.gen(
      0,
      new Slab(
        rock.genTaper(),
        pos,
        rs,
        zero,
        0.0,
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

    // gen child count
    const n = rock.genChildCount(depth)
    if (n === 0) {
      return
    }

    // gen n new slabs
    for (let i = 0; i < n; i++) {
      const outside = slab.scale.manhattanLength()

      // looking upwards
      dir.copy(slab.up)
      dir.applyQuaternion(slab.ref.quaternion)

      // move to a point below the slab
      pos.copy(slab.pos)
      pos.addScaledVector(dir, -outside)

      // and raycast to find the bottom
      const hb = rock.cast(pos, dir, slab)
      if (hb == null) {
        console.debug("couldn't find bottom of slab")
        continue
      }

      // now we'll start at the bottom of the slab
      pos.copy(hb.point)

      // looking in a random upwards, outwards direction
      dir.setFromSphericalCoords(
        outside,
        this.genCone() * Math.PI,
        this.genSweep() * Math.PI,
      )

      // move outside the slab in this direction
      pos.add(dir)

      // turn around to face the it
      dir.normalize().negate()

      // and cast a ray back into it
      const hf = rock.cast(pos, dir, slab)

      // this shouldn't miss, but don't crash if we do
      if (hf == null) {
        console.error("couldn't find a face casting back into the slab")
        continue
      }

      // get pos from hit location in rock space
      pos.copy(hf.point)
      pos.applyMatrix4(slab.ref.matrix)

      // get dir from normal in rock space
      dir.copy(hf.face.normal)
      dir.applyQuaternion(slab.ref.quaternion)

      // add some jitter the dir
      vec.setFromSphericalCoords(
        1.0,
        this.genAttitude() * Math.PI,
        unlerp(rand(), 0.0, 2.0) * Math.PI,
      )

      rot.setFromUnitVectors(T.Object3D.DefaultUp, vec)
      dir.applyQuaternion(rot)

      // gen child scale based on parent
      const ps = slab.scale
      const cs = this.genScale(
        vec,
        Math.min(ps.x, ps.y) * this.genShrink(),
      )

      // translate pos so child is flush w/ this face
      pos.addScaledVector(dir, cs.y * (0.5 - rock.genInset()))

      // generate the child slab
      rock.gen(
        depth + 1,
        new Slab(
          rock.genTaper(),
          pos,
          cs,
          dir,
          rock.genRoll(),
        )
      )
    }
  }

  clear() {
    const g = this.group

    for (const c of g.children) {
      const g = c.geometry
      if (g != null) {
        g.dispose()
      }
    }

    g.clear()
  }

  // -- c/helpers
  add(slab) {
    this.group.add(slab.ref)
  }

  cast(pos, dir, slab) {
    ray.set(pos, dir)
    return ray.intersectObject(slab.ref)[0]
  }

  addDebugArrow(pos, dir, len) {
    const slb = new T.ArrowHelper(
      dir,
      pos,
      len,
      0x000000,
    )

    this.group.add(slb)
  }

  // -- queries --
  get ref() {
    return this.group
  }

  get children() {
    return this.group.children
  }

  genAspect() {
    return unlerp(rand(), ...this.params.aspect)
  }

  genTaper() {
    return unlerp(rand(), ...this.params.taper)
  }

  genScale(v, base) {
    // gen aspect ratio
    const sx = base
    const sy = base * this.genAspect()

    // wrap it in the vector
    return v.set(sx, sy, sx)
  }

  genShrink() {
    return unlerp(rand(), ...this.params.shrink)
  }

  genInset() {
    return unlerp(rand(), ...this.params.inset)
  }

  genAttitude() {
    return unlerp(rand(), ...this.params.attitude)
  }

  genRoll() {
    return unlerp(rand(), ...this.params.roll)
  }

  genCone() {
    return unlerp(rand(), ...this.params.cone)
  }

  genSweep() {
    return unlerp(rand(), ...this.params.sweep)
  }

  genChildCount(level) {
    let count = unlerp(rand(), ...this.params["children-count"])
    count -= level * this.params["children-decay"]
    return Math.max(count, 0)
  }

  // -- config --
  setParams(params) {
    this.params = params
  }
}
