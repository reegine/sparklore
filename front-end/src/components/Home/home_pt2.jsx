import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import product1 from "../../assets/default/homeproduct1.png";
import product4 from "../../assets/default/homeproduct4.png";
import product5 from "../../assets/default/homeproduct5.jpeg";
import product6 from "../../assets/default/homeproduct6.jpeg";
import product7 from "../../assets/default/homeproduct7.png";

const HomePart2 = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      image: product4,
      name: "TWILIGHT ZIRCON ANKLET ROSE GOLD",
      tag: "ROSE GOLD",
      rating: 0,
      price: "Rp 120.899,00",
      oldPrice: "Rp 129.999,00",
      stock: 5, // Low stock (under 10)
    },
    {
      id: 2,
      image: product5,
      name: "THE CLASSIC SERPENT NECKLACE",
      tag: "GOLD",
      rating: 1,
      price: "Rp 85.499,00",
      oldPrice: "Rp 89.999,00",
      stock: 15, // Normal stock
    },
    {
      id: 3,
      image: product6,
      name: "THE CLASSIC SERPENT NECKLACE",
      tag: "SILVER",
      rating: 1,
      price: "Rp 85.499,00",
      oldPrice: "Rp 89.999,00",
      stock: 0, // Sold out
    },
    {
      id: 4,
      image: product7,
      name: "CLASSIC MAGNET LOVE COUPLE BRACELET",
      tag: "SILVER",
      rating: 0,
      price: "Rp 225.990,00",
      oldPrice: "Rp 269.999,00",
      stock: 3, // Low stock
    },
    {
      id: 5,
      image: product1,
      name: "LUNA PIN CHAIN",
      tag: "GOLD",
      rating: 0,
      price: "Rp 225.990,00",
      oldPrice: "Rp 269.999,00",
      stock: 12, // Normal stock
    },
    {
      id: 6,
      image: product4,
      name: "TWILIGHT ZIRCON ANKLET ROSE GOLD",
      tag: "ROSE GOLD",
      rating: 0,
      price: "Rp 120.899,00",
      oldPrice: "Rp 129.999,00",
      stock: 8, // Low stock
    },
    {
      id: 7,
      image: product5,
      name: "THE CLASSIC SERPENT NECKLACE",
      tag: "GOLD",
      rating: 1,
      price: "Rp 85.499,00",
      oldPrice: "Rp 89.999,00",
      stock: 0, // Sold out
    },
    {
      id: 8,
      image: product6,
      name: "THE CLASSIC SERPENT NECKLACE",
      tag: "SILVER",
      rating: 1,
      price: "Rp 85.499,00",
      oldPrice: "Rp 89.999,00",
      stock: 20, // Normal stock
    },
    {
      id: 9,
      image: product7,
      name: "CLASSIC MAGNET LOVE COUPLE BRACELET",
      tag: "SILVER",
      rating: 0,
      price: "Rp 225.990,00",
      oldPrice: "Rp 269.999,00",
      stock: 1, // Low stock
    },
    {
      id: 10,
      image: product1,
      name: "LUNA PIN CHAIN",
      tag: "GOLD",
      rating: 0,
      price: "Rp 225.990,00",
      oldPrice: "Rp 269.999,00",
      stock: 0, // Sold out
    },
  ];

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="bg-[#F9F5EE] px-1 pb-2 md:px-10 md:pb-10 text-center pt-[1rem] md:pt-[8rem]">
      <div className="flex justify-between px-3 md:px-[2rem] items-center">
        <h2 className="text-2xl md:text-5xl mb-5 md:mb-0">SPECIAL OFFER</h2>
        <div className="block md:flex items-center justify-between">
          <div className="text-sm md:text-2xl font-medium mr-3 md:mr-10">ENDS IN</div>
          <div className="text-right">
            <div className="flex justify-end space-x-3 md:space-x-6">
              <span className="text-2xl font-mono">00</span>
              <span className="text-2xl font-mono">00</span>
              <span className="text-2xl font-mono">00</span>
            </div>
            <div className="flex justify-end space-x-4 md:space-x-7 mt-1">
              <span className="text-xs">Hrs</span>
              <span className="text-xs">Mins</span>
              <span className="text-xs">Secs</span>
            </div>
          </div>
        </div>
      </div>

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
                className={`rounded-lg ${product.stock === 0 ? 'grayscale' : ''}`}
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
              <span className="ml-2">({product.rating})</span>
            </div>
            <p className="text-red-500 text-lg open-sans-text">{product.price}</p>
            <p className="text-gray-400 line-through open-sans-text">{product.oldPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePart2;