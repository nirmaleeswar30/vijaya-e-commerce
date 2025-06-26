// app/about/page.tsx
import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon, BeakerIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';

// You can define team members here or fetch them from a CMS
const teamMembers = [
  {
    name: 'Rohan Sharma',
    role: 'Founder & CEO',
    imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
  },
  {
    name: 'Priya Mehta',
    role: 'Head of Quality & Sourcing',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=461&q=80',
  },
  {
    name: 'Sameer Khan',
    role: 'Logistics & Operations',
    imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
  },
];

const values = [
    {
        name: 'Uncompromising Quality',
        description: 'We travel the globe to source only the finest, most flavorful dates and nuts. Each product is hand-selected and rigorously tested to meet our high standards.',
        icon: SparklesIcon,
    },
    {
        name: 'Rooted in Tradition',
        description: 'Our methods are inspired by generations of knowledge, preserving the authentic taste and nutritional benefits that have been cherished for centuries.',
        icon: ArrowPathIcon,
    },
    {
        name: 'Customer Happiness',
        description: 'Your satisfaction is our purpose. From our family to yours, we are dedicated to providing a delightful experience and products you can trust.',
        icon: HeartIcon,
    },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-stone-800">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="/images/hero-dry-fruits.jpg" // A warm, inviting background image
            alt="A spread of various dry fruits and nuts"
          />
          <div className="absolute inset-0 bg-amber-900 mix-blend-multiply" aria-hidden="true" />
        </div>
        <div className="relative mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">A Tradition of Taste & Trust</h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-stone-200">
            For over 40 years, Vijaya has been more than just a brand; it's a promise of quality, heritage, and the finest natural delicacies delivered to your home.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="overflow-hidden bg-stone-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-amber-600">Our Journey</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">From a Humble Beginning</h2>
                <p className="mt-6 text-xl leading-8 text-stone-700">
                  Founded in a small market stall with a passion for authentic flavors, Vijaya Dates & Dry Fruits began with a simple mission: to share the natural goodness of the earth with our community.
                </p>
                <p className="mt-8 text-base leading-7 text-stone-600">
                  What started as a curated selection of premium dates has grown into a celebrated collection of the world's finest dry fruits, nuts, and natural snacks. We've built lasting relationships with farmers and producers who share our commitment to sustainable and ethical practices, ensuring every product we offer is one we are proud to serve at our own family table.
                </p>
              </div>
            </div>
            <div className="sm:px-6 lg:px-0">
                <div className="relative isolate overflow-hidden bg-amber-500 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pt-16 sm:pl-16 sm:pr-0 lg:mx-0 lg:max-w-none">
                <div className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-amber-100 opacity-20 ring-1 ring-inset ring-white" aria-hidden="true" />
                <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                    <img src="https://images.pexels.com/photos/27080476/pexels-photo-27080476.jpeg" alt="Dates in a traditional market" className="w-[36rem] max-w-none rounded-tl-3xl bg-stone-800 ring-1 ring-stone-900/10" width={912} height={1024} />
                </div>
                <div className="pointer-events-none absolute-inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl" aria-hidden="true" />
                </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Values Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="text-base font-semibold leading-7 text-amber-600">Our Promise</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Everything We Do is For You</h2>
            <p className="mt-6 text-lg leading-8 text-stone-600">
              Our principles guide every decision we make, from sourcing our ingredients to packing your order.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {values.map((value) => (
                <div key={value.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-stone-900">
                    <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                      <value.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {value.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-stone-600">{value.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="bg-stone-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Meet Our Leadership</h2>
            <p className="mt-6 text-lg leading-8 text-stone-600">
              We’re a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.
            </p>
          </div>
          <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {teamMembers.map((person) => (
              <li key={person.name}>
                <img className="aspect-[3/2] w-full rounded-2xl object-cover" src={person.imageUrl} alt="" />
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-stone-900">{person.name}</h3>
                <p className="text-base leading-7 text-stone-600">{person.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Call to Action Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-stone-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg viewBox="0 0 1024 1024" className="absolute top-1/2 left-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:translate-y-0 lg:-translate-x-1/2" aria-hidden="true">
              <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#f59e0b" />
                  <stop offset={1} stopColor="#b45309" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Taste the difference.</h2>
              <p className="mt-6 text-lg leading-8 text-stone-300">
                Ready to experience the quality and tradition we stand for? Explore our curated collection of natural delicacies.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link href="/products" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-stone-900 shadow-sm hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  Shop Now
                </Link>
                <Link href="/contact" className="text-sm font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <img className="absolute top-0 left-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10" src="https://images.pexels.com/photos/7427428/pexels-photo-7427428.jpeg" alt="App screenshot" width={1824} height={1080} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}