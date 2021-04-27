// -- impls --
export class Options {
  //-- lifetime --
  constructor(options) {
    this.options = options
  }

  // -- queries --
  get(key) {
    return this.options[key]
  }

  render(action) {
    return Object.values(this.options).map(action).join("")
  }

  // -- factories --
  static parse(args) {
    if (!Array.isArray(args)) {
      return new Options(args)
    }

    const options = {}

    let i = 0
    for (const item of args) {
      options[item.name || i] = item
      i++
    }

    return new Options(options)
  }
}
