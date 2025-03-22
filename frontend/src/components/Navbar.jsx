import { useState } from "react";

export default function PawfinsNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-900 to-green-700 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              {/* <img src="/images/logo.svg" alt="Pawfins Logo" className="h-12 mr-2" /> */}
              <span className="text-white font-bold text-2xl tracking-wide">Pawfins</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-white text-lg font-medium hover:text-yellow-400 transition duration-300">Home</a>
            <a href="/shop" className="text-white text-lg font-medium hover:text-yellow-400 transition duration-300">Shop</a>
            <a href="/about" className="text-white text-lg font-medium hover:text-yellow-400 transition duration-300">About</a>
            <a href="/contact" className="text-white text-lg font-medium hover:text-yellow-400 transition duration-300">Contact</a>
          </nav>

          {/* Icons & Mobile Menu Button */}
          <div className="flex items-center space-x-5">
            <a href="/cart" className="text-white hover:text-yellow-400 transition">
              🛒
            </a>
            <a href="/user" className="text-white hover:text-yellow-400 transition">
              👤
            </a>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-green-800 text-center py-4 rounded-lg shadow-md">
            <a href="/" className="block py-2 text-white hover:text-yellow-400">Home</a>
            <a href="/shop" className="block py-2 text-white hover:text-yellow-400">Shop</a>
            <a href="/about" className="block py-2 text-white hover:text-yellow-400">About</a>
            <a href="/contact" className="block py-2 text-white hover:text-yellow-400">Contact</a>
          </div>
        )}
      </div>
    </header>
  );
}
