// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/CartProvider';
import { Toaster } from 'react-hot-toast';
import FloatingButtons from '@/components/FloatingButtons';
import PromoMarquee from '@/components/PromoMarquee'; // <-- 1. IMPORT THE NEW COMPONENT

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vijaya Dates & Dry Fruits",
  description: "Taste and Eat! The finest selection of dates and dry fruits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className={`${inter.className} bg-stone-100 text-stone-800`}>
          <div className="flex flex-col min-h-screen">
            <CartProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <Toaster position="bottom-right" />
            </CartProvider>
          </div>
          <FloatingButtons />
          <PromoMarquee /> {/* <-- 2. ADD THE COMPONENT HERE */}
        </body>
      </html>
    </ClerkProvider>
  );
}