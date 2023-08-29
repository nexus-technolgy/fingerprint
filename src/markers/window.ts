import { hash } from "../lib";
import { FingerprintWindow, P } from "../types";
import { isBrave, isChrome, isFirefox, isSafari } from "./browser";

const w = window as FingerprintWindow;

export const applePay = (): P => {
  return new Promise((resolve): void => {
    if (typeof w.ApplePaySession !== "function" || window.location.protocol !== "https:") resolve([-1, null]);
    const enabled = w.ApplePaySession.canMakePayments();
    resolve([0, enabled]);
  });
};

export const audioContext = (): P => {
  return new Promise((resolve): void => {
    if (isBrave()) resolve([-1, null]);

    const Context = w.OfflineAudioContext || w.webkitOfflineAudioContext;

    if (typeof Context !== "function") resolve([-2, null]);

    const context = new Context(1, 44100, 44100);

    const pxi_oscillator = context.createOscillator();
    pxi_oscillator.type = "triangle";
    pxi_oscillator.frequency.value = 1e4;

    const pxi_compressor = context.createDynamicsCompressor();
    pxi_compressor.threshold && (pxi_compressor.threshold.value = -50);
    pxi_compressor.knee && (pxi_compressor.knee.value = 40);
    pxi_compressor.ratio && (pxi_compressor.ratio.value = 12);
    pxi_compressor.reduction && (pxi_compressor.reduction["value"] = -20);
    pxi_compressor.attack && (pxi_compressor.attack.value = 0);
    pxi_compressor.release && (pxi_compressor.release.value = 0.25);

    pxi_oscillator.connect(pxi_compressor);
    pxi_compressor.connect(context.destination);

    pxi_oscillator.start(0);
    context.startRendering();
    context.oncomplete = (event: OfflineAudioCompletionEvent) => {
      let pxi_output = 0;
      for (let i = 4500; 5e3 > i; i++) {
        pxi_output += Math.abs(event.renderedBuffer.getChannelData(0)[i]);
      }
      pxi_compressor.disconnect();
      resolve([0, pxi_output]);
    };
  });
};

export const browserObjects = (): P => {
  return new Promise((resolve): void => {
    const foundObjects: string[] = [];
    const objects = [
      "chrome",
      "safari",
      "__crWeb",
      "__gCrWeb",
      "yandex",
      "__yb",
      "__ybro",
      "__firefox__",
      "__edgeTrackingPreventionStatistics",
      "webkit",
      "oprt",
      "samsungAr",
      "ucweb",
      "UCShellJava",
      "puffinDevice",
      "opr",
    ];

    for (const o in objects) {
      if (typeof w[o] === "object") foundObjects.push(o);
    }

    resolve([0, foundObjects.sort()]);
  });
};

export const colorDepth = (): P => {
  return new Promise((resolve): void => {
    const cd = w.screen.colorDepth;
    if (cd === undefined) {
      resolve([-1, null]);
    } else {
      resolve([0, cd]);
    }
  });
};

export const devicePixelRatio = (): P => {
  return new Promise((resolve): void => {
    if (isChrome() && !isBrave()) resolve([-2, null]);
    const dpr = w.devicePixelRatio;
    if (dpr === undefined) {
      resolve([-1, null]);
    } else {
      resolve([0, dpr]);
    }
  });
};

export const installTrigger = (): Promise<[number, boolean]> => {
  return Promise.resolve([0, w.InstallTrigger !== undefined]);
};

export const jsHeapSizeLimit = (): P => {
  return new Promise((resolve): void => {
    const perf = w.performance as Performance & Record<string, unknown>;
    if (perf == undefined) resolve([-1, null]);
    const memory = perf.memory as Record<string, unknown>;
    if (memory === undefined) resolve([-2, null]);
    const jsHeapSizeLimit = memory.jsHeapSizeLimit;
    if (jsHeapSizeLimit === undefined) resolve([-3, null]);
    resolve([0, jsHeapSizeLimit]);
  });
};

export const performance = (): P => {
  return new Promise((resolve): void => {
    if (!isChrome()) resolve([-1, null]);

    const perf = w.performance;

    if (perf === undefined) resolve([-2, null]);
    if (typeof perf.now !== "function") resolve([-3, null]);

    let valueA = 1;
    let valueB = 1;

    let now = perf.now();

    let newNow = now;

    for (let i = 0; i < 5000; i++) {
      if ((now = newNow) < (newNow = perf.now())) {
        const difference = newNow - now;
        if (difference > valueA) {
          if (difference < valueB) {
            valueB = difference;
          }
        } else if (difference < valueA) {
          valueB = valueA;
          valueA = difference;
        }
      }
    }

    resolve([0, valueA]);
  });
};

export const sharedArrayBuffer = (): P => {
  return new Promise((resolve): void => {
    if (typeof w.SharedArrayBuffer === "function") {
      const sab = new w.SharedArrayBuffer(1);
      if (sab.byteLength !== undefined) {
        resolve([0, sab.byteLength]);
      }
      resolve([-2, null]);
    }
    resolve([-1, null]);
  });
};

export const speechSynth = (): P => {
  return new Promise((resolve): void => {
    if (isBrave() || isFirefox() || isSafari()) resolve([-1, null]);

    let tripped = false;
    const synth = w.speechSynthesis;
    if (synth === undefined) resolve([-2, null]);

    function populateVoiceList(): void {
      const voices = synth.getVoices();
      const output: SpeechSynthesisVoice[] = [];
      for (const { name, voiceURI, default: isDefault, lang, localService } of voices) {
        output.push({ name, voiceURI, default: isDefault, lang, localService });
      }
      if (output.length > 0 || tripped) {
        resolve(output.length > 0 ? [0, hash(JSON.stringify(output), 420)] : [-3, null]);
      }
      tripped = true;
    }

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  });
};

export const timezone = (): P => {
  return new Promise((resolve): void => {
    const intl = w.Intl;
    const date = intl.DateTimeFormat;
    if (typeof date === "function") {
      const tz = new date().resolvedOptions().timeZone;
      if (tz) resolve([0, tz]);
    }
    const year = new Date().getFullYear();
    const utc = -Math.max(
      parseFloat(String(new Date(year, 0, 1).getTimezoneOffset())),
      parseFloat(String(new Date(year, 6, 1).getTimezoneOffset()))
    );
    resolve([1, "UTC" + (utc >= 0 ? "+" : "-") + Math.abs(utc)]);
  });
};

export const timezoneOffset = (): P => {
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
};
