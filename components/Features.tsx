import { Gem, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const items = [
  { icon: Gem, title: 'Premium quality', text: 'Long lasting & durable' },
  { icon: Truck, title: 'Fast & reliable shipping', text: 'Across Pakistan' },
  { icon: ShieldCheck, title: 'Secure payments', text: '100% safe & trusted' },
  { icon: RotateCcw, title: 'Easy returns', text: 'Hassle free' },
];

export default function Features() {
  return (
    <section className="border-y border-line bg-card/60">
      <ul className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center gap-3">
            <Icon className="text-accent-light" size={26} strokeWidth={1.5} aria-hidden />
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
