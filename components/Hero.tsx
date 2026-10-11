import Image from 'next/image';
import Link from 'next/link';
import { Scissors, Sparkles } from 'lucide-react';

export default function Hero({ image }: { image?: string | null }) {
  return (
    <section className="hero-glow border-b border-line">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-sm text-accent-light">Premium beauty tools</p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] md:text-7xl">
            Small Tools,
            <br />
            <em className="font-normal">Big Confidence</em>
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            Premium beauty tools designed to make your everyday self-care easier, safer and more
            beautiful.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-accent-light"
            >
              Shop now
            </Link>
            <Link
              href="/#categories"
              className="rounded-full border border-accent/50 px-7 py-3 text-sm font-semibold text-cream transition-colors hover:border-accent-light hover:text-accent-light"
            >
              Explore collection
            </Link>
          </div>
        </div>

        {/* Image admin panel (Site images tab) se badalti hai */}
        <div className="relative mx-auto flex aspect-[4/3] w-full max-w-xl items-center justify-center overflow-hidden rounded-[2rem] border border-accent/30 bg-gradient-to-br from-card to-ink shadow-glow">
          {image ? (
            <Image src={image} alt="Sareli beauty tools" fill sizes="(max-width:768px) 100vw, 576px" className="object-cover" priority />
          ) : (
            <>
              <Scissors size={96} strokeWidth={1} className="text-accent-light" aria-hidden />
              <Sparkles size={28} className="absolute right-10 top-10 text-accent-light" aria-hidden />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
