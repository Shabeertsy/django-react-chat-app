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
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Best Selling Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
