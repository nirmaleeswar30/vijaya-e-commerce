// components/Newsletter.tsx
export default function Newsletter() {
  return (
    <section className="py-16 bg-amber-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-xl text-amber-100 mb-8">
          Get the latest offers, new product launches, and health tips delivered to your inbox.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-6 py-3 rounded-lg placeholder-gray-500 border border-white focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button type="submit" className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}