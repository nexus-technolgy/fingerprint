import { FingerprintNavigator } from "../types";

type MozElement = HTMLElement & {
  style: CSSStyleDeclaration & {
    MozAppearance?: string;
  };
};

function isSafari(): boolean {
  const v = navigator.vendor;
  return v !== undefined && v.indexOf("Apple") === 0;
}

function isChrome(): boolean {
  const v = navigator.vendor;
  return v !== undefined && v.indexOf("Google") === 0;
}

function isFirefox(): boolean {
  return document.documentElement !== undefined && (document.documentElement as MozElement).style.MozAppearance !== undefined;
}

function isFirefoxResistFingerprinting(): boolean {
  if (!isFirefox()) return false;

  const intl = window.Intl;
  const date = intl.DateTimeFormat;
  if (typeof date === "function") {
    const tz = new date().resolvedOptions().timeZone;
    if (tz === "UTC") return true;
  }
  return false;
}

function isMSIE(): boolean {
  return (navigator as FingerprintNavigator).msSaveBlob !== undefined;
}

function isBrave(): boolean {
  return isChrome() && (navigator as FingerprintNavigator).brave !== undefined;
}

export { isBrave, isChrome, isFirefox, isFirefoxResistFingerprinting, isMSIE, isSafari };
