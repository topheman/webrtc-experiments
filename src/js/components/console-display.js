class ConsoleDisplay extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    const ul = document.createElement("ul");
    const div = document.createElement("div");
    const header = document.createElement("span");
    header.textContent = "Logs";
    header.className = "header";
    header.addEventListener(
      "click",
      () => {
        const rootDivClassList = this.shadowRoot.querySelector("div").classList;
        rootDivClassList.toggle("slidedown");
        rootDivClassList.toggle("slideup");
      },
      false
    );
    div.className = "slidedown";
    div.appendChild(header);
    div.appendChild(ul);
    style.textContent = `
:host {
  --border-color: grey;
}
.header {
  padding: 5px;
  border: 1px solid var(--border-color);
  border-bottom: 0px;
  display: block;
  cursor: pointer;
}
.slideup .header:after {
  content: " 🔽";
}
.slidedown .header:after {
  content: " 🔼";
}
ul {
  list-style: none;
  padding-left: 0;
  margin-top: 0;
  width: 100%;
  overflow-x: scroll;
  border-bottom: 1px solid var(--border-color);
}
li {
  padding-left: 5px;
  white-space: nowrap;
  border: 1px solid var(--border-color);
  border-bottom: 0px;
  border-top: 0px;
}
li.two {
  background: #f1f1f1;
}
li.three {
  background: lightgray;
}
li.warn {
  background: lightyellow;
}
li.info::before {
  content: "ℹ️"
}
li.warn::before {
  content: "⚠️"
}
li.log::before {
  content: "📋"
}
.slideup ul, .slidedown ul {
    max-height: 0;            
    overflow-y: hidden;
    -webkit-transition: max-height 0.5s ease-in-out;
    -moz-transition: max-height 0.5s ease-in-out;
    -o-transition: max-height 0.5s ease-in-out;
    transition: max-height 0.5s ease-in-out;
}
.slidedown ul {            
    max-height: 1000px ;                    
}
    `;
    shadow.appendChild(style);
    shadow.appendChild(div);
    this.render();
  }

  static get observedAttributes() {
    return ["data"];
  }

  /**
   * Accept a `data` attribute with a serialized object
   * `data` attribute is not kept in sync with `data` property
   * for performance reasons (to avoid large object serialization)
   */

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal !== newVal) {
      if (attrName === "data") {
        try {
          const data = JSON.parse(newVal);
          this._data = data;
        } catch (e) {
          console.error(
            "Failed to parse `data` attribute in `errors-display` element",
            e
          );
        }
      }
      this.render();
    }
  }

  get data() {
    return this._data;
  }
  set data(newVal) {
    this._data = newVal;
    this.render();
  }

  render() {
    const ul = this.shadowRoot.querySelector("ul");
    const content = (this._data || [])
      .map(line => {
        return `<li class="${line.level} ${
          line.key % 3 === 1 ? "two" : line.key % 3 === 2 ? "three" : ""
        }">${
          typeof line.payload === "object"
            ? JSON.stringify(line.payload)
            : line.payload
        }</li>`;
      })
      .join("");
    ul.innerHTML = content;
  }
}

customElements.define("console-display", ConsoleDisplay);
