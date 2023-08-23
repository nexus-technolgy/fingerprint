function isSafari(): boolean {
  const v = navigator.vendor;
  return v !== undefined && v.indexOf("Apple") === 0;
}

function isChrome(): boolean {
  const v = navigator.vendor;
  return v !== undefined && v.indexOf("Google") === 0;
}

function isFirefox(): boolean {
  return document.documentElement !== undefined && (document.documentElement as any).style.MozAppearance !== undefined;
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
  return (navigator as any).msSaveBlob !== undefined;
}

function isBrave(): boolean {
  return isChrome() && (navigator as any).brave !== undefined;
}

export { isSafari, isChrome, isFirefox, isFirefoxResistFingerprinting, isMSIE, isBrave };
