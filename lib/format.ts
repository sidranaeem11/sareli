import { SITE } from './config';

export const rs = (n: number) => `Rs. ${Number(n).toLocaleString('en-PK')}`;

export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= SITE.freeShippingAbove ? 0 : SITE.shippingFee;

// "S, M,L" -> ['S','M','L']
export const parseSizes = (s: string | null | undefined): string[] =>
  s ? s.split(',').map((x) => x.trim()).filter(Boolean) : [];
