// components/Navbar.tsx
'use client';

import { useState, Fragment, useRef, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import CartPanel from './CartPanel';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon, Bars3Icon, ShoppingBagIcon } from '@heroicons/react/20/solid';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  // --- All constants and helpers are now INSIDE the component ---

  const searchableItems = [
    { name: 'Home', href: '/' }, 
    { name: 'About Us', href: '/about' }, 
    { name: 'Contact', href: '/contact' }, 
    { name: 'All Products', href: '/products/all' }, 
    { name: 'Dates', href: '/products/dates' }, 
    { name: 'Nuts', href: '/products/nuts' }, 
    { name: 'Dry Fruits', href: '/products/dry-fruits' }, 
    { name: 'Spices', href: '/products/spices' }, 
    { name: 'Snacks', href: '/products/snacks' }, 
    { name: 'Seeds', href: '/products/seeds' }, 
  ];

  const productCategories = [ 
    { name: 'All Products', description: 'Browse our entire collection.', href: '/products/all' }, 
    { name: 'Dates', description: 'Sweet, nutritious, and hand-picked.', href: '/products/dates' }, 
    { name: 'Nuts', description: 'A variety of crunchy, wholesome nuts.', href: '/products/nuts' }, 
    { name: 'Dry Fruits', description: 'Naturally sweet and healthy treats.', href: '/products/dry-fruits' }, 
    { name: 'Spices', description: 'Aromatic spices for your kitchen.', href: '/products/spices' }, 
    { name: 'Snacks', description: 'Savory and delicious snack options.', href: '/products/snacks' }, 
    { name: 'Seeds', description: 'Nutrient-packed seeds for a healthy diet.', href: '/products/seeds' }, 
  ];

  const linkUnderline = `relative text-sm font-medium transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:rounded-xl after:bg-amber-500 after:transition-all after:duration-300`;

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { cartCount } = useCart();
  const pathname = usePathname();

  const handleEnter = () => { if (timeoutRef.current) { clearTimeout(timeoutRef.current); } setIsProductsOpen(true); };
  const handleLeave = () => { timeoutRef.current = setTimeout(() => { setIsProductsOpen(false); }, 200); };
  
  const filteredItems = searchQuery ? searchableItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  const isActive = (href: string) => { if (href === '/') { return pathname === '/'; } return pathname.startsWith(href); };
  const isProductsActive = pathname.startsWith('/products');

  const getLinkClasses = (isActiveFlag: boolean) => `
    ${linkUnderline} pb-1 ${isActiveFlag ? 'text-amber-600 after:w-full' : 'text-stone-600 hover:text-stone-900 after:w-0 hover:after:w-full'}
  `;

  return (
    <>
      <nav className="sticky top-0 w-full z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and mobile menu button */}
            <div className="flex items-center">
              <button type="button" className="md:hidden p-2 rounded-md text-stone-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex-shrink-0 ml-2 md:ml-0">
                <Link href="/" className="flex items-center space-x-2">
                  <NextImage src="/logo.png" alt="Vijaya Logo" width={160} height={40} priority />
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className={getLinkClasses(isActive('/'))}>HOME</Link>
              <Link href="/about" className={getLinkClasses(isActive('/about'))}>ABOUT US</Link>
              <Popover className="relative">
                <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                  <Popover.Button as="div" className={`${linkUnderline} pb-1 inline-flex items-center gap-x-1 cursor-pointer ${isProductsOpen || isProductsActive ? 'text-amber-600 after:w-full' : 'text-stone-600 hover:text-stone-900 after:w-0 hover:after:w-full'}`}>
                    <span>PRODUCTS</span>
                    <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isProductsOpen ? 'rotate-180 text-amber-500' : 'text-stone-400'}`} aria-hidden="true" />
                  </Popover.Button>
                  <Transition as={Fragment} show={isProductsOpen} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                    <Popover.Panel static className="absolute left-1/2 z-10 mt-3 w-screen max-w-2xl -translate-x-1/2 transform px-4 sm:px-0">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 border-4 border-amber-400">
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 bg-white p-4">
                          {productCategories.map((item) => (
                            <Link key={item.name} href={item.href} className={`flex flex-col justify-start rounded-lg p-3 transition duration-150 ease-in-out ${isActive(item.href) ? 'bg-amber-100 border-l-4 border-amber-500' : 'hover:bg-amber-50'}`}>
                              <p className={`text-sm font-medium ${isActive(item.href) ? 'text-amber-800' : 'text-stone-900'}`}>{item.name}</p>
                              <p className="mt-1 text-sm text-stone-500">{item.description}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </div>
              </Popover>
              <Link href="/contact" className={getLinkClasses(isActive('/contact'))}>CONTACT</Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-2">
              <div className="hidden md:block relative">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-800" />
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-10 pr-10 rounded-full border border-stone-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 placeholder:text-stone-400" />
                  {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"><XMarkIcon className="h-5 w-5" /></button>)}
                </div>
                <AnimatePresence>
                  {searchQuery && filteredItems.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full mt-2 w-full max-w-sm rounded-md bg-white shadow-lg border border-stone-200 z-50">
                      <ul className="py-2">
                        {filteredItems.map(item => (
                          <li key={item.href}><Link href={item.href} onClick={() => setSearchQuery('')} className={`block px-4 py-2 text-sm transition-colors ${isActive(item.href) ? 'bg-amber-100 text-amber-800' : 'text-stone-700 hover:bg-amber-50'}`}>{item.name}</Link></li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="transition-transform duration-200 hover:scale-110"><SignedIn><UserButton afterSignOutUrl="/" /></SignedIn><SignedOut><Link href="/sign-in" className="hidden md:block text-sm font-medium text-stone-600 hover:text-amber-500">Sign In</Link></SignedOut></div>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full text-stone-600 hover:bg-stone-100"><ShoppingBagIcon className="h-6 w-6" />{cartCount > 0 && (<span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white ring-2 ring-white">{cartCount}</span>)}</button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <Transition show={isMobileMenuOpen} as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
          <div className="md:hidden absolute top-20 inset-x-0 z-30 bg-white shadow-lg border-t">
            <div className="px-4 py-3 space-y-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-800" /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-10 pr-10 rounded-full border border-stone-300 focus:ring-2 focus:ring-amber-400" />{searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400"><XMarkIcon className="h-5 w-5" /></button>)}
              </div>
              <div className="space-y-2">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-amber-100 text-amber-800' : 'text-stone-700 hover:bg-stone-50'}`}>HOME</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/about') ? 'bg-amber-100 text-amber-800' : 'text-stone-700 hover:bg-stone-50'}`}>ABOUT US</Link>
                <div className="relative"><button onClick={() => setIsProductsOpen(!isProductsOpen)} className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium ${isProductsOpen || isProductsActive ? 'bg-amber-100 text-amber-800' : 'text-stone-700 hover:bg-stone-50'}`}>PRODUCTS <ChevronDownIcon className={`h-5 w-5 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} /></button><Transition show={isProductsOpen} as={Fragment}><div className="pl-4 space-y-1 mt-1">{productCategories.map((item) => (<Link key={item.name} href={item.href} onClick={() => { setIsMobileMenuOpen(false); setIsProductsOpen(false); }} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.href) ? 'bg-amber-50 text-amber-700 border-l-4' : 'text-stone-700 hover:bg-stone-50'}`}>{item.name}</Link>))}</div></Transition></div>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact') ? 'bg-amber-100 text-amber-800' : 'text-stone-700 hover:bg-stone-50'}`}>CONTACT</Link>
                <SignedOut><Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50">Sign In</Link></SignedOut>
              </div>
            </div>
          </div>
        </Transition>
      </nav>
      <CartPanel open={isCartOpen} setOpen={setIsCartOpen} />
    </>
  );
}