import { renderIntoDocument } from "./helpers.js";
import "../counter-display.js";

describe("components/counter-display", () => {
  it("should display nothing by default", () => {
    const { cleanup, shadowRoot } = renderIntoDocument("counter-display");
    expect(shadowRoot.querySelector("span").innerHTML).toEqual("");
    cleanup();
  });
  it("should display value passed via data attribute", () => {
    const { cleanup, shadowRoot } = renderIntoDocument("counter-display", {
      data: "foo"
    });
    expect(shadowRoot.querySelector("span").innerHTML).toEqual("foo");
    cleanup();
  });
  it("should update value passed via data attribute", () => {
    const { cleanup, shadowRoot, element } = renderIntoDocument(
      "counter-display",
      {
        data: "foo"
      }
    );
    expect(shadowRoot.querySelector("span").innerHTML).toEqual("foo");
    element.setAttribute("data", "bar");
    expect(shadowRoot.querySelector("span").innerHTML).toEqual("bar");
    cleanup();
  });
  it("should NOT update value passed via property", () => {
    const { cleanup, shadowRoot, element } = renderIntoDocument(
      "counter-display",
      {
        data: "foo"
      }
    );
    expect(shadowRoot.querySelector("span").innerHTML).toEqual("foo");
    element.data = "bar";
    expect(shadowRoot.querySelector("span").innerHTML).toEqual("foo");
    expect(element.getAttribute("data")).toEqual("foo");
    expect(element.data).toEqual("bar");
    cleanup();
  });
});
