'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation, EffectCreative } from 'swiper/modules';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';

const slides = [
  {
    title: 'Premium Hand-Picked Dates',
    moto: 'Taste the tradition of the Middle East, delivered fresh to your door.',
    buttonText: 'Shop All Dates',
    imageUrl: '/images/hero-dates.jpg',
  },
  {
    title: 'The Finest Assorted Nuts',
    moto: 'Discover a world of flavor with our crunchy, high-quality assorted nuts.',
    buttonText: 'Explore Our Nuts',
    imageUrl: '/images/hero-nuts.jpg',
  },
  {
    title: 'Exotic & Delicious Dried Fruits',
    moto: 'A sweet, healthy, and delightful treat for any time of the day.',
    buttonText: 'See The Collection',
    imageUrl: '/images/hero-dry-fruits.jpg',
  },
];

export default function HeroSlider() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <section className="relative h-[80vh] w-full bg-stone-100">
      <Swiper
        onSwiper={setSwiperInstance}
        modules={[Autoplay, Navigation, EffectCreative]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={800}
        effect="creative"
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ['-120%', 0, -500],
          },
          next: {
            shadow: true,
            translate: ['120%', 0, -500],
          },
        }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                priority={index === 0}
                className="transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Centered Content */}
            <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-md">
                  {slide.title}
                </h1>
                <p className="mt-4 text-lg text-stone-200 drop-shadow">
                  {slide.moto}
                </p>
                <button className="mt-8 px-8 py-3 bg-amber-400 text-stone-900 font-semibold rounded-md shadow-lg hover:bg-amber-500 transition-all duration-300">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 z-10 w-full flex justify-between px-4">
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="h-12 w-12 rounded-full bg-white/50 backdrop-blur-sm text-stone-800 hover:bg-white/80 transition-colors flex items-center justify-center"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => swiperInstance?.slideNext()}
          className="h-12 w-12 rounded-full bg-white/50 backdrop-blur-sm text-stone-800 hover:bg-white/80 transition-colors flex items-center justify-center"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}