import { useState, useEffect } from "react";
import { Home, ShoppingBag, User, ShoppingCart, Info, Phone } from "lucide-react";
import './Navbar.css'

export default function PawfinsNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Top Header for Desktop */}
      <header className="bg-gradient-to-r from-green-900 to-green-700 shadow-lg md:block hidden nav-head">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <span className="text-white font-bold text-2xl tracking-wide">Pawfins</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-white text-lg font-medium hover:text-yellow-400 transition">Home</a>
              <a href="/shop" className="text-white text-lg font-medium hover:text-yellow-400 transition">Shop</a>
              <a href="/about" className="text-white text-lg font-medium hover:text-yellow-400 transition">About</a>
              <a href="/contact" className="text-white text-lg font-medium hover:text-yellow-400 transition">Contact</a>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-5">
              <a href="/cart" className="text-white hover:text-yellow-400 transition">
                <ShoppingCart size={24} />
              </a>
              <a href="/user" className="text-white hover:text-yellow-400 transition">
                <User size={24} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <nav className="bottom-nav  fixed bottom-0 left-0 right-0 bg-green-900 shadow-md py-3 flex justify-around items-center text-white md:hidden">
          <a href="/" className="flex flex-col items-center transition hover:text-yellow-400">
            <Home size={24} />
            <span className="text-xs">Home</span>
          </a>
          <a href="/shop" className="flex flex-col items-center transition hover:text-yellow-400">
            <ShoppingBag size={24} />
            <span className="text-xs">Shop</span>
          </a>
          <a href="/cart" className="flex flex-col items-center transition hover:text-yellow-400">
            <ShoppingCart size={24} />
            <span className="text-xs">Cart</span>
          </a>
          <a href="/about" className="flex flex-col items-center transition hover:text-yellow-400">
            <Info size={24} />
            <span className="text-xs">About</span>
          </a>
          <a href="/contact" className="flex flex-col items-center transition hover:text-yellow-400">
            <Phone size={24} />
            <span className="text-xs">Contact</span>
          </a>
        </nav>
      )}
    </>
  );
}
