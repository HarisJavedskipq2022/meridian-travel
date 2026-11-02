import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Meridian Travel: visas, flights, hotels and car rental",
    template: "%s | Meridian Travel",
  },
  description:
    "Check visa requirements, compare flights, book hotels and rent cars in one place. Planned by a Karachi travel team since 2014.",
  openGraph: {
    title: "Meridian Travel",
    description: "Visas, flights, hotels and car rental, planned in one place.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f2733",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The `js` class is added before hydration so scroll-reveal targets start hidden only when GSAP will run.
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add('js')`}
        </Script>
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-saffron px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
