import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "WatchNS — Network School Videos",
  description:
    "Discover and watch social media videos from Network School members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-body">
        <TopNav />
        <main className="flex-1 pt-[72px] pb-24 md:pb-8">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
