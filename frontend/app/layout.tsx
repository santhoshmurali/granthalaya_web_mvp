import type { Metadata } from "next";
import AlertBanner from "@/components/AlertBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@fontsource/marcellus";
import "@fontsource/hind/400.css";
import "@fontsource/hind/500.css";
import "@fontsource/hind/600.css";
import "@fontsource/hind/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sri Raghavendra Granthalaya",
  description: "A replica of Mantralayam, fragrant with devotion. Shrines, news and the story of Sri Raghavendra Granthalaya.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <AlertBanner />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
