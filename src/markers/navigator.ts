import { isBrave, isChrome, isFirefoxResistFingerprinting } from "../lib";
import { FingerprintNavigator, P, R } from "../types";

const n = navigator as FingerprintNavigator;

export const cpuClass = (): P => {
  return new Promise((resolve): void => {
    const cpu = n.cpuClass;
    if (cpu === undefined) {
      resolve([-1, null]);
    } else {
      resolve([0, cpu]);
    }
  });
};

export const deviceMemory = (): P => {
  return new Promise((resolve): void => {
    if (isBrave()) {
      return resolve([-2, null]);
    }
    const dm = n.deviceMemory;
    if (dm === undefined) {
      resolve([-1, null]);
    } else {
      resolve([0, dm]);
    }
  });
};

export const doNotTrack = (): P => {
  return new Promise((resolve): void => {
    if (isFirefoxResistFingerprinting()) resolve([-2, null]);
    const dnt = n.doNotTrack;
    if (dnt === undefined) {
      resolve([-1, null]);
    } else {
      resolve([0, dnt]);
    }
  });
};

export const hardwareConcurrency = (): P => {
  return new Promise((resolve): void => {
    if (isBrave() || isFirefoxResistFingerprinting()) {
      return resolve([-2, null]);
    }
    const hc = n.hardwareConcurrency;
    if (hc === undefined) {
      resolve([-1, null]);
    } else {
      resolve([0, hc]);
    }
  });
};

export const language = (): P => {
  return new Promise((resolve): void => {
    const lang_str = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
    let lang_arr: string[] = [];

    if (!isChrome() && Array.isArray(n.languages)) {
      lang_arr = n.languages;
    }

    resolve([0, [lang_str, lang_arr]]);
  });
};

export const maxTouchPoints = (): P => {
  return Promise.resolve(
    n.maxTouchPoints !== undefined
      ? [0, n.maxTouchPoints]
      : n.msMaxTouchPoints !== undefined
        ? [1, n.msMaxTouchPoints]
        : [-1, null]
  );
};

export const oscpu = (): P => {
  return new Promise((resolve): void => {
    const os = n.oscpu;
    if (os === undefined) {
      resolve([-1, null]);
    } else {
      resolve([0, os]);
    }
  });
};

export const platform = (): P => {
  return new Promise((resolve): void => {
    const np = n.platform;
    if (np === undefined) {
      resolve([-1, null]);
    } else {
      resolve([0, np]);
    }
  });
};

export const plugins = (): P => {
  return new Promise((resolve): void => {
    if (isChrome()) resolve([-1, null]);
    const plugins = n.plugins;
    const output: Record<string, unknown>[] = [];
    if (plugins) {
      for (let i = 0; i < plugins.length; i++) {
        const plugin = plugins[i];
        if (plugin) {
          const mimes: Record<string, unknown>[] = [];
          for (let l = 0; l < plugin.length; l++) {
            const mime = plugin[l];
            mimes.push({
              type: mime.type,
              suffixes: mime.suffixes,
            });
          }
          output.push({
            name: plugin.name,
            description: plugin.description,
            mimes: mimes,
          });
        }
      }
    }
    resolve([0, output]);
  });
};

export const pluginLengthIsZero = (): P => {
  return new Promise((resolve): void => {
    const plugins = n.plugins;
    if (plugins === undefined) resolve([-1, null]);
    resolve([0, plugins.length === 0]);
  });
};

export const productSub = (): P => {
  return new Promise((resolve): void => {
    const ps = n.productSub;
    if (ps === undefined) {
      resolve([-1, null]);
    } else {
      resolve([0, ps]);
    }
  });
};

export const userAgentData = (): P => {
  return new Promise((resolve): void => {
    function parseBrand(arr: R[]): string[] {
      const brands: string[] = [];
      if (!arr) return brands;
      for (const a of arr) {
        if (a.brand) {
          const brand = a.brand as string;
          if (!new RegExp("Brand", "i").test(brand)) {
            brands.push(brand);
          }
        }
      }
      return brands.sort();
    }

    const uad = n.userAgentData;
    if (!uad) resolve([-1, null]);
    if (typeof uad.getHighEntropyValues !== "function") resolve([-2, null]);
    uad.getHighEntropyValues(["brands", "mobile", "platform", "architecture", "bitness", "model"]).then(function (s) {
      resolve([0, [parseBrand(s.brands as R<string>[]), s.mobile, s.platform, s.architecture, s.bitness, s.model]]);
    });
  });
};

export const rtt = (): P => {
  return new Promise((resolve): void => {
    const con = n.connection;
    if (con === undefined) resolve([-1, null]);
    const rtt = con.rtt;
    if (rtt === undefined) resolve([-2, null]);
    resolve([0, rtt === 0]);
  });
};

export const vendor = (): P => {
  return new Promise((resolve): void => {
    const nv = n.vendor;
    if (nv === undefined) {
      resolve([-1, null]);
    } else {
      resolve([0, nv]);
    }
  });
};

export const webdriver = (): P => {
  return new Promise((resolve): void => {
    const webd = n.webdriver;
    if (webd === undefined) {
      resolve([-1, null]);
    } else {
      resolve([0, webd]);
    }
  });
};
