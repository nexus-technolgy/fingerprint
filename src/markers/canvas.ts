import { hash } from "../lib";
import { isBrave, isFirefoxResistFingerprinting, isSafari } from "./browser";

const asciiString = unescape(
  "%uD83D%uDE00abcdefghijklmnopqrstuvwxyz%uD83D%uDD2B%uD83C%uDFF3%uFE0F%u200D%uD83C%uDF08%uD83C%uDDF9%uD83C%uDDFC%uD83C%uDFF3%uFE0F%u200D%u26A7%uFE0F0123456789"
);

function canvas_geometry(ctx: CanvasRenderingContext2D | null): boolean | null {
  if (!ctx) return null;
  ctx.globalCompositeOperation = "multiply";

  const a = [
    { s: "#f0f", x: 100, y: 50 },
    { s: "#0ff", x: 50, y: 50 },
    { s: "#ff0", x: 75, y: 100 },
  ];

  for (const { s, x, y } of a) {
    ctx.fillStyle = s;
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, 2 * Math.PI, !0);
    ctx.closePath();
    ctx.fill();
  }

  const b = [
    { s: "#f2f", x: 190, y: 40 },
    { s: "#2ff", x: 230, y: 40 },
    { s: "#ff2", x: 210, y: 80 },
  ];

  for (const { s, x, y } of b) {
    ctx.fillStyle = s;
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, 2 * Math.PI, !0);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "#f9c";
  ctx.arc(210, 60, 60, 0, 2 * Math.PI, !0);
  ctx.arc(210, 60, 20, 0, 2 * Math.PI, !0);
  ctx.fill("evenodd");

  return !ctx.isPointInPath(5, 5, "evenodd");
}

function canvas_text(ctx: CanvasRenderingContext2D | null): boolean | null {
  if (!ctx) return null;
  ctx.globalCompositeOperation = "multiply";

  ctx.textBaseline = "top";
  ctx.font = "13px Arial";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f60";
  ctx.fillRect(150, 1, 550, 25);
  ctx.fillStyle = "#069";
  ctx.fillText(asciiString, 2, 15);
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  ctx.fillText(asciiString, 4, 17);

  const fonts = [
    "Times New Roman",
    "Times",
    "Georgia",
    "Palatino",
    "Garamond",
    "Bookman",
    "Comic Sans MS",
    "Trebuchet MS",
    "Helvetica",
    "Baskerville",
    "Akzidenz Grotesk",
    "Gotham",
    "Bodoni",
    "Didot",
    "Futura",
    "Gill Sans",
    "Frutiger",
    "Apple Color Emoji",
    "MS Gothic",
    "fakefont",
  ];
  const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

  for (const index in fonts) {
    const i = Number(index);
    const font = fonts[i];
    ctx.font = "12px " + font;
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 2;
    ctx.strokeText(asciiString, 10 * (Math.ceil(i / 13) * 2) - 10, 30 + (((i + 1) * 10) % 130));
  }

  const grd = ctx.createLinearGradient(0, 0, 200, 0.2);
  grd.addColorStop(0, "rgba(102, 204, 0, 0.1)");
  grd.addColorStop(1, "#FF0000");
  ctx.fillStyle = grd;
  ctx.fillRect(10, 10, 175, 100);

  return !ctx.isPointInPath(5, 5, "evenodd");
}

export const canvasAPI = (): Promise<[number, unknown]> => {
  return new Promise((resolve): void => {
    if ((isSafari() && navigator.maxTouchPoints !== undefined) || isBrave() || isFirefoxResistFingerprinting())
      resolve([-1, null]);

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    canvas.width = 300;
    canvas.height = 150;

    const geometry_winding = canvas_geometry(ctx);
    const canvas_geometry_fp = hash(canvas.toDataURL(), 420);
    const combined_winding = canvas_text(ctx);
    const canvas_combined_fp = hash(canvas.toDataURL(), 420);

    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = 300;
    canvas.height = 150;

    const text_winding = canvas_text(ctx);
    const canvas_text_fp = hash(canvas.toDataURL(), 420);

    resolve([
      0,
      {
        geometry: {
          hash: canvas_geometry_fp,
          winding: geometry_winding,
        },
        text: {
          hash: canvas_text_fp,
          winding: text_winding,
        },
        combined: {
          hash: canvas_combined_fp,
          winding: combined_winding,
        },
      },
    ]);
  });
};
