import { P } from "../types";

export const errors = (): Promise<[number, unknown]> => {
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
    const errors: string[] = [];
    for (const errorTest of errorTests) {
      try {
        errors.push(errorTest());
      } catch (error) {
        errors.push((error as Error).message);
      }
    }
    resolve([0, errors]);
  });
};

export const errorToSource = (): P => {
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
};
