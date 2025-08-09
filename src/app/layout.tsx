import type { Metadata, Viewport } from "next";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import SessionWrapper from '@/components/utils/SessionWrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

export const metadata: Metadata = {
  title: "Shy Cakes",
  description: "Мусові торти, Бісквітні торти, Macarons, Ескімо, Продукти, Подарункові набори",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
          <Header />
          <main className="min-h-screen pt-24 lg:pt-28">
            {children}
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </SessionWrapper>
      </body>
    </html>
  );
}