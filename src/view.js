import * as T from "../lib/three@0.128.0.min.js"

// -- constants --
const kFov = 75
const kNearPlane = 0.1
const kFarPlane = 1000.0


// -- props --
let mScene = null
let mCamera = null
let mRenderer = null
let mCube = null

// -- p/elements
let $mEl = null

// -- lifetime --
export function init(id) {
  // set props
  $mEl = document.getElementById(id)
  if ($mEl == null) {
    console.error("failed to find view container")
    return false
  }

  const f = $mEl.getBoundingClientRect()
  const w = f.width
  const h = f.height

  mScene = new T.Scene()
  mCamera = new T.PerspectiveCamera(
    kFov,
    w / h,
    kNearPlane,
    kFarPlane,
  )

  mRenderer = new T.WebGLRenderer()
  mRenderer.setSize(w, h)

  $mEl.appendChild(mRenderer.domElement)

  const geometry = new T.BoxGeometry()
  const material = new T.MeshBasicMaterial({
    color: 0x00ff00
  })

  mCube = new T.Mesh(geometry, material)
  mScene.add(mCube)

  mCamera.position.z = 5

  return {
    sim,
    draw,
    getEl,
  }
}

// -- commands --
function sim() {
  mCube.rotation.x += 0.01;
  mCube.rotation.y += 0.01;
}

function draw() {
  mRenderer.render(mScene, mCamera)
}

// -- queries --
function getEl() {
  return $mEl
}
