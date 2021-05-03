import * as T from "../lib/three@0.128.0.min.js"
import { material } from "./material.js"

// -- impls --
export class Slab {
  // -- props --
  // the backing mesh, access this through `ref`
  mesh = null

  // -- lifetime --
  constructor(
    taper,
    pos,
    scale,
    dir,
    roll,
  ) {
    // build geometry
    const geometry = new SlabGeometry(taper)

    // build mesh
    const mesh = new T.Mesh(geometry, material().ref)
    mesh.position.copy(pos)
    mesh.scale.copy(scale)
    mesh.quaternion.setFromUnitVectors(mesh.up, dir)
    mesh.rotateOnAxis(mesh.up, roll)
    mesh.updateMatrix()

    // add mesh shadows
    mesh.castShadow = true
    mesh.receiveShadow = true

    // store mesh
    this.mesh = mesh
  }

  // -- queries --
  get ref() {
    return this.mesh
  }

  get up() {
    return this.mesh.up
  }

  get pos() {
    return this.mesh.position
  }

  get scl() {
    return this.mesh.scale
  }
}

// -- i/geometry
class SlabGeometry extends T.BufferGeometry {
  // -- lifetime --
  constructor(taper) {
    super()

    // create geometry
    const h0 = 1.0 / 2
    const l0 = 1.0 / 2
    const l1 = l0 * taper

    // make a cuboid from these eight points that allows for
    // different top and bottom areas
    //
    //      d ---- c
    //    / |    / |
    //  a ----- b  |
    //  |   h --|- g
    //  | /     | /
    //  e ----- f
    //

    const a = new T.Vector3(-l1, h0, l1)
    const b = new T.Vector3(l1, h0, l1)
    const c = new T.Vector3(l1, h0, -l1)
    const d = new T.Vector3(-l1, h0, -l1)

    const e = new T.Vector3(-l0, -h0, l0)
    const f = new T.Vector3(l0, -h0, l0)
    const g = new T.Vector3(l0, -h0, -l0)
    const h = new T.Vector3(-l0, -h0, -l0)

    this.setFromPoints([
      // bottom
      e, h, g,
      g, f, e,

      // left
      h, e, a,
      a, d, h,

      // front
      a, e, b,
      b, e, f,

      // right
      b, f, c,
      c, f, g,

      // back
      c, g, h,
      h, d, c,

      // top
      d, a, c,
      c, a, b,
    ])

    this.computeVertexNormals()
  }
}
