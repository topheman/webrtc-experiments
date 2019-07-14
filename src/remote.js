function init() {
  const peerId = location.hash.replace(/^#/, "");
  console.log({ peerId });
}

init();
