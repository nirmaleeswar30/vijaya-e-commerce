// app/contact/page.tsx
'use client'; // This page contains a form, so it needs to be a Client Component

import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, you would send this data to an API endpoint
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you shortly.');
    // Optionally reset the form
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="bg-stone-50">
      {/* Header Section */}
      <div className="relative bg-stone-800">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="/images/hero-nuts.jpg" // You can use a relevant background image
            alt="Contact us background"
          />
          <div className="absolute inset-0 bg-stone-800 mix-blend-multiply" aria-hidden="true" />
        </div>
        <div className="relative mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Contact Us</h1>
          <p className="mt-6 max-w-3xl text-xl text-stone-300">
            Have a question or feedback? We'd love to hear from you. Reach out to us, and we'll respond as soon as we can.
          </p>
        </div>
      </div>

      {/* Main Content: Form and Info */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Send Us A Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700">Name</label>
                  <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700">Email</label>
                  <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-stone-700">Phone (Optional)</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700">Message</label>
                <textarea name="message" id="message" rows={4} required value={formData.message} onChange={handleChange} className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3" />
              </div>
              <div>
                <button type="submit" className="w-full justify-center rounded-md border border-transparent bg-amber-500 py-3 px-6 text-base font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors">
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold text-stone-800 mb-6">Our Information</h2>
                <div className="space-y-4">
                    <div className="flex items-start">
                        <PhoneIcon className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-stone-800">Phone</h3>
                            <p className="text-stone-600">Give us a call for immediate assistance.</p>
                            <a href="tel:+911234567890" className="text-amber-600 hover:underline">+91 12345 67890</a>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <EnvelopeIcon className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-stone-800">Email</h3>
                            <p className="text-stone-600">For general inquiries, support, or feedback.</p>
                            <a href="mailto:support@vijayadates.com" className="text-amber-600 hover:underline">support@vijayadates.com</a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Embedded Google Map */}
            <div>
              <h3 className="text-lg font-medium text-stone-800 mb-4">Our Location</h3>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-stone-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.037381986968!2d75.78018231526845!3d11.2587532919958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65935e69e48c3%3A0x78939aa2f896b0c!2sKozhikode%2C%20Kerala!5e0!3m2!1sen!2sin!4f139.7570880345053"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}