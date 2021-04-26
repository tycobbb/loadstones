import * as T from "../lib/three@0.128.0.min.js"

// -- constants --
const kNumFaces = 6
const kNumVertices = kNumFaces * 4
const kNumIndices = kNumFaces * 6

// -- c/len
const kLenVertex = 3
const kLenNormal = 3
const kLenUv = 2

// -- props --
let mScene = null
let mBuffers = null
let mRock = null
let mLength = kNumVertices

// -- lifetime --
export function init() {
  // init props
  mBuffers = initBuffers()

  // init scene
  mScene = new T.Scene()
  mScene.background = new T.Color(0xaaffaa)

  // add light
  const light = new T.DirectionalLight(0xffffff, 1.0)
  mScene.add(light)

  // create rock geometry
  addRock()
  const geometry = new T.BufferGeometry()
  geometry.setIndex(new T.Uint32BufferAttribute(mBuffers.indices, 1))
  geometry.setAttribute("position", new T.Float32BufferAttribute(mBuffers.vertices, kLenVertex))
  geometry.setAttribute("normal", new T.Float32BufferAttribute(mBuffers.normals, kLenNormal))
  geometry.setAttribute("uv", new T.Float32BufferAttribute(mBuffers.uvs, kLenUv))

  // add rock
  const material = new T.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xafaf00,
  })

  mRock = new T.Mesh(geometry, material)
  mRock.rotation.x = 0.5
  mRock.rotation.y = 0.5

  mScene.add(mRock)

  // export module
  return {
    ref,
    sim,
  }
}

// -- commands --
function sim() {
  mRock.rotation.y += 0.005
}

// -- queries --
function ref() {
  return mScene
}

// -- factories --
function initBuffers() {
  return {
    indices: new Uint32Array(kNumIndices),
    vertices: new Float32Array(kNumVertices * kLenVertex),
    normals: new Float32Array(kNumVertices * kLenNormal),
    uvs: new Float32Array(kNumVertices * kLenUv),
  }
}

function addRock(w = 1.0, h = 1.0, d = 1.0) {
  // helper variables
  let nVerts = 0
  let nIndices = 0

  // build each side of the box geometry
  initPlane("z", "y", "x", -1, -1, d, h, w, 0) // px
  initPlane("z", "y", "x", +1, -1, d, h, -w, 1) // nx
  initPlane("x", "z", "y", +1, +1, w, d, h, 2) // py
  initPlane("x", "z", "y", +1, -1, w, d, -h, 3) // ny
  initPlane("x", "y", "z", +1, -1, w, h, d, 4) // pz
  initPlane("x", "y", "z", -1, -1, w, h, -d, 5) // nz

  // build geometry
  function initPlane(vu, vv, vw, vudir, vvdir, w, h, d, materialIndex) {
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
      const vs = mBuffers.vertices
      const iv = (nVerts + i) * kLenVertex
      vs[iv + 0] = v.x
      vs[iv + 1] = v.y
      vs[iv + 2] = v.z

      // set normal values to correct vector component
      v[vu] = 0
      v[vv] = 0
      v[vw] = d > 0 ? 1 : - 1

      // now apply vector to buffer
      const ns = mBuffers.normals
      const im = (nVerts + i) * kLenNormal
      ns[im + 0] = v.x
      ns[im + 1] = v.y
      ns[im + 2] = v.z

      // uvs
      const us = mBuffers.uvs
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
    const is = mBuffers.indices
    const ix = nIndices
    is[ix + 0] = ia
    is[ix + 1] = ib
    is[ix + 2] = id
    is[ix + 3] = ib
    is[ix + 4] = ic
    is[ix + 5] = id

    // add a group to the geometry. this will ensure multi material support
    // scope.addGroup(nIndices, 6, materialIndex)

    // calculate new start value for groups
    nIndices += 6

    // update total number of vertices
    nVerts += 4
  }
}
