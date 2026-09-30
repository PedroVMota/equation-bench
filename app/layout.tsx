import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const BODY_CLASS =
  "h-full overflow-hidden bg-zinc-50 font-sans text-zinc-900 antialiased " +
  "dark:bg-zinc-950 dark:text-zinc-100";

export const metadata: Metadata = {
  title: "Equation Bench",
  description: "A LaTeX math toolbox with live rendering and multi-line derivations.",
};

export default function RootLayout({ children }: LayoutProps<"/">): React.ReactElement {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable} h-full`}>
      <body className={BODY_CLASS}>
        {children}
      </body>
    </html>
  );
}
