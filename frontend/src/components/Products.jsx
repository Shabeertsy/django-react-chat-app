import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMobile, setIsMobile] = useState(false);

  const categories = ["All", "Bakery", "Dairy", "Fruits", "Vegetables", "Condiments"];

  const products = [
    { id: 1, name: "Whole Wheat Sandwich Bread", price: "$18.00", image: "/images/product-thumb-1.png", category: "Bakery" },
    { id: 2, name: "Greek Style Plain Yogurt", price: "$18.00", image: "/images/product-thumb-10.png", category: "Dairy" },
    { id: 3, name: "Organic Fresh Strawberries", price: "$15.00", image: "/images/product-thumb-3.png", category: "Fruits" },
    { id: 4, name: "Farm Fresh Brown Eggs", price: "$12.00", image: "/images/product-thumb-4.png", category: "Dairy" },
    { id: 5, name: "Almond Butter Spread", price: "$22.00", image: "/images/product-thumb-5.png", category: "Condiments" },
    { id: 6, name: "Raw Organic Honey", price: "$25.00", image: "/images/product-thumb-6.png", category: "Condiments" },
    { id: 7, name: "Gluten-Free Oatmeal", price: "$10.00", image: "/images/product-thumb-7.png", category: "Bakery" },
    { id: 8, name: "Fresh Farm Carrots", price: "$9.00", image: "/images/product-thumb-8.png", category: "Vegetables" },
  ];

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-16 bg-gray-50 pb-24"> {/* <-- FIXED: Added pb-24 for space */}
      <div className="container mx-auto px-8">

        {/* Categories Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileTap={{ scale: 0.9 }}
                className={`w-full py-3 rounded-lg transition duration-300 text-lg font-medium shadow-md ${
                  selectedCategory === category
                    ? "bg-green-800 text-white"
                    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Best Selling Products Section */}
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Best Selling Products</h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition duration-300 hover:shadow-2xl"
              >
                {/* Image Container */}
                <div className="relative w-full h-64 rounded-t-3xl overflow-hidden flex items-center justify-center bg-gray-50">
                  <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                </div>

                {/* Product Details */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-green-800 font-bold text-2xl mb-4">{product.price}</p>
                  <button className="mt-4 bg-green-800 text-white px-8 py-3 rounded-full shadow-lg transition duration-300 hover:bg-green-900 hover:shadow-xl">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-xl col-span-full">No products available in this category.</p>
          )}
        </div>

      </div>
    </section>
  );
}
