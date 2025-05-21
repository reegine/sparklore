import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePart3 = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://192.168.1.12:8000/api/products/");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        
        // Transform and sort products by sold_stok (highest to lowest)
        const sortedProducts = data
          .map(product => ({
            id: product.id,
            name: product.name,
            tag: product.label.toUpperCase(),
            rating: parseFloat(product.rating) || 0,
            price: `Rp ${parseFloat(product.price).toLocaleString('id-ID')}`,
            oldPrice: null,
            image: product.image,
            stock: product.stock,
            soldStock: product.sold_stok || 0
          }))
          .sort((a, b) => b.soldStock - a.soldStock);

        setProducts(sortedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-[#F9F5EE] px-1 pb-2 md:px-10 md:pb-10 text-center pt-[1rem] md:pt-[8rem] flex justify-center items-center h-64">
        <p>Loading best sellers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F9F5EE] px-1 pb-2 md:px-10 md:pb-10 text-center pt-[1rem] md:pt-[8rem] flex justify-center items-center h-64">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F5EE] px-1 pb-2 md:px-10 md:pb-10 text-center pt-[1rem] md:pt-[8rem]">
      <h2 className="text-2xl md:text-5xl">BEST SELLER</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-1 md:gap-6 mt-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className={`p-4 ${product.stock === 0 ? 'opacity-70' : 'cursor-pointer'}`}
            onClick={() => product.stock > 0 && handleProductClick(product.id)}
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className={`rounded-lg w-full h-auto object-cover ${product.stock === 0 ? 'grayscale' : ''}`}
              />
              
              {/* Stock Status Badge */}
              {product.stock === 0 ? (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  SOLD OUT
                </div>
              ) : product.stock < 10 ? (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  LOW STOCK
                </div>
              ) : null}
              
              {/* Best Seller Badge */}
              {product.soldStock > 0 && (
                <div className="absolute top-2 right-2 bg-[#c3a46f] text-white text-xs font-bold px-2 py-1 rounded">
                  BEST SELLER
                </div>
              )}
              
              {/* Only show add to cart button if product is in stock */}
              {product.stock > 0 && (
                <div className="absolute bottom-2 right-2 bg-[#faf7f0] p-2 rounded-sm shadow">
                  <button 
                    className="p-2 rounded-full border-2 border-[#e8d6a8] bg-[#faf7f0]"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                  >
                    <Plus size={12} color="#e8d6a8" />
                  </button>
                </div>
              )}
            </div>
            <h3 className="mt-4 mb-2 text-lg font-semibold">{product.name}</h3>
            <span className="text-sm text-[#e8d6a8] px-2 py-1 rounded-md border-3 border-[#e8d6a8]">
              {product.tag}
            </span>
            <div className="flex justify-center items-center mt-2">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <span key={i} className={i < product.rating ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              <span className="ml-2">({product.rating.toFixed(1)})</span>
            </div>
            <p className="text-gray-500 text-lg open-sans-text">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePart3;