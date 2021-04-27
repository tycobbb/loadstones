import * as T from "../lib/three@0.128.0.min.js"
import { Rock } from "./Rock.js"

// -- props --
let mScene = null
let mRock = null
let mParams = null

// -- lifetime --
export function init() {
  // init scene
  mScene = new T.Scene()
  mScene.background = new T.Color(0xaaffaa)

  // add light
  const light = new T.DirectionalLight(0xffffff, 1.0)
  mScene.add(light)

  // add rock to scene
  mRock = new Rock()

  // add root object to scene
  mRock.ref.rotation.x = 0.5
  mRock.ref.rotation.y = 0.5
  mScene.add(mRock.ref)

  // export module
  return {
    ref,
    sim,
    setParams,
  }
}

// -- commands --
function sim() {
  mRock.ref.rotation.y += 0.005
}

function setParams(params) {
  mParams = params
  mRock.setDepth(params.levels)
  regenerate()
}

function regenerate() {
  mRock.generate()
}

// -- queries --
function ref() {
  return mScene
}
