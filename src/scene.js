import * as T from "../lib/three@0.128.0.min.js"
import { Rock } from "./Rock.js"
import { material } from "./material.js"

// -- props --
let mScene = null
let mRock = null
let mLight = null
let mParams = null
let mColors = null

// -- lifetime --
export function init() {
  // init scene
  mScene = new T.Scene()
  mScene.background = new T.Color(0xaaffaa)

  // add light
  mLight = new T.DirectionalLight(0xffffff, 1.0)
  mScene.add(mLight)

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
    setColors,
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

function setColors(colors) {
  mColors = colors

  const bg = mScene.background
  bg.setHex(colors.bg)

  const light = mLight.color
  light.setHex(colors.light)

  const mat = material()
  mat.setColor(colors.rock)
  mat.setEmissive(colors.emissive)
}

function regenerate() {
  mRock.generate()
}

// -- queries --
function ref() {
  return mScene
}
