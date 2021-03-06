import { getRemoteNameFromSessionStorage, isLocalIp } from "./common.js";
import { isDisconnected } from "./remote.js";
import "./components/errors-display.js";
import "./components/console-display.js";
import "./components/footer-display.js";

export function createView(templateNode, staticContent, store, events) {
  const content = document.createElement("div");
  content.appendChild(templateNode);
  content.querySelector(".static-content-wrapper").appendChild(staticContent);
  const loader = content.querySelector(".initial-loading");
  const errorsDisplay = content.querySelector("errors-display");
  const formInput = content.querySelector(".form-set-name input");
  const formButton = content.querySelector(".form-set-name button");
  const buttons = content.querySelectorAll(".counter-control button");
  formInput.value = getRemoteNameFromSessionStorage();
  const consoleDisplay = content.querySelector("console-display");
  const footerDisplay = content.querySelector("footer-display");
  footerDisplay.setAttribute("to", new Date().getFullYear());
  // event delegation
  content.addEventListener(
    "click",
    e => {
      if (e.target.classList.contains("counter-control-add")) {
        events.incrementCounter();
        return;
      }
      if (e.target.classList.contains("counter-control-sub")) {
        events.decrementCounter();
        return;
      }
    },
    false
  );
  content.addEventListener(
    "submit",
    e => {
      if (e.target.classList.contains("form-set-name")) {
        e.preventDefault();
        events.updateRemoteName(e.target.querySelector("input").value);
        return;
      }
    },
    false
  );
  store.subscribe(state => {
    if (state.common.peerId || state.common.signalErrors.length > 0) {
      loader.classList.add("hide");
    }
    [...buttons, formInput, formButton].forEach(button => {
      if (isDisconnected(state)) {
        button.setAttribute("disabled", "");
      } else {
        button.removeAttribute("disabled");
      }
    });
    errorsDisplay.data = [
      isDisconnected(state) && isLocalIp(location.hostname)
        ? `You're disconnected.<br/>You are running the app in development on a <strong>local ip</strong> (${location.hostname}) (<strong>without https</strong>) which leads to disconnections.<br/><strong>Use tools such as localtunnel.me or ngrock.io to test with mobile devices</strong>.<br/>Features such as <strong>WebRTC need https</strong> in production.`
        : "",
      ...state.common.signalErrors
    ].filter(Boolean);
    consoleDisplay.data = [...state.logs].reverse();
  });
  return content;
}
