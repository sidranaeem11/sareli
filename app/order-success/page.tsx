import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { SITE } from '@/lib/config';

export default function OrderSuccess({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams.id ?? '';
  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hi, mera order number ${id} hai.`)}`;

  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center">
      <CheckCircle2 size={56} className="mx-auto text-accent-light" aria-hidden />
      <h1 className="mt-6 font-display text-4xl font-medium">Order placed</h1>
      {id && <p className="mt-3 text-muted">Order number: <span className="text-cream">{id}</span></p>}
      <p className="mt-4 text-muted leading-relaxed">
        Shukriya! Hum jaldi aapse phone ya WhatsApp par rabta karenge. Delivery se pehle order confirm kiya jayega.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={wa} className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white hover:bg-accent-light">Message us on WhatsApp</a>
        <Link href="/shop" className="rounded-full border border-accent/50 px-7 py-3 text-sm font-semibold hover:text-accent-light">Continue shopping</Link>
      </div>
    </main>
  );
}
