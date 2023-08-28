import { hash } from "./lib";
import {
  applePay,
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
  fonts,
  forcedColors,
  hardwareConcurrency,
  hdr,
  installTrigger,
  invertedColors,
  jsHeapSizeLimit,
  language,
  maxTouchPoints,
  monochrome,
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
  userAgentData,
  vendor,
  webdriver,
  webglInfo,
  webglProgram,
} from "./markers";
import { P, R } from "./types";

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
      platform,
      vendor,
      productSub,
      colorDepth,
      devicePixelRatio,
      evalToString: (): Promise<[number, number]> => {
        return Promise.resolve([0, eval.toString().length]);
      },
      maxTouchPoints,
      cpuClass,
      hardwareConcurrency,
      deviceMemory,
      oscpu,
      doNotTrack,
      sourceBuffer: (): Promise<[number, string[]]> => {
        return Promise.resolve([0, [typeof SourceBuffer, typeof SourceBufferList]]);
      },
      colorGamut,
      reducedMotion,
      hdr,
      contrast,
      invertedColors,
      forcedColors,
      monochrome,
      browserObjects,
      timezone,
      timezoneOffset: (): P => {
        return new Promise((resolve): void => {
          const year = new Date().getFullYear();
          resolve([
            0,
            -Math.max(
              parseFloat(String(new Date(year, 0, 1).getTimezoneOffset())),
              parseFloat(String(new Date(year, 6, 1).getTimezoneOffset()))
            ),
          ]);
        });
      },
      language,
      screenResolution,
      jsHeapSizeLimit,
      audioContext,
      userAgentData,
      canvasAPI,
      performance,
      speechSynth,
      applePay,
      attributionsourceid: (): P => {
        return new Promise((resolve): void => {
          const a = (document.createElement("a") as HTMLAnchorElement & R).attributionsourceid;
          if (a !== undefined) {
            resolve([0, String(a)]);
          } else {
            resolve([-1, null]);
          }
        });
      },
      webglInfo,
      webglProgram,
      fonts,
      plugins,
      pluginLengthIsZero,
      sharedArrayBuffer,
      webdriver,
      getAttributeNames: (): P => {
        return new Promise((resolve): void => {
          const de = document.documentElement;
          if (de === undefined) resolve([-1, null]);
          if (typeof de.getAttributeNames !== "function") resolve([-2, null]);
          resolve([0, de.getAttributeNames().length > 0]);
        });
      },
      errorToSource: (): P => {
        return new Promise((resolve): void => {
          try {
            throw "ets";
          } catch (e) {
            try {
              const tmp = (e as { toSource: () => unknown }).toSource();
              resolve([0, tmp !== undefined]);
            } catch (err) {
              resolve([0, false]);
            }
          }
          resolve([-1, null]);
        });
      },
      errors: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const errorTests = [
            () => new Function('alert(")'),
            () => new Function("const foo;foo.bar"),
            () => new Function("const a=1; const a=2;"),
            new Function("try{null.bar;return -1}catch(e){return e.message}"),
            new Function("try{abc.xyz=123;return -1}catch(e){return e.message}"),
            new Function("try{(1).toString(1000);return -1}catch(e){return e.message}"),
            new Function("try{[...undefined].length;return -1}catch(e){return e.message}"),
            new Function("try{var x=new Array(-1);return -1}catch(e){return e.message}"),
          ];
          const errors: string[] = [];
          for (const errorTest of errorTests) {
            try {
              errors.push(errorTest());
            } catch (error) {
              errors.push((error as Error).message);
            }
          }
          resolve([0, errors]);
        });
      },
      installTrigger,
      rtt,
      math: (): Promise<[number, number]> => {
        return new Promise((resolve): void => {
          const m = Math;

          const returnZero = (): number => {
            return 0;
          };

          const e = 1e154;

          const fp = [
            (m.acos || returnZero)(0.12312423423423424),
            (m.acosh || returnZero)(1e308),
            m.log(e + m.sqrt(e * e - 1)),
            (m.asin || returnZero)(0.12312423423423424),
            (m.asinh || returnZero)(1),
            m.log(m.sqrt(2) + 1),
            (m.atanh || returnZero)(0.5),
            m.log(3) / 2,
            (m.atan || returnZero)(0.5),
            (m.sin || returnZero)(-1e300),
            (m.sinh || returnZero)(1),
            m.exp(1) - 1 / m.exp(1) / 2,
            (m.cos || returnZero)(10.000000000123),
            (m.cosh || returnZero)(1),
            (m.exp(1) + 1 / m.exp(1)) / 2,
            (m.tan || returnZero)(-1e300),
            (m.tanh || returnZero)(1),
            (m.exp(2) - 1) / (m.exp(2) + 1),
            (m.exp || returnZero)(1),
            (m.expm1 || returnZero)(1),
            m.exp(1) - 1,
            (m.log1p || returnZero)(10),
            m.log(11),
            m.pow(m.PI, -100),
          ];

          resolve([0, hash(JSON.stringify(fp), 420)]);
        });
      },
      notifications: (): P => {
        return new Promise((resolve): void => {
          if (window.Notification === undefined) {
            resolve([-1, null]);
          }
          if (navigator.permissions === undefined) {
            resolve([-2, null]);
          }
          if (typeof navigator.permissions.query !== "function") {
            resolve([-3, null]);
          }
          navigator.permissions
            .query({ name: "notifications" })
            .then((res): void => {
              resolve([0, window.Notification.permission === "denied" && res.state === "prompt"]);
            })
            .catch((): void => {
              resolve([-4, null]);
            });
        });
      },
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
