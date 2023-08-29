import { P } from "../types";

export const notifications = (): P => {
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
};
