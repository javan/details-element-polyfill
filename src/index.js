import support from "./support"
import styles from "./styles"

const { forEach, slice } = []

if (!support.open) {
  polyfillStyles()
  polyfillProperties()
  polyfillToggle()
  polyfillAccessibility()
}

if (support.open && !support.toggle) {
  polyfillToggleEvent()
}

function polyfillStyles() {
  document.head.insertAdjacentHTML("afterbegin", `<style>${styles}</style>`)
}

function polyfillProperties() {
  const { prototype } = document.createElement("details").constructor
  const { setAttribute, removeAttribute } = prototype
  const open = Object.getOwnPropertyDescriptor(prototype, "open")

  Object.defineProperties(prototype, {
    open: {
      get() {
        if (this.tagName == "DETAILS") {
          return this.hasAttribute("open")
        } else {
          if (open && open.get) {
            return open.get.call(this)
          }
        }
      },
      set(value) {
        if (this.tagName == "DETAILS") {
          return value
            ? this.setAttribute("open", "")
            : this.removeAttribute("open")
        } else {
          if (open && open.set) {
            return open.set.call(this, value)
          }
        }
      }
    },
    setAttribute: {
      value(name, value) {
        const call = () => setAttribute.call(this, name, value)
        if (name == "open" && this.tagName == "DETAILS") {
          const wasOpen = this.hasAttribute("open")
          const result = call()
          if (!wasOpen) {
            const summary = this.querySelector("summary")
            if (summary) summary.setAttribute("aria-expanded", true)
            triggerToggle(this)
          }
          return result
        }
        return call()
      }
    },
    removeAttribute: {
      value(name) {
        const call = () => removeAttribute.call(this, name)
        if (name == "open" && this.tagName == "DETAILS") {
          const wasOpen = this.hasAttribute("open")
          const result = call()
          if (wasOpen) {
            const summary = this.querySelector("summary")
            if (summary) summary.setAttribute("aria-expanded", false)
            triggerToggle(this)
          }
          return result
        }
        return call()
      }
    }
  })
}

function polyfillToggle() {
  onTogglingTrigger(element => {
    element.hasAttribute("open")
      ? element.removeAttribute("open")
      : element.setAttribute("open", "")
  })
}

function polyfillToggleEvent() {
  if (window.MutationObserver) {
    new MutationObserver(mutations => {
      forEach.call(mutations, mutation => {
        const { target, attributeName } = mutation
        if (target.tagName == "DETAILS" && attributeName == "open") {
          triggerToggle(target)
        }
      })
    }).observe(document.documentElement, {
      attributes: true,
      subtree: true
    })
  } else {
    onTogglingTrigger(element => {
      const wasOpen = element.getAttribute("open")
      setTimeout(() => {
        const isOpen = element.getAttribute("open")
        if (wasOpen != isOpen) {
          triggerToggle(element)
        }
      }, 1)
    })
  }
}

function polyfillAccessibility() {
  setAccessibilityAttributes(document)
  if (window.MutationObserver) {
    new MutationObserver(mutations => {
      forEach.call(mutations, mutation => {
        forEach.call(mutation.addedNodes, setAccessibilityAttributes)
      })
    }).observe(document.documentElement, {
      subtree: true,
      childList: true
    })
  } else {
    document.addEventListener("DOMNodeInserted", event => {
      setAccessibilityAttributes(event.target)
    })
  }
}

function setAccessibilityAttributes(root) {
  findElementsWithTagName(root, "SUMMARY").forEach(summary => {
    const details = findClosestElementWithTagName(summary, "DETAILS")
    summary.setAttribute("aria-expanded", details.hasAttribute("open"))
    if (!summary.hasAttribute("tabindex"))
      summary.setAttribute("tabindex", "0")
    if (!summary.hasAttribute("role"))
      summary.setAttribute("role", "button")
  })
}

function eventIsSignificant(event) {
  return !(
    event.defaultPrevented ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.target.isContentEditable
  )
}

function onTogglingTrigger(callback) {
  addEventListener("click", event => {
    if (eventIsSignificant(event)) {
      if (event.which <= 1) {
        const element = findClosestElementWithTagName(event.target, "SUMMARY")
        if (element && element.parentNode && element.parentNode.tagName == "DETAILS") {
          callback(element.parentNode)
        }
      }
    }
  }, false)

  addEventListener("keydown", event => {
    if (eventIsSignificant(event)) {
      if (event.keyCode == 13 || event.keyCode == 32) {
        const element = findClosestElementWithTagName(event.target, "SUMMARY")
        if (element && element.parentNode && element.parentNode.tagName == "DETAILS") {
          callback(element.parentNode)
          event.preventDefault() // Prevent pagedown from space key
        }
      }
    }
  }, false)
}

function triggerToggle(element) {
  const event = document.createEvent("Event")
  event.initEvent("toggle", false, false)
  element.dispatchEvent(event)
}

function findElementsWithTagName(root, tagName) {
  return (
    root.tagName == tagName
      ? [root]
      : []
  ).concat(
    typeof root.getElementsByTagName == "function"
      ? slice.call(root.getElementsByTagName(tagName))
      : []
  )
}

function findClosestElementWithTagName(element, tagName) {
  if (typeof element.closest == "function") {
    return element.closest(tagName)
  } else {
    while (element) {
      if (element.tagName == tagName) {
        return element
      } else {
        element = element.parentNode
      }
    }
  }
}
