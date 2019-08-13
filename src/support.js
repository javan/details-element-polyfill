const element = document.createElement("details")
const elementIsNative = typeof HTMLDetailsElement != "undefined" && element instanceof HTMLDetailsElement

export default {
  open: "open" in element || elementIsNative,
  toggle: "ontoggle" in element
}
