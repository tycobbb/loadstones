import * as T from "../lib/three@0.128.0.min.js"

// -- props --
let mMaterial = null
let mInstance = null

// -- lifetime --
export function material() {
  if (mInstance != null) {
    return mInstance
  }

  // set props
  mMaterial = new T.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xafaf00,
    emissiveIntensity: 1.0,
  })

  mInstance = {
    get ref() { return mMaterial },
  }

  return mInstance
}
