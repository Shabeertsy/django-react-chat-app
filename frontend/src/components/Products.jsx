export default function Products() {
  const products = [
    { id: 1, name: "Whole Wheat Sandwich Bread", price: "$18.00", image: "/images/product-thumb-1.png" },
    { id: 2, name: "Greek Style Plain Yogurt", price: "$18.00", image: "/images/product-thumb-10.png" },
    { id: 3, name: "Organic Fresh Strawberries", price: "$15.00", image: "/images/product-thumb-3.png" },
    { id: 4, name: "Farm Fresh Brown Eggs", price: "$12.00", image: "/images/product-thumb-4.png" },
    { id: 5, name: "Almond Butter Spread", price: "$22.00", image: "/images/product-thumb-5.png" },
    { id: 6, name: "Raw Organic Honey", price: "$25.00", image: "/images/product-thumb-6.png" },
    { id: 7, name: "Gluten-Free Oatmeal", price: "$10.00", image: "/images/product-thumb-7.png" },
    { id: 8, name: "Fresh Farm Carrots", price: "$9.00", image: "/images/product-thumb-8.png" },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Best Selling Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              {/* Image Container */}
              <div className="relative w-full h-64 rounded-t-3xl overflow-hidden flex items-center justify-center bg-gray-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>

              {/* Product Details */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-green-800 font-bold text-2xl mb-4">{product.price}</p>
                <button className="mt-4 bg-green-800 text-white px-8 py-3 rounded-full shadow-lg transition duration-300 hover:bg-green-900 hover:shadow-xl">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}