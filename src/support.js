const element = document.createElement("details")
element.innerHTML = "<summary>a</summary>b"
element.setAttribute("style", "position: absolute; left: -9999px")

export default {
  open: "open" in element && elementExpands(),
  toggle: "ontoggle" in element
}

function elementExpands() {
  (document.body || document.documentElement).appendChild(element)

  const closedHeight = element.offsetHeight
  element.open = true
  const openedHeight = element.offsetHeight

  element.parentNode.removeChild(element)
  return closedHeight != openedHeight
}
