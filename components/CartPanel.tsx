// components/CartPanel.tsx
'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from './CartProvider';
import Image from 'next/image';
import Link from 'next/link';

interface CartPanelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const formatPrice = (priceInPaise: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(priceInPaise / 100);
};

export default function CartPanel({ open, setOpen }: CartPanelProps) {
  const { cartItems, cartCount, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-amber-50 shadow-xl">
                    <div className="px-4 py-6 sm:px-6 bg-white border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Shopping Cart</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      {cartCount === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-gray-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.09-.834l1.5-6A1.125 1.125 0 0 0 18 5.25H5.207L4.607 3H2.25" />
                            </svg>
                            <p className="mt-4 text-lg text-center text-gray-500">Your cart is empty.</p>
                            <p className="mt-2 text-sm text-center text-gray-400">Looks like you haven't added anything yet.</p>
                            <button
                                onClick={() => setOpen(false)}
                                className="mt-6 text-sm font-medium text-amber-400 hover:text-amber-600"
                            >
                                Continue Shopping →
                            </button>
                        </div>
                      ) : (
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {cartItems.map((product) => (
                            <li key={product.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <Image src={product.image} alt={product.name} width={100} height={100} className="h-full w-full object-cover object-center" />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3><Link href={`/products/${product.id}`} onClick={() => setOpen(false)} className="hover:underline">{product.name}</Link></h3>
                                    <p className="ml-4">{formatPrice(product.price * product.quantity)}</p>
                                    </div>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center border border-gray-200 rounded">
                                    <button onClick={() => decreaseQuantity(product.id)} className="px-2 py-1 text-gray-500 hover:text-black">-</button>
                                    <p className="px-3 py-1 text-gray-900">{product.quantity}</p>
                                    <button onClick={() => addToCart(product)} className="px-2 py-1 text-gray-500 hover:text-black">+</button>
                                    </div>
                                    <div className="flex">
                                    <button onClick={() => removeFromCart(product.id)} type="button" className="font-medium text-red-600 hover:text-red-500">
                                        Remove
                                    </button>
                                    </div>
                                </div>
                                </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {cartCount > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-white">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>{formatPrice(subtotal)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                          <Link href="/checkout" onClick={() => setOpen(false)} className="flex items-center justify-center rounded-md border border-transparent bg-amber-300 px-6 py-3 text-base font-medium text-gray-900 shadow-sm hover:bg-amber-400 transition-colors">
                            Checkout
                          </Link>
                        </div>
                        <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                           <p>
                             or 
                             <button type="button" className="font-medium text-amber-400 hover:text-amber-600" onClick={() => setOpen(false)}>
                               Continue Shopping<span aria-hidden="true"> →</span>
                             </button>
                           </p>
                         </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}