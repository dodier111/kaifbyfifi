export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-amber-100 to-yellow-100 text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-light italic mb-6 font-dancing-script text-amber-700">Kaif by Fifi</h3>
            <p className="text-stone-600 leading-relaxed">
              Elegant jewelry crafted with passion and precision. Each piece tells a story of timeless beauty.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-700">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-stone-600 hover:text-amber-600 transition-colors duration-300">Home</a></li>
              <li><a href="/products" className="text-stone-600 hover:text-amber-600 transition-colors duration-300">Collections</a></li>
              <li><a href="/about" className="text-stone-600 hover:text-amber-600 transition-colors duration-300">About</a></li>
              <li><a href="/contact" className="text-stone-600 hover:text-amber-600 transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-700">Contact</h3>
            <div className="space-y-3 text-stone-600">
              <p className="flex items-center">
                <span className="text-amber-600 mr-2">✉</span>
                info@kaifbyfifi.com
              </p>
              <p className="flex items-center">
                <span className="text-amber-600 mr-2">📞</span>
                (123) 456-7890
              </p>
              <p className="flex items-center">
                <span className="text-amber-600 mr-2">📍</span>
                New York, NY
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-amber-200 text-center">
          <p className="text-stone-500">&copy; 2024 Kaif by Fifi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}