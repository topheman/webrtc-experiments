export function makeQRCode(link, el = document.querySelector(".qrcode")) {
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

export function makePeerUrl(peerId) {
  return (
    location.origin +
    location.pathname.replace(/\/$/, "") +
    "/remote.html" +
    `#${peerId}`
  );
}

const MASTER_PEER_ID_LOCAL_STORAGE_KEY = "master-peer-id";

export function getMasterPeerIdFromLocalStorage() {
  return localStorage.getItem(MASTER_PEER_ID_LOCAL_STORAGE_KEY);
}

export function setMasterPeerIdToLocalStorage(masterPeerId) {
  localStorage.setItem(MASTER_PEER_ID_LOCAL_STORAGE_KEY, masterPeerId);
}

export function getPeerIdFromLacationHash() {
  return location.hash.replace(/^#/, "");
}

const REMOTE_NAME_LOCAL_STORAGE_KEY = "remote-name";

export function getRemoteNameFromLocalStorage() {
  return localStorage.getItem(REMOTE_NAME_LOCAL_STORAGE_KEY);
}

export function setRemoteNameToLocalStorage(remoteName) {
  localStorage.setItem(REMOTE_NAME_LOCAL_STORAGE_KEY, remoteName);
}
