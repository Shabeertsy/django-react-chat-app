import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/images/banner4.jpg",
  "/images/banner5.jpg",
  "/images/banner6.jpg",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="bg-cover bg-center relative"
      style={{ backgroundImage: `url(${images[current]})` }}
    >
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-cyan-300 mb-4">
            Explore the Wonders of <span className="text-primary">Aquatic Life</span>
          </h1>
          <p className="text-xl text-white mb-8">Dive into the beauty of marine ecosystems and discover exotic aquatic creatures.</p>
          <div className="flex space-x-4">
            <a href="/explore" className="bg-primary text-white px-6 py-3 rounded-full">
              Explore Now
            </a>
            <a href="/join" className="bg-dark text-white px-6 py-3 rounded-full">
              Join the Journey
            </a>
          </div>
        </div>
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
}
