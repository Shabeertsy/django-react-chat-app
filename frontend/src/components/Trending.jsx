export default function Trending() {
    const trendingProducts = [
      { id: 1, name: "Fresh Oranges", price: "$18.00", image: "/images/product-thumb-12.png" },
      { id: 2, name: "Gourmet Dark Chocolate Bars", price: "$18.00", image: "/images/product-thumb-13.png" },
      { id: 3, name: "Organic Avocados", price: "$22.00", image: "/images/product-thumb-14.png" },
      { id: 4, name: "Artisan Whole Grain Bread", price: "$15.00", image: "/images/product-thumb-15.png" },
      { id: 5, name: "Raw Almonds", price: "$20.00", image: "/images/product-thumb-16.png" },
      { id: 6, name: "Premium Olive Oil", price: "$30.00", image: "/images/product-thumb-17.png" },
      { id: 7, name: "Organic Quinoa", price: "$12.00", image: "/images/product-thumb-18.png" },
      { id: 8, name: "Dairy-Free Coconut Yogurt", price: "$16.00", image: "/images/product-thumb-19.png" },
    ];
  
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Trending Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <div key={product.id} className="bg-white shadow-md rounded-lg p-4">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-primary font-bold">{product.price}</p>
                <button className="bg-primary text-white px-4 py-2 mt-4 rounded-full">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  