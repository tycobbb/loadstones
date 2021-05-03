import { loadEl } from "./load.js"
import { init as initScene } from "./scene.js"
import { init as initView } from "./view.js"
import { init as initColors } from "./colors.js"
import { init as initParams } from "./params.js"

// -- props -
let mTime = null
let mFrame = 0
let mIsPaused = false
let mIsDebug = false

// -- p/components
let mScene = null
let mView = null
let mColors = null
let mParams = null

// -- p/els
let $mMain = null

// -- lifetime --
function main() {
  console.debug("start")

  // capture els
  $mMain = document.getElementById("main")
  setTimeout(() => toggleUi(true))

  // initialize
  mScene = initScene()
  mView = initView("view", mScene)
  mColors = initColors()
  mParams = initParams()
  initEvents()

  // start loop
  loop()
}

// -- commands --
function loop() {
  if (!mIsPaused) {
    mTime = performance.now() / 1000
    mScene.sim()
    mView.draw()
    mFrame++
  }

  requestAnimationFrame(loop)
}

function syncParams(params) {
  mScene.setParams(params)
}

function syncColors(colors) {
  mScene.setColors(colors)
}

function toggleUi(isVisible) {
  $mMain.classList.toggle("is-ui-hidden", isVisible == null ? undefined : !isVisible)
}

// -- events --
function initEvents() {
  // synchronize data
  mParams.onChange(syncParams)
  mColors.onChange(syncColors)

  // add mouse events
  const $canvas = mView.ref
  $canvas.addEventListener("pointerdown", didPressMouse)
  $canvas.addEventListener("pointermove", didMoveMouse)
  $canvas.addEventListener("pointerup", didReleaseMouse)

  // add other input events
  document.addEventListener("wheel", didScrollWheel)
  document.addEventListener("keydown", didPressKey)

  // add misc events
  const $toggle = document.getElementById("toggle-ui")
  $toggle.addEventListener("click", didClickUiToggle)

  const $pause = document.getElementById("pause")
  $pause.addEventListener("click", didClickPause)

  const $debug = document.getElementById("debug")
  $debug.addEventListener("click", didClickDebug)
}

// -- e/mouse
let mGesture = null

function didPressMouse(evt) {
  mGesture = {
    mousePos: {
      x: evt.clientX,
      y: evt.clientY,
    },
  }
}

function didMoveMouse(evt) {
  if (mGesture == null) {
    return
  }

  const m0 = mGesture.mousePos
  const m1 = {
    x: evt.clientX,
    y: evt.clientY,
  }

  const tx = m1.x - m0.x
  mScene.rotate(tx)

  mGesture.mousePos = m1
}

function didReleaseMouse(evt) {
  mGesture = null
}

// -- e/inputs
function didScrollWheel(evt) {
  mView.zoom(evt.deltaY)
}

function didPressKey(evt) {
  if (evt.key === "r") {
    mScene.generate()
  }
}

// -- e/misc
function didClickUiToggle(_evt) {
  toggleUi()
}

function didClickPause(evt) {
  mIsPaused = !mIsPaused
  setButtonTitle(evt.currentTarget, mIsPaused ? "unpause" : "pause")
}

function didClickDebug(evt) {
  mIsDebug = !mIsDebug
  setButtonTitle(evt.currentTarget, mIsDebug ? "no debug" : "debug")
  mScene.setDebug(mIsDebug)
}

function setButtonTitle($el, title) {
  const $title = $el.querySelector(".Button-text")
  $title.innerText = title
}

// -- boostrap --
(async function load() {
  // wait for the window and all assets
  const [_w] = await Promise.all([
    loadEl(window),
  ])

  // then start
  main()
})()
