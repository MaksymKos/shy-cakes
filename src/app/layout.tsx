import type { Metadata } from "next";
import DynamicHeader from "@/components/Header/DynamicHeader";
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
      <body className="antialiased" suppressHydrationWarning={true}>
        <SessionWrapper>
          <DynamicHeader />
          {children}
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}