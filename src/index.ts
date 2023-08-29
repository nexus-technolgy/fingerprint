import { hash } from "./lib";
import {
  applePay,
  attributionsourceid,
  audioContext,
  browserObjects,
  canvasAPI,
  colorDepth,
  colorGamut,
  contrast,
  cpuClass,
  deviceMemory,
  devicePixelRatio,
  doNotTrack,
  errors,
  errorToSource,
  fonts,
  forcedColors,
  getAttributeNames,
  hardwareConcurrency,
  hdr,
  installTrigger,
  invertedColors,
  jsHeapSizeLimit,
  language,
  math,
  maxTouchPoints,
  monochrome,
  notifications,
  oscpu,
  performance,
  platform,
  pluginLengthIsZero,
  plugins,
  productSub,
  reducedMotion,
  rtt,
  screenResolution,
  sharedArrayBuffer,
  speechSynth,
  timezone,
  timezoneOffset,
  userAgentData,
  vendor,
  webdriver,
  webglInfo,
  webglProgram,
} from "./markers";
import { R } from "./types";

/**
 * Browser Fingerprint Script v1.0.0
 * Forked from Joe Rutkowski <Joe@dreggle.com> (https://github.com/Joe12387/OP-Fingerprinting-Script)
 **/
async function fingerprint(logger = console): Promise<{
  browserId: number;
  deviceId: number;
  profile: Record<string, unknown>;
}> {
  return new Promise(function (resolve, reject): void {
    const fingerprints = {
      applePay,
      attributionsourceid,
      audioContext,
      browserObjects,
      canvasAPI,
      colorDepth,
      colorGamut,
      contrast,
      cpuClass,
      deviceMemory,
      devicePixelRatio,
      doNotTrack,
      errorToSource,
      errors,
      evalToString: (): Promise<[number, number]> => {
        return Promise.resolve([0, eval.toString().length]);
      },
      fonts,
      forcedColors,
      getAttributeNames,
      hardwareConcurrency,
      hdr,
      installTrigger,
      invertedColors,
      jsHeapSizeLimit,
      language,
      math,
      maxTouchPoints,
      monochrome,
      notifications,
      oscpu,
      performance,
      platform,
      pluginLengthIsZero,
      plugins,
      productSub,
      reducedMotion,
      rtt,
      screenResolution,
      sharedArrayBuffer,
      sourceBuffer: (): Promise<[number, string[]]> => {
        return Promise.resolve([0, [typeof SourceBuffer, typeof SourceBufferList]]);
      },
      speechSynth,
      timezone,
      timezoneOffset,
      userAgentData,
      vendor,
      webdriver,
      webglInfo,
      webglProgram,
    };

    const index: string[] = [];
    const promises: Promise<unknown>[] = [];
    for (const method in fingerprints) {
      index.push(method);
      promises.push(fingerprints[method]());
    }

    Promise.all(promises)
      .then((k): void => {
        const profile: R = {};
        for (let i = 0; i < index.length; i++) {
          profile[index[i]] = k[i];
        }
        const browserId = hash(JSON.stringify(profile), 420);
        const persistentComponents = [
          profile.jsHeapSizeLimit,
          profile.audioContext,
          profile.canvasAPI,
          profile.performance,
          profile.speechSynth,
          profile.webglInfo,
          profile.webglProgram,
        ];
        const deviceId = hash(JSON.stringify(persistentComponents), 420);
        const output = {
          browserId,
          deviceId,
          profile,
        };
        resolve(output);
      })
      .catch((err) => {
        logger.error(err);
        reject(err);
      });
  });
}

window["fingerprint"] = fingerprint;

export { fingerprint };
