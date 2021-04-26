import * as T from "../lib/three@0.128.0.min.js"
import { Rock } from "./Rock.js"

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

  // add rock to scene
  mRock = new Rock()
  mRock.generate()

  // add root object to scene
  root().rotation.x = 0.5
  root().rotation.y = 0.5
  mScene.add(root())

  // export module
  return {
    ref,
    sim,
  }
}

// -- commands --
function sim() {
  root().rotation.y += 0.005
}

// -- queries --
function root() {
  return mRock.ref()
}

// -- queries --
function ref() {
  return mScene
}
