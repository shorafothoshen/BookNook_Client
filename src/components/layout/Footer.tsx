import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const BookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
    <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
  </svg>
);

/* ---------- social icons ---------- */
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const socials = [
  { label: "X", href: "https://x.com", icon: XIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
];

const contacts = [
  { icon: Mail, text: "support@booknook.com", href: "mailto:support@booknook.com" },
  { icon: Phone, text: "+880 1234 567890", href: "tel:+8801234567890" },
  { icon: MapPin, text: "12 Reading Lane, Book City" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#1b1f2a] text-slate-300">
      {/* thin orange glow line, same as the navbar */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-14">
          {/* ---------- Logo + short line ---------- */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500 text-white">
                <BookIcon />
              </span>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                BookNook
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              BookNook is a small online library. Add a book, borrow a book and
              return it when you are done.
            </p>
          </div>

          {/* ---------- Contact ---------- */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Contact</h3>
            <div className="mt-2 h-0.5 w-8 rounded-full bg-orange-500" />
            <ul className="mt-5 space-y-3.5 text-sm">
              {contacts.map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-orange-500/10 text-orange-400">
                    <Icon className="size-4" />
                  </span>
                  {href ? (
                    <a
                      href={href}
                      className="break-all pt-1 transition-colors hover:text-orange-400"
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="pt-1">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Social ---------- */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Follow Us</h3>
            <div className="mt-2 h-0.5 w-8 rounded-full bg-orange-500" />
            <p className="mt-5 text-sm text-slate-400">
              Stay in touch for new books and updates.
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-white/15 text-slate-300 transition hover:-translate-y-0.5 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- Copyright ---------- */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left sm:text-sm">
          <p>&copy; {new Date().getFullYear()} BookNook. All rights reserved.</p>
          <p>Add a book, borrow a book, return a book.</p>
        </div>
      </div>
    </footer>
  );
}