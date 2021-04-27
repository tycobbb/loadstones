import { loadEl } from "./load.js"
import { init as initScene } from "./scene.js"
import { init as initView } from "./view.js"
import { init as initColors } from "./colors.js"
import { init as initParams } from "./params.js"

// -- props -
let mTime = null
let mFrame = 0
let mIsPaused = false

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

function syncColors(theme) {
}

function toggleUi(isVisible) {
  $mMain.classList.toggle("is-ui-hidden", isVisible === null ? undefined : !isVisible)
}

// -- events --
function initEvents() {
  // synchronize data
  mParams.onChange(syncParams)
  mColors.onChange(syncColors)

  // add mouse events
  const $canvas = mView.ref()
  $canvas.addEventListener("click", didClickMouse)
  $canvas.addEventListener("mousemove", didMoveMouse)

  // add keyboard events
  document.addEventListener("keydown", didPressKey)

  // add misc events
  const $toggle = document.getElementById("toggle-ui")
  $toggle.addEventListener("click", didClickUiToggle)

  const $pause = document.getElementById("pause")
  $pause.addEventListener("click", didClickPause)
}

// -- e/mouse
function didClickMouse(evt) {
  console.debug(`[input] clicked`)
}

function didMoveMouse(evt) {
}

// -- e/keyboard
function didPressKey(evt) {
  console.debug(`[input] pressed ${evt.key}`)
}

// -- e/misc
function didClickUiToggle(_evt) {
  $mMain.classList.toggleUi()
}

function didClickPause(evt) {
  mIsPaused = !mIsPaused
  const $el = evt.target
  $el.text = mIsPaused ? "unpause" : "pause"
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
