import { notWebkitFonts, webkitFonts } from "../lib";
import { P } from "../types";
import { isBrave, isFirefox, isMSIE, isSafari } from "./browser";

export const fonts = (): P => {
  return new Promise((resolve): void => {
    if (isBrave()) resolve([-1, null]);

    const fontMode = (isSafari() && !isFirefox()) || isMSIE();
    const fontList = fontMode ? notWebkitFonts : webkitFonts;

    const list = new Set();
    const baseFonts = ["monospace", "sans-serif", "serif"];

    const body = document.getElementsByTagName("body")[0];

    const span = document.createElement("span");
    span.style.fontSize = "72px";
    span.innerHTML = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz!@#$%^&*()_+-=";
    const defaultWidth = {};
    const defaultHeight = {};

    for (const font of baseFonts) {
      span.style.fontFamily = font;
      body.appendChild(span);
      defaultWidth[font] = span.offsetWidth;
      defaultHeight[font] = span.offsetHeight;
      body.removeChild(span);
    }

    function fontTest(fontName: string): Promise<boolean> {
      return new Promise((resolve): void => {
        let detected = false;
        for (const font of baseFonts) {
          span.style.fontFamily = fontName + "," + font;
          body.appendChild(span);
          detected = span.offsetWidth != defaultWidth[font] || span.offsetHeight != defaultHeight[font];
          body.removeChild(span);
          if (detected) {
            list.add(fontName);
            resolve(true);
          }
        }
        resolve(false);
      });
    }

    Promise.all(fontList.map(fontTest)).then(() => {
      resolve([0, Array.from(list).sort()]);
    });
  });
};
