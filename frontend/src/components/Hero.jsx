import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { type: "video", src: "/images/banner.mp4" }, // Video Slide
  { type: "image", src: "/images/banner7.jpeg" },
  { type: "image", src: "/images/banner6.jpg" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      <AnimatePresence>
        {slides[current].type === "video" ? (
          // Video Slide
          <motion.video
            key="video-slide"
            src={slides[current].src}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          />
        ) : (
          // Image Slides
          <motion.div
            key={slides[current].src}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].src})` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <div className="text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            Explore the Wonders of{" "}
            <span className="text-cyan-300">Aquatic Life</span>
          </h1>
          <p className="text-lg md:text-xl text-white mt-3">
            Dive into marine beauty & discover exotic creatures.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <a
              href=""
              className="bg-cyan-400 text-white px-5 py-2 rounded-lg text-sm md:text-base"
            >
              Explore Now
            </a>
            <a
              href=""
              className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm md:text-base"
            >
              Join the Journey
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              current === index ? "bg-white scale-110" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
