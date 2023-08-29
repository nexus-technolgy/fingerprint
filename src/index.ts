/**
 * Source: @nexustech/fingerprint
 * Forked from: op-fingerprinting-script
 *
 * Copyright 2023 Nexustech Pty Ltd [AU]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License in the root of this project, or at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
import { FingerprintLogger, P, R } from "./types";

/**
 * Browser Fingerprint
 * @returns { uniqueId, browserId, profile }
 **/
async function fingerprint(logService?: FingerprintLogger): Promise<{
  uniqueId: number;
  browserId: number;
  profile: R;
}> {
  const logger = logService ?? console;
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
      evalToString: (): P => {
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
      sourceBuffer: (): P => {
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

    const markers: string[] = [];
    const promises: Promise<unknown>[] = [];

    for (const marker in fingerprints) {
      markers.push(marker);
      promises.push(fingerprints[marker]());
    }

    Promise.all(promises)
      .then((results): void => {
        const profile: R = {};

        for (const index in markers) {
          profile[markers[index]] = results[index];
        }

        const uniqueId = hash(JSON.stringify(profile), 420);

        const persistentComponents = [
          "audioContext",
          "canvasAPI",
          "jsHeapSizeLimit",
          "performance",
          "speechSynth",
          "webglInfo",
          "webglProgram",
        ].map((component) => profile[component]);
        const browserId = hash(JSON.stringify(persistentComponents), 420);

        const output = {
          uniqueId,
          browserId,
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
