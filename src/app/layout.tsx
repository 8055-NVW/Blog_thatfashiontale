import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "@thatfashiontale",
  description: "Personal blog of Evy Antao",
};

const themeBootstrapScript = `
(() => {
  const storageKey = "theme-preference";
  const root = document.documentElement;
  const savedTheme = window.localStorage.getItem(storageKey);
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : systemTheme;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSans.variable} flex min-h-screen flex-col antialiased`}>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrapScript}
        </Script>
        <SessionProvider>
          <NavBar />
          <main className="flex-1 pb-10 md:pb-14">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
