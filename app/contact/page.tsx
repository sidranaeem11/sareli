import { Mail, MessageCircle } from 'lucide-react';
import { SITE } from '@/lib/config';

export const metadata = { title: 'Contact | Sareli' };

export default function Contact() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-5xl font-medium">Contact us</h1>
      <p className="mt-5 text-muted">Order, delivery ya product ke bare mein kuch poochna ho to hamein message karo.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href={`https://wa.me/${SITE.whatsapp}`} className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-card p-5 hover:shadow-glow">
          <MessageCircle className="text-accent-light" aria-hidden />
          <span>
            <span className="block text-sm font-semibold">WhatsApp</span>
            <span className="text-sm text-muted">+{SITE.whatsapp}</span>
          </span>
        </a>
        <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-card p-5 hover:shadow-glow">
          <Mail className="text-accent-light" aria-hidden />
          <span>
            <span className="block text-sm font-semibold">Email</span>
            <span className="text-sm text-muted">{SITE.email}</span>
          </span>
        </a>
      </div>
    </main>
  );
}
