export type P<T = unknown> = Promise<[number, T]>;

export type R<T = unknown> = Record<string, T>;

export type FingerprintNavigator = Navigator &
  R<R> & {
    userAgentData: R & {
      getHighEntropyValues: (a: string[]) => Promise<R>;
    };
  };

export type FingerprintWindow = Window &
  typeof globalThis &
  R<R> & {
    ApplePaySession: {
      canMakePayments: () => boolean;
    };
    SharedArrayBuffer: (x?: number) => void;
  };
