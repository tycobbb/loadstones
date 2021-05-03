// -- constants --
const kNonWordPattern = /\W+/g

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

  all() {
    return Object.values(this.options)
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
      if (item instanceof Object) {
        const id = Options.getId(item.name, i)
        options[id] = {
          id,
          ...item,
        }
      } else {
        options[i] = item
      }

      i++
    }

    return new Options(options)
  }

  static getId(name, i) {
    if (name == null) {
      return i
    }

    let id = name.replace(kNonWordPattern, "-")
    if (id.endsWith("-")) {
      id = id.slice(0, -1)
    }

    return id
  }
}
