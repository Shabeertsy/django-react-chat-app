export default function Navbar() {
    return (
      <header className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="/">
                <img src="/images/logo.svg" alt="Logo" className="h-12" />
              </a>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-primary">Home</a>
              <a href="/shop" className="text-gray-700 hover:text-primary">Shop</a>
              <a href="/about" className="text-gray-700 hover:text-primary">About</a>
              <a href="/contact" className="text-gray-700 hover:text-primary">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <a href="/cart" className="text-gray-700 hover:text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <use xlinkHref="#cart"></use>
                </svg>
              </a>
              <a href="/user" className="text-gray-700 hover:text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <use xlinkHref="#user"></use>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }