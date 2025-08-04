import type { Metadata } from "next";
import DynamicHeader from "@/components/Header/DynamicHeader";
import Footer from "@/components/Footer/footer";
import SessionWrapper from '@/components/utils/SessionWrapper';
import { CartProvider } from '@/contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
          <CartProvider>
            <DynamicHeader />
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
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}