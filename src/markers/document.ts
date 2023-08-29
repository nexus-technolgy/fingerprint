import { P, R } from "../types";

export const attributionsourceid = (): P => {
  return new Promise((resolve): void => {
    const a = (document.createElement("a") as HTMLAnchorElement & R).attributionsourceid;
    if (a !== undefined) {
      resolve([0, String(a)]);
    } else {
      resolve([-1, null]);
    }
  });
};

export const getAttributeNames = (): P => {
  return new Promise((resolve): void => {
    const de = document.documentElement;
    if (de === undefined) resolve([-1, null]);
    if (typeof de.getAttributeNames !== "function") resolve([-2, null]);
    resolve([0, de.getAttributeNames().length > 0]);
  });
};
