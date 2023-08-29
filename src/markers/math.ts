import { hash } from "../lib";
import { P } from "../types";

export const math = (): P => {
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
};
