import type { Metadata } from "next";
import DynamicHeader from "@/components/Header/DynamicHeader";
import Footer from "@/components/Footer/footer";
import SessionWrapper from '@/components/utils/SessionWrapper';
import "./globals.css";

export const metadata: Metadata = {
  title: "Shy Cakes",
  description: "Мусові торти, Бісквітні торти, Macarons, Ескімо, Продукти, Подарункові набори",
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
          <main className="min-h-screen pt-24 lg:pt-28">
            {children}
          </main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}