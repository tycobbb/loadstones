import * as T from "../lib/three@0.128.0.min.js"

// -- impls --
export class Floor {
  // -- props --
  // the backing mesh, access this through `ref`
  // mesh = null

  // -- lifetime --
  constructor() {
    // create geometry
    const geometry = new T.PlaneGeometry(30.0, 30.0)
    const material = new T.MeshStandardMaterial({
      color: 0xaaffaa,
      emissive: 0xaaffaa,
      emissiveIntensity: 0.5,
    })

    // build mesh
    const mesh = new T.Mesh(geometry, material)
    mesh.position.set(0.0, -0.5, 0.0)
    mesh.rotation.set(-Math.PI / 2, +0.0, 0.0)

    // add mesh shadows
    mesh.castShadow = false
    mesh.receiveShadow = true

    // store mesh
    this.mesh = mesh
  }

  // -- queries --
  get ref() {
    return this.mesh
  }
}
