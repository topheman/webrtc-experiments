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

function makePeerUrl(peerId) {
  return (
    location.origin +
    location.pathname.replace(/\/$/, "") +
    "/remote.html" +
    `#${peerId}`
  );
}

function makePeerMaster() {
  const peer = new Peer();
  peer.on("open", peerId => {
    console.log("Peer object created", { peerId });
    makeQRCode(makePeerUrl(peerId));
  });
  peer.on("connection", conn => {
    console.log(`Data connection opened with ${conn.peer}`, conn);
    conn.on("data", data => {
      console.log("Incomming data", data);
    });
  });
  return peer;
}

function init() {
  makePeerMaster();
}

init();
