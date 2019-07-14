function makeQRCode(link, el = document.querySelector(".qrcode")) {
  new QRCode(el, {
    text: link,
    width: 160,
    height: 160
  });
  // wrap up the image with an anchor
  setTimeout(() => {
    const img = el.querySelector("img");
    img.style.display = "initial";
    const anchor = document.createElement("a");
    anchor.href = link;
    img.parentNode.insertBefore(anchor, img);
    anchor.appendChild(img);
  }, 0);
}

function init() {
  const peerId = new Date().getTime();
  const basePath =
    location.origin +
    location.pathname.replace(/\/$/, "") +
    "/remote.html" +
    `#${peerId}`;
  makeQRCode(basePath);
}

init();
