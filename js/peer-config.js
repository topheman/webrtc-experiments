export function getPeerjsConfig() {
  // we use the alternate server since on some mobile carriers (orange - France)
  // the default host 0.peerjs.com hangs on forever - see https://github.com/peers/peerjs/issues/948#issuecomment-1107437915
  return {
    host: "1.peerjs.com",
    port: 443,
    path: "/"
  };
}
