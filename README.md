# Fingerprint

This is a passive browser fingerprinting library for creating persistent, unique and long-lasting digital fingerprints without depending on time dependent variables such as the user agent string. As such, the fingerprint should not change most of the time when a user upgrades their browser to the current version.

This version is a heavily modified fork of the [OPFS source](https://github.com/Joe12387/OP-Fingerprinting-Script) [DEMO](https://detectincognito.com/opfs.html) with numerous code enhancements and quality improvements. It will generate a different unique ID and browser ID from the original, but uses all of the same markers to build the profile.

## Usage

install from NPM

```
npm i @nexustech/fingerprint
```

```ts
import { fingerprint } from "@nexustech/fingerprint";
```

Create the fingerprint

```js
const { uniqueId, browserId, profile } = await fingerprint();
console.log({ uniqueId, browserId });

// { uniqueId: 2984961870, browserId: 582672678 }
```

The package can also be called in as a module and used directly in a browser. See the `example.html` file in the `/test` directory for direct browser use.

## About

The library is able to detect and mitigate the effects of most but not all browser-based anti-fingerprinting technologies introduced to certain browsers in the past few years with the release of Brave Browser and Safari 13. The script will not use randomized fingerprints in such browsers and instead settle on a fingerprint that should be persistent as long as possible at the expense of uniqueness.

This mainly only applies to Safari 13 and up on both macOS and iOS, with Safari for iOS being the most difficult to create a unique identifier for due to the anti-fingerprinting methods used and the homogeneity of the hardware & software. This applies to Safari for macOS as well, but to a lesser extent for much the same reasons.

This script cannot detect if certain browser extensions are present in the browser that may be blocking or jamming fingerprinting methods, such as CanvasAPI having added noise to its output, which will still result in a non-persistent fingerprint.

## Markers

The script contains a list of 40+ individual fingerprinting methods to create an optimally unique fingerprint. While it does not contain all fingerprinting methods in use today, it does probably the most complete job of all open source libraries.

Fingerprint contains these notable fingerprinting methods:

- The classic fingerprints: CanvasAPI and AudioContext.
- jsHeapSizeLimit: the value of performance.memory.jsHeapSizeLimit in Chrome (7.2x more unique than CanvasAPI)
- performance.now(): A method of using performance.now() to create a unique value (6.1x more unique than CanvasAPI)
- speechSynthesis: A method of enumerating all synthetic voices available to the browser into a fingerprint.

## Output

the script returns two fingerprint hashes (integer), as well as the device profile object used to create each hash.

- `uniqueId` uses all available fingerprints and is most useful when you value uniqueness over persistence. While this fingerprint is unlikely to change often, it will still change eventually as browsers are updated.
- `browserId` is useful if you value persistence over uniqueness. It will not be as unique but should rarely, if ever, change, for the given device and browser in user.

## Expected Behavior

- The fingerprint should not change between page loads or if the browser is restarted.
- The fingerprint should not change if the user is in incognito or private mode.
- The fingerprint should not change if the network or IP address changes.

## Implemented Methods

- applePay,
- attributionsourceid,
- audioContext,
- browserObjects,
- canvasAPI,
- applePay,
- attributionsourceid,
- audioContext,
- browserObjects,
- canvasAPI,
- colorDepth,
- colorGamut,
- contrast,
- cpuClass,
- deviceMemory,
- devicePixelRatio,
- doNotTrack,
- errorToSource,
- errors,
- evalToString
- fonts,
- forcedColors,
- getAttributeNames,
- hardwareConcurrency,
- hdr,
- installTrigger,
- invertedColors,
- jsHeapSizeLimit,
- language,
- math,
- maxTouchPoints,
- monochrome,
- notifications,
- oscpu,
- performance,
- platform,
- pluginLengthIsZero,
- plugins,
- productSub,
- reducedMotion,
- rtt,
- screenResolution,
- sharedArrayBuffer,
- sourceBuffer
- speechSynth,
- timezone,
- timezoneOffset,
- userAgentData,
- vendor,
- webdriver,
- webglInfo,
- webglProgram,

## Unimplemented Fingerprinting Methods

- DOMRect
- WebRTC

## Notes

- The fingerprint may be inconsistent if the user is on a device that switches graphics hardware such as a MacBook Pro.
