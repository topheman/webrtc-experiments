# webrtc-experiments

The goal of this project is to expose an example of WebRTC, using the PeerJS library, that goes beyond the usual exercises but still keeping it clear.

Go to the demo, snap the QR code, you'll update the counter in real-time (thanks to WebRTC).

This was developed without any bundler (no Webpack), nor Framework (based on web component and a light implementation of redux), there are still unit tests - VanillaJS FTW 🤟

## Install

```shell
git clone https://github.com/topheman/webrtc-experiments.git
cd webrtc-experiments
yarn
```

## Run

```shell
npm start
```

## Test

```shell
npm test
```

## https

WebRTC only works on secure origins (localhost is considered secure). The app will work in development if you test it on the same laptop, on multiple tabs.

However, if you try to access the app from your local ip (like 192.168.1.1) from your laptop and your mobile, it won't work, since the domain will be recognized as unsecure.

So to test on multiple devices, you'll need to tunnel the app with a utility like [localtunnel.me](https://localtunnel.me).

## PeerJS

[PeerJS](https://peerjs.com/) is a wrapper around the WebRTC browser's APIs. It provides a signaling server for free (which means you don't have to setup any backend server).

Thanks to PeerJS, you don't have to bother directly about:

- the **signaling server** - you already have one for free which relies on websocket
- issue and exchange **offers** and **answers** (<abbr title="Session Description Protocol format">SDP</abbr> session description)
- exchange <abbr title="Interactive Connectivity Establishment">ICE</abbr> candidates through the signaling server

> ICE stands for Interactive Connectivity Establishment , its a techniques used in NAT( network address translator ) for establishing communication for VOIP, peer-peer, instant-messaging, and other kind of interactive media.
> Typically ice candidate provides the information about the ipaddress and port from where the data is going to be exchanged.

## Resources

- https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
- https://peerjs.com
  - https://peerjs.com/docs.html
- https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/
- https://www.grafikart.fr/tutoriels/webrtc-864