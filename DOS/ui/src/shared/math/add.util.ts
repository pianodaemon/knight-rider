import { Decimal } from 'decimal.js';

export const sub = (a: number | string, b: number | string): number => {
  return new Decimal(a).sub(new Decimal(b)).toNumber();
};
