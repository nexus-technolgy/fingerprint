import {
  isSafari,
  isChrome,
  isFirefox,
  isFirefoxResistFingerprinting,
  isMSIE,
  isBrave,
  parameterNames,
  murmurhash3_32_gc as hash,
  geckoFonts,
  notGeckoFonts,
  extensionList,
} from "./lib";

type FingerprintNavigator = Navigator &
  Record<string, unknown> & {
    connection: Record<string, unknown>;
  };
type FingerprintWindow = Window &
  typeof globalThis &
  Record<string, unknown> & {
    ApplePaySession: {
      canMakePayments: () => boolean;
    };
    SharedArrayBuffer: (x?: number) => void;
  };

/**
 * Browser Fingerprint Script v1.0.0
 * Forked from Joe Rutkowski <Joe@dreggle.com> (https://github.com/Joe12387/OP-Fingerprinting-Script)
 **/
async function fingerprint(logger = console): Promise<{
  deviceId: number;
  persistentId: number;
  profile: Record<string, unknown>;
}> {
  const n = navigator as FingerprintNavigator;
  const w = window as FingerprintWindow;
  return new Promise(function (resolve, reject): void {
    const fingerprints = {
      platform: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const np = n.platform;
          if (np === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, np]);
          }
        });
      },
      vendor: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const nv = n.vendor;
          if (nv === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, nv]);
          }
        });
      },
      productSub: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const ps = n.productSub;
          if (ps === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, ps]);
          }
        });
      },
      colorDepth: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const cd = w.screen.colorDepth;
          if (cd === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, cd]);
          }
        });
      },
      devicePixelRatio: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          if (isChrome() && !isBrave()) resolve([-2, null]);
          const dpr = w.devicePixelRatio;
          if (dpr === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, dpr]);
          }
        });
      },
      evalToString: (): Promise<[number, number]> => {
        return Promise.resolve([0, eval.toString().length]);
      },
      maxTouchPoints: (): Promise<[number, unknown]> => {
        return Promise.resolve(
          n.maxTouchPoints !== undefined
            ? [0, n.maxTouchPoints]
            : n.msMaxTouchPoints !== undefined
            ? [1, n.msMaxTouchPoints]
            : [-1, null]
        );
      },
      cpuClass: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const cpu = n.cpuClass;
          if (cpu === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, cpu]);
          }
        });
      },
      hardwareConcurrency: (): Promise<[number, unknown]> => {
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
      },
      deviceMemory: (): Promise<[number, unknown]> => {
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
      },
      oscpu: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const os = n.oscpu;
          if (os === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, os]);
          }
        });
      },
      doNotTrack: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          if (isFirefoxResistFingerprinting()) resolve([-2, null]);
          const dnt = n.doNotTrack;
          if (dnt === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, dnt]);
          }
        });
      },
      sourceBuffer: (): Promise<[number, string[]]> => {
        return Promise.resolve([0, [typeof SourceBuffer, typeof SourceBufferList]]);
      },
      colorGamut: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const colorGamuts = ["rec2020", "p3", "srgb"];

          for (let i = 0; i < colorGamuts.length; i++) {
            const gamut = colorGamuts[i];
            if (matchMedia("(color-gamut: " + gamut + ")").matches) resolve([0, gamut]);
          }

          resolve([-1, null]);
        });
      },
      reducedMotion: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          function prm(x: string): boolean {
            return Boolean(matchMedia("(prefers-reduced-motion: " + x + ")").matches);
          }
          resolve([0, prm("reduce") || !prm("no-preference")]);
        });
      },
      hdr: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          function dr(x: string): boolean {
            return Boolean(matchMedia("(dynamic-range: " + x + ")").matches);
          }
          resolve([0, dr("high") || !dr("standard")]);
        });
      },
      contrast: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          function pc(x: string): boolean {
            return Boolean(matchMedia("(prefers-contrast: " + x + ")").matches);
          }
          resolve([
            0,
            pc("no-preference") ? 0 : pc("high") || pc("more") ? 1 : pc("low") || pc("less") ? -1 : pc("forced") ? 10 : -1,
          ]);
        });
      },
      invertedColors: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          function ic(x: string): boolean {
            return Boolean(matchMedia("(inverted-colors: " + x + ")").matches);
          }
          resolve([0, ic("inverted") || !ic("none")]);
        });
      },
      forcedColors: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          function fc(x: string): boolean {
            return Boolean(matchMedia("(forced-colors: " + x + ")").matches);
          }
          resolve([0, fc("active") || !fc("none")]);
        });
      },
      monochrome: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          if (matchMedia("(min-monochrome: 0)").matches) {
            for (let i = 0; i <= 100; ++i) {
              if (matchMedia("(max-monochrome: " + i + ")").matches) resolve([0, i]);
            }
          }
          resolve([-1, null]);
        });
      },
      browserObjects: (): Promise<[number, unknown]> => {
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

          for (let i = 0; i < objects.length; i++) {
            if (typeof window[objects[i]] === "object") foundObjects.push(objects[i]);
          }

          resolve([0, foundObjects.sort()]);
        });
      },
      timezone: (): Promise<[number, unknown]> => {
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
      },
      timezoneOffset: (): Promise<[number, unknown]> => {
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
      },
      language: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const lang_str = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
          let lang_arr: string[] = [];

          if (!isChrome() && Array.isArray(n.languages)) {
            lang_arr = n.languages;
          }

          resolve([0, [lang_str, lang_arr]]);
        });
      },
      screenResolution: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          if (isFirefoxResistFingerprinting()) resolve([-1, null]);
          if (isChrome() && !isBrave()) resolve([-2, null]);
          resolve([0, [Number(screen.width), Number(screen.height)].sort().reverse().join("x")]);
        });
      },
      jsHeapSizeLimit: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const perf = w.performance as Performance & Record<string, unknown>;
          if (perf == undefined) resolve([-1, null]);
          const memory = perf.memory as Record<string, unknown>;
          if (memory === undefined) resolve([-2, null]);
          const jsHeapSizeLimit = memory.jsHeapSizeLimit;
          if (jsHeapSizeLimit === undefined) resolve([-3, null]);
          resolve([0, jsHeapSizeLimit]);
        });
      },
      audioContext: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          if (isBrave()) resolve([-1, null]);

          let context = w.OfflineAudioContext || w.webkitOfflineAudioContext;

          if (typeof context !== "function") resolve([-2, null]);

          context = new context(1, 44100, 44100) as any;

          const pxi_oscillator = (context as any).createOscillator();
          pxi_oscillator.type = "triangle";
          pxi_oscillator.frequency.value = 1e4;

          const pxi_compressor = (context as any).createDynamicsCompressor();
          pxi_compressor.threshold && (pxi_compressor.threshold.value = -50);
          pxi_compressor.knee && (pxi_compressor.knee.value = 40);
          pxi_compressor.ratio && (pxi_compressor.ratio.value = 12);
          pxi_compressor.reduction && (pxi_compressor.reduction.value = -20);
          pxi_compressor.attack && (pxi_compressor.attack.value = 0);
          pxi_compressor.release && (pxi_compressor.release.value = 0.25);

          pxi_oscillator.connect(pxi_compressor);
          pxi_compressor.connect((context as any).destination);

          pxi_oscillator.start(0);
          (context as any).startRendering();
          (context as any).oncomplete = (evnt: any) => {
            let pxi_output = 0;
            for (let i = 4500; 5e3 > i; i++) {
              pxi_output += Math.abs(evnt.renderedBuffer.getChannelData(0)[i]);
            }
            pxi_compressor.disconnect();
            resolve([0, pxi_output]);
          };
        });
      },
      userAgentData: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          function parseBrand(arr: any[]): string[] {
            const brands = [] as string[];
            if (!arr) return [];
            for (let i = 0; i < arr.length; i++) {
              if (!!arr[i].brand) {
                const brand = arr[i].brand;
                if (!new RegExp("Brand", "i").test(brand)) {
                  brands.push(brand);
                }
              }
            }
            return brands.sort();
          }

          const uad = (navigator as any).userAgentData;
          if (!uad) resolve([-1, null]);
          if (typeof uad.getHighEntropyValues !== "function") resolve([-2, null]);
          uad
            .getHighEntropyValues(["brands", "mobile", "platform", "architecture", "bitness", "model"])
            .then(function (s: any) {
              resolve([0, [parseBrand(s.brands), s.mobile, s.platform, s.architecture, s.bitness, s.model]]);
            });
        });
      },
      canvasAPI: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          if ((isSafari() && navigator.maxTouchPoints !== undefined) || isBrave() || isFirefoxResistFingerprinting())
            resolve([-1, null]);

          const asciiString = unescape(
            "%uD83D%uDE00abcdefghijklmnopqrstuvwxyz%uD83D%uDD2B%uD83C%uDFF3%uFE0F%u200D%uD83C%uDF08%uD83C%uDDF9%uD83C%uDDFC%uD83C%uDFF3%uFE0F%u200D%u26A7%uFE0F0123456789"
          );

          function canvas_geometry(ctx: any): boolean {
            ctx.globalCompositeOperation = "multiply";

            const a = [
              ["#f0f", 100, 50],
              ["#0ff", 50, 50],
              ["#ff0", 75, 100],
            ];

            for (let o = 0; o < a.length; o++) {
              const u = a[o];
              const s = u[0];
              const c = u[1];
              const l = u[2];

              ctx.fillStyle = s;
              ctx.beginPath();
              ctx.arc(c, l, 50, 0, 2 * Math.PI, !0);
              ctx.closePath();
              ctx.fill();
            }

            const r = [
              ["#f2f", 190, 40],
              ["#2ff", 230, 40],
              ["#ff2", 210, 80],
            ];

            for (let n = 0; n < r.length; n++) {
              const i = r[n];
              ctx.fillStyle = i[0];
              ctx.beginPath();
              ctx.arc(i[1], i[2], 40, 0, 2 * Math.PI, !0);
              ctx.closePath();
              ctx.fill();
            }
            ctx.fillStyle = "#f9c";
            ctx.arc(210, 60, 60, 0, 2 * Math.PI, !0);
            ctx.arc(210, 60, 20, 0, 2 * Math.PI, !0);
            ctx.fill("evenodd");

            return !ctx.isPointInPath(5, 5, "evenodd");
          }

          function canvas_text(ctx: any): boolean {
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

            for (let i = 0; i < fonts.length; i++) {
              ctx.font = "12px " + fonts[i];
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
      },
      performance: (): Promise<[number, unknown]> => {
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
      },
      speechSynthesis: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          if (isBrave() || isFirefox() || isSafari()) resolve([-1, null]);

          let tripped = false;
          const synth = w.speechSynthesis;
          if (synth === undefined) resolve([-2, null]);

          function populateVoiceList(): void {
            const voices = synth.getVoices();
            const output = [] as any;
            for (let i = 0; i < voices.length; i++) {
              const voice = voices[i];
              output.push([voice.name, voice.voiceURI, voice.default, voice.lang, voice.localService]);
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
      },
      applePay: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          if (typeof w.ApplePaySession !== "function") resolve([-1, null]);
          const enabled = w.ApplePaySession.canMakePayments();
          resolve([0, enabled]);
        });
      },
      attributionsourceid: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const a = (document.createElement("a") as any).attributionsourceid;
          if (a !== undefined) {
            resolve([0, String(a)]);
          } else {
            resolve([-1, null]);
          }
        });
      },
      webglInfo: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const canvas = document.createElement("canvas");

          try {
            const context: any = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") || resolve([-1, null]);

            const output: Record<string, number | unknown[]> = {};

            const debugExtension = context ? context.getExtension("WEBGL_debug_renderer_info") : null;

            if (!debugExtension) resolve([-3, null]);

            output.unmaskedVendor = isBrave() ? null : context.getParameter(debugExtension.UNMASKED_VENDOR_WEBGL);
            output.unmaskedRenderer = isBrave() ? null : context.getParameter(debugExtension.UNMASKED_RENDERER_WEBGL);
            output.version = context.getParameter(context.VERSION);
            output.shaderVersion = context.getParameter(context.SHADING_LANGUAGE_VERSION);
            output.vendor = context.getParameter(context.VENDOR);
            output.renderer = context.getParameter(context.RENDERER);

            output.attributes = [];

            const glContextAttributes = context.getContextAttributes();
            for (let att in glContextAttributes) {
              if (glContextAttributes.hasOwnProperty(att)) {
                output.attributes.push(att + "=" + glContextAttributes[att]);
              }
            }

            output.parameters = [];
            for (let i = 0; i < parameterNames.length; i++) {
              output.parameters.push(parameterNames[i] + "=" + context.getParameter(context[parameterNames[i]]));
            }

            function getShaderPrecision(shaderType: string, precisionType: string): any[] {
              const shaderPrecision = context.getShaderPrecisionFormat(context[shaderType], context[precisionType]);
              return [shaderPrecision.rangeMin, shaderPrecision.rangeMax, shaderPrecision.precision];
            }

            const shaderTypes = ["FRAGMENT_SHADER", "VERTEX_SHADER"];
            const precisionTypes = ["LOW_FLOAT", "MEDIUM_FLOAT", "HIGH_FLOAT", "LOW_INT", "MEDIUM_INT", "HIGH_INT"];

            output.shaderPrecision = [];
            for (let i = 0; i < shaderTypes.length; i++) {
              const shaderType = shaderTypes[i];
              for (let j = 0; j < precisionTypes.length; j++) {
                output.shaderPrecision.push(getShaderPrecision(shaderType, precisionTypes[j]));
              }
            }

            output.extensions = [];
            const extensions = context.getSupportedExtensions();
            for (let i = 0; i < extensions.length; i++) {
              output.extensions.push(extensions[i]);
            }

            const vendorPrefixes = ["", "WEBKIT_", "MOZ_", "O_", "MS_"];

            output.constants = [];
            for (let i = 0; i < vendorPrefixes.length; i++) {
              const vendorPrefix = vendorPrefixes[i];
              for (let extension in extensionList) {
                if (extensionList.hasOwnProperty(extension)) {
                  const extensionParameters = extensionList[extension];
                  const supported = context.getExtension(vendorPrefix + extension);
                  if (supported) {
                    for (let j = 0; j < extensionParameters.length; j++) {
                      const extensionParameter = extensionParameters[j];
                      const extensionParameterValue = supported[extensionParameter];
                      output.constants.push(
                        vendorPrefix + extension + "_" + extensionParameter + "=" + extensionParameterValue
                      );
                    }
                  }
                }
              }
            }

            output.attributes = hash(JSON.stringify(output.attributes), 420);
            output.parameters = hash(JSON.stringify(output.parameters), 420);
            output.shaderPrecision = isBrave() ? 0 : hash(JSON.stringify(output.shaderPrecision), 420);
            output.extensions = isBrave() ? 0 : hash(JSON.stringify(output.extensions), 420);
            output.constants = isBrave() ? 0 : hash(JSON.stringify(output.constants), 420);

            resolve([0, output]);
          } catch (e) {
            resolve([-2, null]);
          }
        });
      },
      webglProgram: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          if (isBrave() || isFirefoxResistFingerprinting()) resolve([-3, null]);

          const canvas = document.createElement("canvas");

          try {
            const context: any = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") || resolve([-1, null]);

            context.clearColor(0, 0, 1, 1);

            const program = context.createProgram();

            function helper(x: number, y: string) {
              const shader = context.createShader(35633 - x);
              context.shaderSource(shader, y);
              context.compileShader(shader);
              context.attachShader(program, shader);
            }

            helper(
              0,
              "attribute vec2 p;uniform float t;void main(){float s=sin(t);float c=cos(t);gl_Position=vec4(p*mat2(c,s,-s,c),1,1);}"
            );
            helper(1, "void main(){gl_FragColor=vec4(1,0,0,1);}");

            context.linkProgram(program);
            context.useProgram(program);
            context.enableVertexAttribArray(0);
            const uniform = context.getUniformLocation(program, "t");

            const buffer = context.createBuffer();
            context.bindBuffer(34962, buffer);
            context.bufferData(34962, new Float32Array([0, 1, -1, -1, 1, -1]), 35044);
            context.vertexAttribPointer(0, 2, 5126, false, 0, 0);

            context.clear(16384);
            context.uniform1f(uniform, 3.65);
            context.drawArrays(4, 0, 3);

            resolve([0, hash(canvas.toDataURL(), 420)]);
          } catch (e) {
            resolve([-2, null]);
          }
        });
      },
      fonts: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          if (isBrave()) resolve([-1, null]);

          const fontMode = (isSafari() && !isFirefox()) || isMSIE();
          const fontList = fontMode ? notGeckoFonts : geckoFonts;

          const list: string[] = [];
          const baseFonts = ["monospace", "sans-serif", "serif"];

          const body = document.getElementsByTagName("body")[0];

          const span = document.createElement("span");
          span.style.fontSize = "72px";
          span.innerHTML = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz!@#$%^&*()_+-=";
          const defaultWidth = {};
          const defaultHeight = {};
          for (const index in baseFonts) {
            span.style.fontFamily = baseFonts[index];
            body.appendChild(span);
            defaultWidth[baseFonts[index]] = span.offsetWidth;
            defaultHeight[baseFonts[index]] = span.offsetHeight;
            body.removeChild(span);
          }

          function font_test(font: string): Promise<boolean> {
            return new Promise((resolve): void => {
              let detected = false;
              for (const index in baseFonts) {
                span.style.fontFamily = font + "," + baseFonts[index];
                body.appendChild(span);
                detected =
                  span.offsetWidth != defaultWidth[baseFonts[index]] || span.offsetHeight != defaultHeight[baseFonts[index]];
                body.removeChild(span);
                if (detected) {
                  if (list.indexOf(font) === -1) list.push(font);
                  resolve(true);
                }
              }
              resolve(false);
            });
          }

          const dfonts: Array<boolean | string> = [];

          for (let fi = 0; fi < fontList.length; fi++) {
            font_test(fontList[fi]).then((promise) => {
              dfonts.push(promise);
            });
          }

          Promise.all(dfonts).then(() => {
            resolve([0, list.sort()]);
          });
        });
      },
      plugins: (): Promise<[number, unknown]> => {
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
      },
      pluginLengthIsZero: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const plugins = n.plugins;
          if (plugins === undefined) resolve([-1, null]);
          resolve([0, plugins.length === 0]);
        });
      },
      sharedArrayBuffer: (): Promise<[number, unknown]> => {
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
      },
      webdriver: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const webd = navigator.webdriver;
          if (webd === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, webd]);
          }
        });
      },
      getAttributeNames: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const de = document.documentElement;
          if (de === undefined) resolve([-1, null]);
          if (typeof de.getAttributeNames !== "function") resolve([-2, null]);
          resolve([0, de.getAttributeNames().length > 0]);
        });
      },
      errorToSource: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          try {
            throw "ets";
          } catch (e) {
            try {
              const tmp = (e as { toSource: () => unknown }).toSource();
              resolve([0, tmp !== undefined]);
            } catch (err) {
              resolve([0, false]);
            }
          }
          resolve([-1, null]);
        });
      },
      errors: (): Promise<[number, unknown[]]> => {
        return new Promise((resolve): void => {
          const errorTests = [
            () => new Function('alert(")'),
            () => new Function("const foo;foo.bar"),
            () => new Function("const a=1; const a=2;"),
            new Function("try{null.bar;return -1}catch(e){return e.message}"),
            new Function("try{abc.xyz=123;return -1}catch(e){return e.message}"),
            new Function("try{(1).toString(1000);return -1}catch(e){return e.message}"),
            new Function("try{[...undefined].length;return -1}catch(e){return e.message}"),
            new Function("try{var x=new Array(-1);return -1}catch(e){return e.message}"),
          ];
          const err = new Array();
          for (let i = 0; i < errorTests.length; i++) {
            try {
              const tmp = errorTests[i]();
              err.push(tmp);
            } catch (e) {
              err.push((e as Error).message);
            }
          }
          resolve([0, err]);
        });
      },
      installTrigger: (): Promise<[number, boolean]> => {
        return Promise.resolve([0, w.InstallTrigger !== undefined]);
      },
      rtt: (): Promise<[number, unknown]> => {
        return new Promise((resolve): void => {
          const con = n.connection;
          if (con === undefined) resolve([-1, null]);
          const rtt = con.rtt;
          if (rtt === undefined) resolve([-2, null]);
          resolve([0, rtt === 0]);
        });
      },
      math: (): Promise<[number, number]> => {
        return new Promise((resolve): void => {
          const m = Math;

          const returnZero = (): number => {
            return 0;
          };

          const e = 1e154;

          const fp = [
            (m.acos || returnZero)(0.12312423423423424),
            (m.acosh || returnZero)(1e308),
            m.log(e + m.sqrt(e * e - 1)),
            (m.asin || returnZero)(0.12312423423423424),
            (m.asinh || returnZero)(1),
            m.log(m.sqrt(2) + 1),
            (m.atanh || returnZero)(0.5),
            m.log(3) / 2,
            (m.atan || returnZero)(0.5),
            (m.sin || returnZero)(-1e300),
            (m.sinh || returnZero)(1),
            m.exp(1) - 1 / m.exp(1) / 2,
            (m.cos || returnZero)(10.000000000123),
            (m.cosh || returnZero)(1),
            (m.exp(1) + 1 / m.exp(1)) / 2,
            (m.tan || returnZero)(-1e300),
            (m.tanh || returnZero)(1),
            (m.exp(2) - 1) / (m.exp(2) + 1),
            (m.exp || returnZero)(1),
            (m.expm1 || returnZero)(1),
            m.exp(1) - 1,
            (m.log1p || returnZero)(10),
            m.log(11),
            m.pow(m.PI, -100),
          ];

          resolve([0, hash(JSON.stringify(fp), 420)]);
        });
      },
      notifications: (): Promise<[number, unknown]> => {
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
            .catch((res): void => {
              resolve([-4, null]);
            });
        });
      },
    };

    const index: string[] = [];
    const promises: Promise<unknown>[] = [];
    for (const method in fingerprints) {
      index.push(method);
      const promise = fingerprints[method]();
      promises.push(promise);
    }

    Promise.all(promises)
      .then((k): void => {
        const profile: Record<string, unknown> = {};
        for (let i = 0; i < index.length; i++) {
          profile[index[i]] = k[i];
        }
        const deviceId = hash(JSON.stringify(profile), 420);
        const persistentComponents = [
          profile.jsHeapSizeLimit,
          profile.audioContext,
          profile.canvasAPI,
          profile.performance,
          profile.speechSynthesis,
          profile.webglInfo,
          profile.webglProgram,
        ];
        const persistentId = hash(JSON.stringify(persistentComponents), 420);
        const output = {
          deviceId,
          persistentId,
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

export { fingerprint };
