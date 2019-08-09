/**
 *
 * @param {String} tag
 * @param {Object} attributes
 * @param {Object} properties
 *
 * Example:
 *
 * const [cleanup, shadowRoot, elm] = renderIntoDocument("counter-display", {foo: "hello"}, {bar: "world"});
 */
export const renderIntoDocument = (tag, attributes = {}, properties = {}) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  Object.entries(properties).forEach(([key, value]) => {
    element[key] = value;
  });
  // need to append to body to trigger `connectedCallback`
  document.body.append(element);
  return {
    cleanup: () => {
      document.body.removeChild(element); // cleanup function
    },
    shadowRoot: element.shadowRoot,
    element
  };
};
