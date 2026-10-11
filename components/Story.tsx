import Link from 'next/link';
import { Flower2, Heart, Sparkles, Sun } from 'lucide-react';

const values = [
  { icon: Sparkles, label: 'Beauty' },
  { icon: Heart, label: 'Self care' },
  { icon: Flower2, label: 'Confidence' },
  { icon: Sun, label: 'Everyday' },
];

export default function Story() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20">
      <div className="grid overflow-hidden rounded-[2rem] border border-accent/30 bg-card md:grid-cols-2">
        <div className="flex flex-col justify-center gap-5 bg-gradient-to-br from-accent-deep/30 to-transparent p-10">
          <p className="font-display text-4xl italic">
            Small Tools
            <br />
            for a Bigger You
          </p>
          <Link
            href="/shop"
            className="w-fit rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-light"
          >
            Explore all products
          </Link>
        </div>
        <div className="p-10">
          <h2 className="font-display text-3xl font-medium">More than just tools</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            At Sareli, we believe that every little detail matters. Our journey started with a simple
            idea: to make high-quality, beautiful and reliable beauty tools accessible to every woman.
          </p>
          <ul className="mt-8 grid grid-cols-4 gap-4">
            {values.map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2 text-center text-xs text-muted">
                <Icon className="text-accent-light" size={24} strokeWidth={1.5} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
