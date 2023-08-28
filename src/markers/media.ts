import { isBrave,isChrome, isFirefoxResistFingerprinting } from "../lib";

type P<T = unknown> = Promise<[number, T]>;

export const colorGamut = (): P => {
  return new Promise((resolve): void => {
    const colorGamuts = ["rec2020", "p3", "srgb"];

    for (let i = 0; i < colorGamuts.length; i++) {
      const gamut = colorGamuts[i];
      if (matchMedia("(color-gamut: " + gamut + ")").matches) resolve([0, gamut]);
    }

    resolve([-1, null]);
  });
};

export const contrast = (): P => {
  return new Promise((resolve): void => {
    function pc(x: string): boolean {
      return Boolean(matchMedia("(prefers-contrast: " + x + ")").matches);
    }
    resolve([
      0,
      pc("no-preference") ? 0 : pc("high") || pc("more") ? 1 : pc("low") || pc("less") ? -1 : pc("forced") ? 10 : -1,
    ]);
  });
};

export const forcedColors = (): P => {
  return new Promise((resolve): void => {
    function fc(x: string): boolean {
      return Boolean(matchMedia("(forced-colors: " + x + ")").matches);
    }
    resolve([0, fc("active") || !fc("none")]);
  });
};

export const hdr = (): P => {
  return new Promise((resolve): void => {
    function dr(x: string): boolean {
      return Boolean(matchMedia("(dynamic-range: " + x + ")").matches);
    }
    resolve([0, dr("high") || !dr("standard")]);
  });
};

export const invertedColors = (): P => {
  return new Promise((resolve): void => {
    function ic(x: string): boolean {
      return Boolean(matchMedia("(inverted-colors: " + x + ")").matches);
    }
    resolve([0, ic("inverted") || !ic("none")]);
  });
};

export const monochrome = (): P => {
  return new Promise((resolve): void => {
    if (matchMedia("(min-monochrome: 0)").matches) {
      for (let i = 0; i <= 100; ++i) {
        if (matchMedia("(max-monochrome: " + i + ")").matches) resolve([0, i]);
      }
    }
    resolve([-1, null]);
  });
};

export const reducedMotion = (): P => {
  return new Promise((resolve): void => {
    function prm(x: string): boolean {
      return Boolean(matchMedia("(prefers-reduced-motion: " + x + ")").matches);
    }
    resolve([0, prm("reduce") || !prm("no-preference")]);
  });
};

export const screenResolution = (): Promise<[number, unknown]> => {
  return new Promise((resolve): void => {
    if (isFirefoxResistFingerprinting()) resolve([-1, null]);
    if (isChrome() && !isBrave()) resolve([-2, null]);
    resolve([0, [Number(screen.width), Number(screen.height)].sort().reverse().join("x")]);
  });
};
