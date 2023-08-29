import { hash, webglExtensionList, webglParameterNames } from "../lib";
import { P } from "../types";
import { isBrave, isFirefoxResistFingerprinting } from "./browser";

const precisionTypes = ["LOW_FLOAT", "MEDIUM_FLOAT", "HIGH_FLOAT", "LOW_INT", "MEDIUM_INT", "HIGH_INT"];
const shaderTypes = ["FRAGMENT_SHADER", "VERTEX_SHADER"];
const vendorPrefixes = ["", "WEBKIT_", "MOZ_", "O_", "MS_"];

function getShaderPrecision(ctx: WebGLRenderingContext | WebGL2RenderingContext, shaderType: string, precisionType: string) {
  const shaderPrecision = ctx.getShaderPrecisionFormat(ctx[shaderType], ctx[precisionType]);
  if (shaderPrecision == null) return null;
  return [shaderPrecision.rangeMin, shaderPrecision.rangeMax, shaderPrecision.precision];
}

function programShader(
  ctx: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  step: number,
  source: string
) {
  const shader = ctx.createShader(35633 - step) as WebGLShader;
  ctx.shaderSource(shader, source);
  ctx.compileShader(shader);
  ctx.attachShader(program, shader);
}

export const webglInfo = (): P => {
  return new Promise((resolve): void => {
    const canvas = document.createElement("canvas");

    try {
      const ctx: WebGLRenderingContext | WebGL2RenderingContext =
        canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGL2RenderingContext);

      if (ctx == null) resolve([-1, null]);

      const output: Record<string, number | unknown[]> = {};

      const debugExtension = ctx.getExtension("WEBGL_debug_renderer_info");

      if (!debugExtension) resolve([-3, null]);

      output.unmaskedVendor = isBrave() || !debugExtension ? null : ctx.getParameter(debugExtension.UNMASKED_VENDOR_WEBGL);
      output.unmaskedRenderer = isBrave() || !debugExtension ? null : ctx.getParameter(debugExtension.UNMASKED_RENDERER_WEBGL);
      output.version = ctx.getParameter(ctx.VERSION);
      output.shaderVersion = ctx.getParameter(ctx.SHADING_LANGUAGE_VERSION);
      output.vendor = ctx.getParameter(ctx.VENDOR);
      output.renderer = ctx.getParameter(ctx.RENDERER);

      output.attributes = [];
      const glContextAttributes = ctx.getContextAttributes();
      for (const attribute in glContextAttributes) {
        if (attribute in glContextAttributes) {
          output.attributes.push(`${attribute}=${glContextAttributes[attribute]}`);
        }
      }

      output.parameters = [];
      for (const param of webglParameterNames) {
        output.parameters.push(`${param}=${ctx.getParameter(ctx[param])}`);
      }

      output.shaderPrecision = [];
      for (const shaderType of shaderTypes) {
        for (const precisionType of precisionTypes) {
          output.shaderPrecision.push(getShaderPrecision(ctx, shaderType, precisionType));
        }
      }

      output.extensions = [];
      const extensions = ctx.getSupportedExtensions();
      for (const extension in extensions) {
        output.extensions.push(extension);
      }

      output.constants = [];
      for (const vendorPrefix in vendorPrefixes) {
        for (const extension in webglExtensionList) {
          const extensionParameters = webglExtensionList[extension];
          const supported = ctx.getExtension(vendorPrefix + extension);
          if (supported) {
            for (const extensionParameter in extensionParameters) {
              const extensionParameterValue = supported[extensionParameter];
              output.constants.push(`${vendorPrefix}${extension}_${extensionParameter}=${extensionParameterValue}`);
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
};

export const webglProgram = (): P => {
  return new Promise((resolve): void => {
    if (isBrave() || isFirefoxResistFingerprinting()) resolve([-3, null]);

    const canvas = document.createElement("canvas");

    try {
      const ctx: WebGLRenderingContext | WebGL2RenderingContext =
        canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGL2RenderingContext);

      if (ctx == null) resolve([-1, null]);

      ctx.clearColor(0, 0, 1, 1);

      const program = ctx.createProgram() as WebGLProgram;

      programShader(
        ctx,
        program,
        0,
        "attribute vec2 p;uniform float t;void main(){float s=sin(t);float c=cos(t);gl_Position=vec4(p*mat2(c,s,-s,c),1,1);}"
      );
      programShader(ctx, program, 1, "void main(){gl_FragColor=vec4(1,0,0,1);}");

      ctx.linkProgram(program);
      ctx.useProgram(program);
      ctx.enableVertexAttribArray(0);
      const uniform = ctx.getUniformLocation(program, "t");

      const buffer = ctx.createBuffer();
      ctx.bindBuffer(34962, buffer);
      ctx.bufferData(34962, new Float32Array([0, 1, -1, -1, 1, -1]), 35044);
      ctx.vertexAttribPointer(0, 2, 5126, false, 0, 0);

      ctx.clear(16384);
      ctx.uniform1f(uniform, 3.65);
      ctx.drawArrays(4, 0, 3);

      resolve([0, hash(canvas.toDataURL(), 420)]);
    } catch (e) {
      resolve([-2, null]);
    }
  });
};
