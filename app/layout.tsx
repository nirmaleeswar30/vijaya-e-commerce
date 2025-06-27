// app/layout.tsx
'use client'; // This must be a client component to manage loading state

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { AnimatePresence } from 'framer-motion';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/CartProvider';
import { Toaster } from 'react-hot-toast';
import FloatingButtons from '@/components/FloatingButtons';
import Preloader from '@/components/Preloader'; // <-- IMPORT

const inter = Inter({ subsets: ["latin"] });

// We can't export metadata from a client component, but we can manage the title here
// For full SEO, you'd handle metadata on a per-page basis.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timer to hide the preloader after a few seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Optional: re-enable scrolling if you disabled it
      document.body.style.overflow = 'auto';
    }, 3000); // 3 seconds, adjust as needed

    // Optional: disable scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    // Cleanup function
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto'; // Make sure scrolling is re-enabled on component unmount
    };
  }, []);

  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <head>
          <title>Vijaya Dates & Dry Fruits</title>
          <meta name="description" content="Taste and Buy! The finest selection of dates and dry fruits." />
        </head>
        <body className={`${inter.className} bg-stone-100 text-stone-800`}>
          <AnimatePresence mode="wait">
            {isLoading && <Preloader />}
          </AnimatePresence>
          
          <div className="flex flex-col min-h-screen">
            <CartProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <Toaster position="bottom-right" />
            </CartProvider>
          </div>
          <FloatingButtons />
        </body>
      </html>
    </ClerkProvider>
  );
}