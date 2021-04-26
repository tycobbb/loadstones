import * as T from "../lib/three@0.128.0.min.js"

// -- constants --
const kNumRocks = 2
const kNumFacesPerRock = 6

const kNumPosPerFace = 4
const kNumPosPerRock = kNumFacesPerRock * kNumPosPerFace
const kNumPos = kNumRocks * kNumPosPerRock

const kNumIndicesPerFace = 6
const kNumIndicesPerRock = kNumFacesPerRock * kNumIndicesPerFace
const kNumIndices = kNumRocks * kNumIndicesPerRock

// -- c/len
const kLenVertex = 3
const kLenVertexBuf = kNumPos * kLenVertex
const kLenNormal = 3
const kLenNormalBuf = kNumPos * kLenNormal
const kLenUv = 2
const kLenUvBuf = kNumPos * kLenUv

// -- props --
let mScene = null
let mRock = null
let mLen = 0

// -- lifetime --
export function init() {
  // init scene
  mScene = new T.Scene()
  mScene.background = new T.Color(0xaaffaa)

  // add light
  const light = new T.DirectionalLight(0xffffff, 1.0)
  mScene.add(light)

  // create rock buffers
  const geometry = new T.BufferGeometry()
  geometry.setIndex(new T.Uint32BufferAttribute(new Uint32Array(kNumIndices), 1))
  geometry.setAttribute("position", new T.Float32BufferAttribute(new Float32Array(kLenVertexBuf), kLenVertex))
  geometry.setAttribute("normal", new T.Float32BufferAttribute(new Float32Array(kLenNormalBuf), kLenNormal))
  geometry.setAttribute("uv", new T.Float32BufferAttribute(new Float32Array(kLenUvBuf), kLenUv))

  // add rock mesh to scene
  const material = new T.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xafaf00,
  })

  mRock = new T.Mesh(geometry, material)
  mRock.rotation.x = 0.5
  mRock.rotation.y = 0.5
  mScene.add(mRock)

  // update rock buffers
  addRock(0.0, 0.0)
  addRock(1.0, 0.0)

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
function addRock(x0, y0, w = 1.0, h = 1.0, d = 1.0) {
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

  // update the number of drawn indices
  mLen += 1

  // mark rock as invalid
  syncRock()

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
      const vs = mRock.geometry.attributes.position.array
      const iv = (mLen * kNumPosPerRock + nVerts + i) * kLenVertex
      vs[iv + 0] = v.x + x0
      vs[iv + 1] = v.y + y0
      vs[iv + 2] = v.z

      // set normal values to correct vector component
      v[vu] = 0
      v[vv] = 0
      v[vw] = d > 0 ? 1 : - 1

      // now apply vector to buffer
      const ns = mRock.geometry.attributes.normal.array
      const im = (mLen * kNumPosPerRock + nVerts + i) * kLenNormal
      ns[im + 0] = v.x
      ns[im + 1] = v.y
      ns[im + 2] = v.z

      // uvs
      const us = mRock.geometry.attributes.uv.array
      const iu = (mLen * kNumPosPerRock + nVerts + i) * kLenUv
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
    const is = mRock.geometry.index.array
    const ix = (mLen * kNumIndicesPerRock) + nIndices
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

function syncRock() {
  const g = mRock.geometry

  // update draw range to include new indices
  g.setDrawRange(0, mLen * kNumIndicesPerRock)

  // flag attribs as dirty
  g.index.needsUpdate = true
  g.attributes.position.needsUpdate = true
  g.attributes.normal.needsUpdate = true
  g.attributes.uv.needsUpdate = true

  // recompute bounding boxes
  g.computeBoundingBox()
  g.computeBoundingSphere()
}
