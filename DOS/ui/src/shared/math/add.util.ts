import { Decimal } from 'decimal.js';

// @todo fix . (point) issue
export const sub = (a: number | string, b: number | string): number => {
  return new Decimal(a).sub(new Decimal(b)).toNumber();
};

export const add = (args: Array<number | string>): number => {
  return args.reduce(function (acc: any, next: any) {
      return new Decimal(next).add(acc);
    }, new Decimal(0)).toNumber();
};
