import * as T from "../lib/three@0.128.0.min.js"
import { Rock } from "./rock.js"
import { Floor } from "./floor.js"
import { material } from "./material.js"
import { equalish } from "./utils.js"

// -- props --
let mScene = null
let mFloor = null
let mRock = null
let mLight = null
let mParams = null
let mColors = null
let mHelpers = []

// -- lifetime --
export function init() {
  // init scene
  mScene = new T.Scene()
  mScene.background = new T.Color(0xaaffaa)

  // add light
  mLight = new T.DirectionalLight(0xffffff, 1.0)
  mLight.position.set(3.0, 2.0, 2.0)
  mLight.lookAt(0.0, 0.0, 0.0)
  mLight.castShadow = true
  mScene.add(mLight)

  // add a floor plane
  mFloor = new Floor()
  mScene.add(mFloor.ref)

  // add rock to scene
  mRock = new Rock()
  mRock.ref.rotation.y = 0.5
  mScene.add(mRock.ref)

  // add helpers, invisible by default
  addHelpers()

  // export module
  return {
    ref,
    sim,
    generate,
    rotate,
    setParams,
    setColors,
    setDebug,
  }
}

// -- commands --
function sim() {
  mRock.ref.rotation.y -= 0.005
}

function generate() {
  mRock.generate()
}

function rotate(translation) {
  mScene.rotation.y += translation * 0.01
}

function setParams({ emission, ...params }) {
  // update params
  const prev = mParams
  mParams = params

  // set emissivity
  setEmission(emission)

  // regenerate rock if necessary
  if (prev == null || !equalish(prev, mParams)) {
    mRock.setParams(mParams)
    generate()
  }
}

function setColors(colors) {
  mColors = colors

  const bg = mScene.background
  bg.setHex(colors.bg)

  const floor = mFloor.ref.material
  floor.color.setHex(colors.bg)
  floor.emissive.setHex(colors.bg)

  const light = mLight.color
  light.setHex(colors.light)

  const mat = material().ref
  mat.color.setHex(colors.rock)
  mat.emissive.setHex(colors.emissive)
}

function setEmission(emission) {
  const mat = material().ref
  mat.emissiveIntensity = emission
}

// -- c/debug
export function setDebug(isDebug) {
  for (const helper of mHelpers) {
    helper.visible = isDebug
  }
}

function addHelpers() {
  addHelper(new T.DirectionalLightHelper(mLight))
}

function addHelper(helper) {
  helper.visible = false
  mHelpers.push(helper)
  mScene.add(helper)
}

// -- queries --
function ref() {
  return mScene
}
