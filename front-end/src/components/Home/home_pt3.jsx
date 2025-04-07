import React from "react";
import { Plus } from "lucide-react";
import product1 from "../../assets/default/homeproduct1.png";
import product4 from "../../assets/default/homeproduct4.png";
import product5 from "../../assets/default/homeproduct5.jpeg";
import product6 from "../../assets/default/homeproduct6.jpeg";
import product7 from "../../assets/default/homeproduct7.png";


const HomePart3 = () => {
  const products = [
    {
      id: 1,
      image: product4,
      name: "TWILIGHT ZIRCON ANKLET ROSE GOLD",
      tag: "ROSE GOLD",
      rating: 0,
      price: "Rp 120.899,00",
      oldPrice: "Rp 129.999,00",
    },
    {
      id: 2,
      image: product5,
      name: "THE CLASSIC SERPENT NECKLACE",
      tag: "GOLD",
      rating: 1,
      price: "Rp 85.499,00",
      oldPrice: "Rp 89.999,00",
    },
    {
      id: 3,
      image: product6,
      name: "THE CLASSIC SERPENT NECKLACE",
      tag: "SILVER",
      rating: 1,
      price: "Rp 85.499,00",
      oldPrice: "Rp 89.999,00",
    },
    {
      id: 4,
      image: product7,
      name: "CLASSIC MAGNET LOVE COUPLE BRACELET",
      tag: "SILVER",
      rating: 0,
      price: "Rp 225.990,00",
      oldPrice: "Rp 269.999,00",
    },
    {
        id: 5,
        image: product1,
        name: "LUNA PIN CHAIN",
        tag: "GOLD",
        rating: 0,
        price: "Rp 225.990,00",
        oldPrice: "Rp 269.999,00",
      },
      {
        id: 6,
        image: product4,
        name: "TWILIGHT ZIRCON ANKLET ROSE GOLD",
        tag: "ROSE GOLD",
        rating: 0,
        price: "Rp 120.899,00",
        oldPrice: "Rp 129.999,00",
      },
      {
        id: 7,
        image: product5,
        name: "THE CLASSIC SERPENT NECKLACE",
        tag: "GOLD",
        rating: 1,
        price: "Rp 85.499,00",
        oldPrice: "Rp 89.999,00",
      },
      {
        id: 8,
        image: product6,
        name: "THE CLASSIC SERPENT NECKLACE",
        tag: "SILVER",
        rating: 1,
        price: "Rp 85.499,00",
        oldPrice: "Rp 89.999,00",
      },
      {
        id: 9,
        image: product7,
        name: "CLASSIC MAGNET LOVE COUPLE BRACELET",
        tag: "SILVER",
        rating: 0,
        price: "Rp 225.990,00",
        oldPrice: "Rp 269.999,00",
      },
      {
          id: 10,
          image: product1,
          name: "LUNA PIN CHAIN",
          tag: "GOLD",
          rating: 0,
          price: "Rp 225.990,00",
          oldPrice: "Rp 269.999,00",
        },
  ];

  return (
    <div className="bg-[#F9F5EE] px-1 pb-2 md:px-10 md:pb-10 text-center pt-[1rem] md:pt-[8rem]">
        <h2 className="text-2xl md:text-5xl">BEST SELLER</h2>
  
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1 md:gap-6 mt-6">
        {products.map((product) => (
          <div key={product.id} className="p-4">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg"
              />
              <div className="absolute bottom-2 right-2 bg-[#faf7f0] p-2 rounded-sm shadow ">
                <button className="p-2 rounded-full border-2 border-[#e8d6a8] bg-[#faf7f0]">
                    <Plus size={12} color="#e8d6a8" />
                </button>
              </div>
            </div>
            <h3 className="mt-4 mb-2 text-lg font-semibold">{product.name}</h3>
            <span className="text-sm text-[#e8d6a8] px-2 py-1 rounded-md border-3 border-[#e8d6a8] ">
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
            <p className="text-gray-500 text-lg open-sans-text">{product.price}</p>
            {/* <p className="text-gray-400 line-through open-sans-text">{product.oldPrice}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePart3;
