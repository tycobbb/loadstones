import * as T from "../lib/three@0.128.0.min.js"

// -- constants --
const kNumPos = 4

// -- props --
let mScene = null
let mRock = null
let mLength = kNumPos

// -- lifetime --
export function init() {
  mScene = new T.Scene()

  // set background
  mScene.background = new T.Color(0x050505)

  // add light
  const light = new T.DirectionalLight(0xffffff, 1.0)
  mScene.add(light)

  // create rock geometry
  const buffers = initBuffers()
  const geometry = new T.BufferGeometry()
  geometry.setIndex(buffers.indices)
  geometry.setAttribute("position", new T.Float32BufferAttribute(buffers.vertices, 3))
  geometry.setAttribute("normal", new T.Float32BufferAttribute(buffers.normals, 3))
  geometry.setAttribute("uv", new T.Float32BufferAttribute(buffers.uvs, 2))

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
  // mRock.rotation.x += 0.01
  // mRock.rotation.y += 0.01
}

// -- queries --
function ref() {
  return mScene
}

// -- factories --
function initBuffers(w = 1.0, h = 1.0, d = 1.0) {
  // buffers
  const indices = []
  const vertices = []
  const normals = []
  const uvs = []

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
    for (let iy = 0; iy < 2; iy++) {
      const y = iy * h - h2

      for (let ix = 0; ix < 2; ix++) {
        const x = ix * w - w2

        // set values to correct vector component
        v[vu] = x * vudir
        v[vv] = y * vvdir
        v[vw] = d2

        // now apply vector to vertex buffer
        vertices.push(v.x, v.y, v.z)

        // set values to correct vector component
        v[vu] = 0
        v[vv] = 0
        v[vw] = d > 0 ? 1 : - 1

        // now apply vector to normal buffer
        normals.push(v.x, v.y, v.z)

        // uvs
        uvs.push(ix)
        uvs.push(1 - iy)
      }
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
    indices.push(ia, ib, id)
    indices.push(ib, ic, id)

    // add a group to the geometry. this will ensure multi material support
    // scope.addGroup(nIndices, 6, materialIndex)

    // calculate new start value for groups
    nIndices += 6

    // update total number of vertices
    nVerts += 4
  }

  return {
    indices,
    vertices,
    normals,
    uvs,
  }
}
