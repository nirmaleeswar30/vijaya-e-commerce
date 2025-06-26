// components/Footer.tsx
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'; // Using react-icons for social media

export default function Footer() {
    return (
        <footer className="bg-amber-500 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Column 1: Links */}
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/contact" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">Contact Us</Link></li>
                            <li><Link href="#" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">Blogs</Link></li>
                            <li><Link href="#" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">Recipes</Link></li>
                            <li><Link href="#" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">News</Link></li>
                        </ul>
                    </div>
                    {/* Column 2: Products */}
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase">Products</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/products/dates" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">Dates</Link></li>
                            <li><Link href="/products/nuts" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">Nuts</Link></li>
                            <li><Link href="/products/dry-fruits" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">Dry Fruits</Link></li>
                            <li><Link href="/products/seeds" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">Seeds</Link></li>
                        </ul>
                    </div>
                    {/* Column 3: Legal */}
                     <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/about" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">About Us</Link></li>
                            <li><Link href="#" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">Terms & Conditions</Link></li>
                            <li><Link href="#" className="text-base text-white/80 hover:text-white transition-colors hover:underline underline-offset-2">Refund Policy</Link></li>
                        </ul>
                    </div>
                    {/* Column 4: Social */}
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase">Follow Us</h3>
                        <div className="flex mt-6 space-x-6">
                            {/* Replace # with your actual social media links */}
                            <a href="#" className="text-white/80 hover:text-white transition-colors"><span className="sr-only">Facebook</span><FaFacebookF size={20}/></a>
                            <a href="#" className="text-white/80 hover:text-white transition-colors"><span className="sr-only">Instagram</span><FaInstagram size={20}/></a>
                            <a href="#" className="text-white/80 hover:text-white transition-colors"><span className="sr-only">Twitter</span><FaTwitter size={20}/></a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-amber-300 pt-8 text-center">
                    <p>© {new Date().getFullYear()} Vijaya Dates & Dry Fruits. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}