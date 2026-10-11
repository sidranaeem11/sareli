import { SITE } from './config';

export const rs = (n: number) => `Rs. ${Number(n).toLocaleString('en-PK')}`;

export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= SITE.freeShippingAbove ? 0 : SITE.shippingFee;
