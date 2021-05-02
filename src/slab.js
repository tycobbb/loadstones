import * as T from "../lib/three@0.128.0.min.js"
import { material } from "./material.js"

// -- constants --
const kNumFacesPerRock = 6
const kNumPosPerFace = 4
const kNumPos = kNumFacesPerRock * kNumPosPerFace
const kNumIndicesPerFace = 6
const kNumIndices = kNumFacesPerRock * kNumIndicesPerFace

// -- c/len
const kLenVertex = 3
const kLenVertexBuf = kNumPos * kLenVertex
const kLenNormal = 3
const kLenNormalBuf = kNumPos * kLenNormal
const kLenUv = 2
const kLenUvBuf = kNumPos * kLenUv

// -- impls --
export class Slab {
  // -- props --
  // the backing mesh, access this through `ref`
  mesh = null

  // -- lifetime --
  constructor(
    px, py, pz,
    sw, sh,
    ax, ay, az,
  ) {
    // create geometry
    const geometry = new SlabGeometry(0.0, 0.0)

    // build mesh
    const mesh = new T.Mesh(geometry, material().ref())
    mesh.position.set(px, py, pz)
    mesh.scale.set(sw, sh, sw)
    mesh.rotation.set(ax, ay, az)

    // add mesh shadows
    mesh.castShadow = true
    mesh.receiveShadow = true

    // store mesh
    this.mesh = mesh
  }

  // -- queries --
  get pos() {
    return this.mesh.position
  }

  get scl() {
    return this.mesh.scale
  }

  get ref() {
    return this.mesh
  }
}

// -- i/geometry
class SlabGeometry extends T.BufferGeometry {
  // -- lifetime --
  constructor() {
    super()

    // allocate buffers
    const g = this
    g.setIndex(new T.Uint32BufferAttribute(new Uint32Array(kNumIndices), 1))
    g.setAttribute("position", new T.Float32BufferAttribute(new Float32Array(kLenVertexBuf), kLenVertex))
    g.setAttribute("normal", new T.Float32BufferAttribute(new Float32Array(kLenNormalBuf), kLenNormal))
    g.setAttribute("uv", new T.Float32BufferAttribute(new Float32Array(kLenUvBuf), kLenUv))

    // generate slab
    g.generate()
  }

  // -- commands --
  generate(w = 1.0, h = 1.0, d = 1.0) {
    // helper variables
    let nVerts = 0
    let nIndices = 0

    // capture this ref
    const thiz = this

    // build each side of the box geometry
    initFace("z", "y", "x", -1, -1, d, h, w, 0) // px
    initFace("z", "y", "x", +1, -1, d, h, -w, 1) // nx
    initFace("x", "z", "y", +1, +1, w, d, h, 2) // py
    initFace("x", "z", "y", +1, -1, w, d, -h, 3) // ny
    initFace("x", "y", "z", +1, -1, w, h, d, 4) // pz
    initFace("x", "y", "z", -1, -1, w, h, -d, 5) // nz

    // build geometry
    function initFace(vu, vv, vw, vudir, vvdir, w, h, d, im) {
      const w2 = w / 2
      const h2 = h / 2
      const d2 = d / 2

      const v = new T.Vector3()

      // generate vertices, normals and uvs
      for (let i = 0; i < 4; i++) {
        const ix = i % 2
        const iy = Math.floor(i / 2)

        const x = ix * w - w2
        const y = iy * h - h2

        // set vert values to correct vector component
        v[vu] = x * vudir
        v[vv] = y * vvdir
        v[vw] = d2

        // and apply it to buffer
        const vs = thiz.attributes.position.array
        const iv = (nVerts + i) * kLenVertex
        vs[iv + 0] = v.x
        vs[iv + 1] = v.y
        vs[iv + 2] = v.z

        // set normal values to correct vector component
        v[vu] = 0
        v[vv] = 0
        v[vw] = d > 0 ? 1 : - 1

        // now apply vector to buffer
        const ns = thiz.attributes.normal.array
        const im = (nVerts + i) * kLenNormal
        ns[im + 0] = v.x
        ns[im + 1] = v.y
        ns[im + 2] = v.z

        // uvs
        const us = thiz.attributes.uv.array
        const iu = (nVerts + i) * kLenUv
        us[iu + 0] = ix
        us[iu + 1] = 1 - iy
      }

      // indices
      // 1. you need three indices to draw a single face
      // 2. a single segment consists of two faces
      // 3. so we need to generate six (2*3) indices per segment
      const ia = nVerts
      const ib = nVerts + 2
      const ic = nVerts + 3
      const id = nVerts + 1

      // faces
      const is = thiz.index.array
      const ix = nIndices
      is[ix + 0] = ia
      is[ix + 1] = ib
      is[ix + 2] = id
      is[ix + 3] = ib
      is[ix + 4] = ic
      is[ix + 5] = id

      // add a group to the geometry. this will ensure multi material support
      thiz.addGroup(nIndices, kNumIndicesPerFace, im)

      // calculate new start value for groups
      nIndices += kNumIndicesPerFace

      // update total number of vertices
      nVerts += kNumPosPerFace
    }
  }
}
