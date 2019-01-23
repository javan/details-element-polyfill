import "./setup"
import { DYNAMIC_HTML } from "./fixtures"
import "../src/index"
const { module, test } = QUnit

const detailsElementIsNative = typeof HTMLDetailsElement != "undefined"

module("<details>", {
  beforeEach() {
    document.body.insertAdjacentHTML("beforeend", DYNAMIC_HTML)
  },
  afterEach() {
    document.body.removeChild(document.getElementById("container"))
  }
})

test("displays summary and hides content initially", (assert) => {
  const done = assert.async()
  defer(() => {
    assert.notEqual(getElement("summary").offsetHeight, 0)
    assert.equal(getElement("content").offsetHeight, 0)
    done()
  })
})

test(`<summary id="static-summary"> is focusable`, (assert) => {
  const done = assert.async()
  const summary = getElement("static-summary")
  defer(() => {
    if (!detailsElementIsNative) {
      assert.ok(summary.hasAttribute("tabindex"))
      assert.ok(summary.hasAttribute("role"))
    }
    summary.focus()
    assert.equal(document.activeElement, summary)
    done()
  })
})

test(`<summary id="summary"> is focusable`, (assert) => {
  const done = assert.async()
  const summary = getElement("summary")
  defer(() => {
    if (!detailsElementIsNative) {
      assert.ok(summary.hasAttribute("tabindex"))
      assert.ok(summary.hasAttribute("role"))
    }
    summary.focus()
    assert.equal(document.activeElement, summary)
    done()
  })
})

test("open property toggles content", (assert) => {
  const done = assert.async()

  const element = getElement("details")
  const summary = getElement("summary")
  const content = getElement("content")

  let toggleEventCount = 0
  element.addEventListener("toggle", () => toggleEventCount++)

  defer(() => {
    element.open = true
    defer(() => {
      assert.equal(toggleEventCount, 1)
      assert.notEqual(content.offsetHeight, 0)
      assert.ok(element.hasAttribute("open"))
      assert.ok(element.open)
      if (!detailsElementIsNative) {
        assert.equal(summary.getAttribute("aria-expanded"), "true")
      }

      element.open = false
      defer(() => {
        assert.equal(content.offsetHeight, 0)
        assert.notOk(element.hasAttribute("open"))
        assert.notOk(element.open)
        if (!detailsElementIsNative) {
          assert.equal(summary.getAttribute("aria-expanded"), "false")
        }
        defer(() => {
          assert.equal(toggleEventCount, 2)
          done()
        })
      })
    })
  })
})

test("open attribute toggles content", (assert) => {
  const done = assert.async()

  const element = getElement("details")
  const summary = getElement("summary")
  const content = getElement("content")

  let toggleEventCount = 0
  element.addEventListener("toggle", () => toggleEventCount++)

  defer(() => {
    element.setAttribute("open", "")
    defer(() => {
      assert.equal(toggleEventCount, 1)
      assert.notEqual(content.offsetHeight, 0)
      if (!detailsElementIsNative) {
        assert.equal(summary.getAttribute("aria-expanded"), "true")
      }

      element.removeAttribute("open")
      defer(() => {
        assert.equal(toggleEventCount, 2)
        assert.equal(content.offsetHeight, 0)
        if (!detailsElementIsNative) {
          assert.equal(summary.getAttribute("aria-expanded"), "false")
        }
        done()
      })
    })
  })
})

test("click <summary> toggles content", (assert) => {
  const done = assert.async()

  const element = getElement("details")
  const summary = getElement("summary")
  const content = getElement("content")

  let toggleEventCount = 0
  element.addEventListener("toggle", () => toggleEventCount++)

  defer(() =>
    clickElement(summary, function() {
      assert.equal(toggleEventCount, 1)
      assert.notEqual(content.offsetHeight, 0)
      assert.ok(element.hasAttribute("open"))
      if (!detailsElementIsNative) {
        assert.equal(summary.getAttribute("aria-expanded"), "true")
      }

      clickElement(summary, function() {
        assert.equal(toggleEventCount, 2)
        assert.equal(content.offsetHeight, 0)
        assert.notOk(element.hasAttribute("open"))
        if (!detailsElementIsNative) {
          assert.equal(summary.getAttribute("aria-expanded"), "false")
        }
        done()
      })
    })
  )
})

test("click <summary> child toggles content", (assert) => {
  const done = assert.async()

  const element = getElement("details")
  const summary = getElement("summary")
  const content = getElement("content")

  const summaryChild = document.createElement("span")
  summary.appendChild(summaryChild)

  let toggleEventCount = 0
  element.addEventListener("toggle", () => toggleEventCount++)

  defer(() =>
    clickElement(summaryChild, function() {
      assert.equal(toggleEventCount, 1)
      assert.notEqual(content.offsetHeight, 0)
      assert.ok(element.hasAttribute("open"))
      if (!detailsElementIsNative) {
        assert.equal(summary.getAttribute("aria-expanded"), "true")
      }

      clickElement(summaryChild, function() {
        assert.equal(toggleEventCount, 2)
        assert.equal(content.offsetHeight, 0)
        assert.notOk(element.hasAttribute("open"))
        if (!detailsElementIsNative) {
          assert.equal(summary.getAttribute("aria-expanded"), "false")
        }
        done()
      })
    })
  )
})

test("toggle event does not bubble", (assert) => {
  const done = assert.async()

  const container = getElement("container")
  const element = getElement("details")

  let toggleEventCount = 0
  element.addEventListener("toggle", () => toggleEventCount++)

  let bubbledToggleEventCount = 0
  container.addEventListener("toggle", () => bubbledToggleEventCount++)

  element.open = true
  defer(() => {
    assert.equal(toggleEventCount, 1)
    assert.equal(bubbledToggleEventCount, 0)

    element.open = false
    defer(() => {
      assert.equal(toggleEventCount, 2)
      assert.equal(bubbledToggleEventCount, 0)
      done()
    })
  })
})

function getElement(id) {
  return document.getElementById(id)
}

function defer(callback) {
  setTimeout(callback, 30)
}

function clickElement(element, callback) {
  let event
  try {
    event = new MouseEvent("click", { view: window, bubbles: true, cancelable: true })
  } catch (error) {
    event = document.createEvent("MouseEvents")
    event.initEvent("click", true, true)
  }
  element.dispatchEvent(event)
  defer(callback)
}
