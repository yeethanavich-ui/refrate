import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ref Reviews — Fencing Referee Ratings",
  description: "Find and rate fencing referees from real tournaments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body min-h-screen bg-piste-950">
        <header className="border-b border-piste-700 bg-piste-900">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-display text-xl tracking-wide text-steel-100">
              REF<span className="text-touche">REVIEWS</span>
            </Link>
            <nav className="text-sm text-steel-300">
              <Link href="/" className="hover:text-touche">
                Search referees
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
        <footer className="mx-auto max-w-4xl px-6 py-10 text-xs text-steel-400">
          Ratings reflect individual fencers&apos; experiences at specific
          tournaments. Be fair, be specific, be honest.
        </footer>
      </body>
    </html>
  );
}
