import type { Metadata } from "next";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import SessionWrapper from '@/components/utils/SessionWrapper';
import "./globals.css";

export const metadata: Metadata = {
  title: "Shy Cakes",
  description: "Мусові торти, Бісквітні торти, Macarons, Ескімо, Cake-pops, Подарункові набори",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="uk">
      <body className="antialiased">
        <SessionWrapper>
          <Header />
          {children}
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}