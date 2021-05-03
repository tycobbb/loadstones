import * as T from "../lib/three@0.128.0.min.js"
import { debounce } from "./utils.js"

// -- constants --
const kFov = 75
const kNearPlane = 0.1
const kFarPlane = 1000.0
const kInitialZoom = 5.0
const kDirection = new T.Vector3(0.0, 2.0, 5.0).normalize()

// -- deps --
let mScene = null

// -- props --
let mCamera = null
let mRenderer = null
let mZoom = kInitialZoom

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

  // capture screen size
  const f = $mEl.getBoundingClientRect()
  const w = f.width
  const h = f.height

  // build camera
  mCamera = new T.PerspectiveCamera(
    kFov,
    w / h,
    kNearPlane,
    kFarPlane,
  )

  // position camera
  zoom(0.0)

  // create renderer
  mRenderer = new T.WebGLRenderer()
  mRenderer.setSize(w, h)
  mRenderer.shadowMap.enabled = true
  mRenderer.shadowMap.type = T.PCFSoftShadowMap

  // add to dom
  $mEl.appendChild(mRenderer.domElement)

  return {
    get ref() { return $mEl },
    draw,
    zoom,
  }
}

// -- commands --
function draw() {
  mRenderer.render(mScene.ref, mCamera)
}

function zoom(translation) {
  mZoom += translation * 0.01
  if (mZoom < 0.0) {
    mZoom = 0.0
  }

  const pos = mCamera.position
  pos.setScalar(0.0)
  pos.addScaledVector(kDirection, mZoom)

  mCamera.lookAt(0.0, 0.5 + (mZoom / kInitialZoom - 1.0), 0.0)
}
