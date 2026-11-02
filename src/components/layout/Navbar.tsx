"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { Logo } from "./Logo";
import { navLinks } from "./nav-links";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Over the dark home hero the bar is transparent; everywhere else it's solid.
  const solid = scrolled || pathname !== "/" || menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      if (!menuOpen || prefersReducedMotion()) return;
      gsap.from("[data-menu-item]", { y: 24, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" });
    },
    { scope: menuRef, dependencies: [menuOpen] },
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300",
          solid
            ? "bg-paper/90 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
            : "bg-transparent text-paper",
        )}
      >
        <nav className="container-page flex h-[4.5rem] items-center justify-between gap-6" aria-label="Main">
          <Logo tone={solid ? "dark" : "light"} />

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors",
                    solid ? "text-slate hover:text-ink" : "text-paper/75 hover:text-paper",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ButtonLink href="/search?type=flights" size="sm" variant="primary" className="hidden sm:inline-flex">
              Plan a trip
            </ButtonLink>
            <button
              type="button"
              className="-mr-2 rounded-full p-2 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
            </button>
          </div>
        </nav>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise contain this fixed panel. */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-paper lg:hidden"
        >
          <ul className="container-page flex flex-col py-6">
            {navLinks.map((link) => (
              <li key={link.href} data-menu-item className="border-b border-line">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 font-display text-3xl font-bold tracking-tight text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li data-menu-item className="pt-8">
              <ButtonLink href="/search?type=flights" size="lg" className="w-full" onClick={() => setMenuOpen(false)}>
                Plan a trip
              </ButtonLink>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
