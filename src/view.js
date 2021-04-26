import * as T from "../lib/three@0.128.0.min.js"

// -- constants --
const kFov = 75
const kNearPlane = 0.1
const kFarPlane = 1000.0

// -- deps --
let mScene = null

// -- props --
let mCamera = null
let mRenderer = null

// -- p/elements
let $mEl = null

// -- lifetime --
export function init(id, scene) {
  // store deps
  mScene = scene

  // set props
  $mEl = document.getElementById(id)
  if ($mEl == null) {
    console.error("failed to find view container")
    return false
  }

  const f = $mEl.getBoundingClientRect()
  const w = f.width
  const h = f.height

  mCamera = new T.PerspectiveCamera(
    kFov,
    w / h,
    kNearPlane,
    kFarPlane,
  )

  mRenderer = new T.WebGLRenderer()
  mRenderer.setSize(w, h)

  $mEl.appendChild(mRenderer.domElement)

  mCamera.position.z = 5

  return {
    ref,
    draw,
  }
}

// -- commands --
function draw() {
  mRenderer.render(mScene.ref(), mCamera)
}

// -- queries --
function ref() {
  return $mEl
}
