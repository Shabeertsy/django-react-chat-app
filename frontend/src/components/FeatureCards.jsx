import { motion } from "framer-motion";
import { FaFish, FaShoppingCart, FaLeaf } from "react-icons/fa";

export default function FeatureCards() {
  const features = [
    {
      id: 1,
      title: "Aquarium Design",
      description: "Expert designs tailored to your space.",
      icon: <FaFish className="text-green-800 text-3xl md:text-4xl" />,
      link: "/aquarium-design",
    },
    {
      id: 2,
      title: "Our Products",
      description: "Explore our quality aquarium products.",
      icon: <FaShoppingCart className="text-green-800 text-3xl md:text-4xl" />,
      link: "/shop",
    },
    {
      id: 3,
      title: "Live Items",
      description: "Find live plants & fish for your aquarium.",
      icon: <FaLeaf className="text-green-800 text-3xl md:text-4xl" />,
      link: "/live-items",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Explore More</h2>

        {/* Feature Cards - Always in Row */}
        <div className="flex justify-center gap-4 md:gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl w-[100px] sm:w-[140px] md:w-[200px] p-3 md:p-5 text-center flex flex-col justify-between"
            >
              {/* Icon */}
              <div className="flex items-center justify-center h-16 md:h-20">{feature.icon}</div>

              {/* Details */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-800 mt-3">{feature.title}</h3>
                <p className="text-gray-600 text-[10px] md:text-xs mt-1">{feature.description}</p>
              </div>

              {/* Fixed Bottom Button */}
              <div className="mt-auto">
                <a
                  href={feature.link}
                  className="inline-block bg-green-800 text-white text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 rounded-full mt-3 transition duration-300 hover:bg-green-900 w-full"
                >
                  Go To
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
