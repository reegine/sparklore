import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

// BASE IMAGES
import baseNecklace from "../../assets/default/basenecklace.png";
import product1 from "../../assets/default/charmbar_product1.png";
import product2 from "../../assets/default/charmbar_product2.png";
import product3 from "../../assets/default/charmbar_product3.png";
import product4 from "../../assets/default/charmbar_product4.png";
import product5 from "../../assets/default/charmbar_product5.png";
import product6 from "../../assets/default/charmbar_product6.png";
import product7 from "../../assets/default/charmbar_product7.png";
import product8 from "../../assets/default/charmbar_product8.png";

// CHARM IMAGES
import charm1 from "../../assets/charms/charm1.png";
import charm2 from "../../assets/charms/charm2.png";
import charm3 from "../../assets/charms/charm3.png";
import charm4 from "../../assets/charms/charm4.png";
import charm5 from "../../assets/charms/charm5.png";

// PRODUCTS
const necklaces = [
  { id: 1, img: product1, text: "Elegant Necklace", price: 29999, stock: 5 },
  { id: 2, img: product2, text: "Classic Necklace", price: 24999, stock: 15 },
  { id: 3, img: product3, text: "Charming Necklace", price: 19999, stock: 0 },
  { id: 4, img: product4, text: "Stylish Necklace", price: 34999, stock: 8 },
  { id: 5, img: product3, text: "Charming Necklace", price: 19999, stock: 3 },
];

const bracelets = [
  { id: 6, img: product7, text: "Fashionable Bracelet", price: 17999, stock: 0 },
  { id: 7, img: product5, text: "Beautiful Bracelet", price: 19999, stock: 12 },
  { id: 8, img: product6, text: "Trendy Bracelet", price: 22999, stock: 2 },
  { id: 9, img: product7, text: "Fashionable Bracelet", price: 17999, stock: 7 },
  { id: 10, img: product8, text: "Unique Bracelet", price: 25999, stock: 0 },
];

const recommend = [
  { id: 11, img: product5, text: "Beautiful Bracelet", price: 19999, stock: 4 },
  { id: 12, img: product6, text: "Trendy Bracelet", price: 22999, stock: 9 },
  { id: 13, img: product8, text: "Unique Bracelet", price: 25999, stock: 0 },
  { id: 14, img: product7, text: "Fashionable Bracelet", price: 17999, stock: 11 },
  { id: 15, img: product8, text: "Unique Bracelet", price: 25999, stock: 1 },
];

const charms = {
  Alphabet: [
    { name: "Garnet", src: charm1 },
    { name: "Amethyst", src: charm2 },
    { name: "Aquamarine", src: charm3 },
    { name: "Moonstone", src: charm4 },
    { name: "Emerald", src: charm5 },
  ],
  Birthstone: [
    { name: "Garnet", src: charm1 },
    { name: "Amethyst", src: charm2 },
    { name: "Aquamarine", src: charm3 },
    { name: "Moonstone", src: charm4 },
    { name: "Emerald", src: charm5 },
  ],
  Birthstone_Mini: [
    { name: "Garnet", src: charm1 },
    { name: "Amethyst", src: charm2 },
    { name: "Aquamarine", src: charm3 },
    { name: "Moonstone", src: charm4 },
    { name: "Emerald", src: charm5 },
  ],
  Number: [
    { name: "Garnet", src: charm1 },
    { name: "Amethyst", src: charm2 },
    { name: "Aquamarine", src: charm3 },
    { name: "Moonstone", src: charm4 },
    { name: "Emerald", src: charm5 },
  ],
  Sparklores_Special: [
    { name: "Garnet", src: charm1 },
    { name: "Amethyst", src: charm2 },
    { name: "Aquamarine", src: charm3 },
    { name: "Moonstone", src: charm4 },
    { name: "Emerald", src: charm5 },
  ],
  Zodiac: [
    { name: "Garnet", src: charm1 },
    { name: "Amethyst", src: charm2 },
    { name: "Aquamarine", src: charm3 },
    { name: "Moonstone", src: charm4 },
    { name: "Emerald", src: charm5 },
  ],
};

// Function to format numbers as Indonesian Rupiah
const formatIDR = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",00";
};

export default function CharmCustomizerFull() {
  const necklaceRef = useRef(null);
  const braceletRef = useRef(null);
  const recommendRef = useRef(null);
  const [baseImage, setBaseImage] = useState(baseNecklace);
  const [charmCount, setCharmCount] = useState(2);
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedCharms, setSelectedCharms] = useState({});
  const [openCategory, setOpenCategory] = useState("Birthstone");
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const scroll = (ref, direction) => {
    const scrollByAmount = 260;
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -scrollByAmount : scrollByAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCharmSelect = (charm) => {
    setSelectedCharms((prev) => ({
      ...prev,
      [selectedTab]: charm,
    }));
    if (selectedTab < charmCount) {
      setSelectedTab((prev) => prev + 1);
    }
  };

  const ProductItem = ({ product }) => (
    <div 
      key={product.id} 
      className={`relative group min-w-[15rem] ${product.stock === 0 ? 'opacity-70' : 'cursor-pointer'} hover:scale-105 transition-transform`}
      onClick={() => product.stock > 0 && handleProductClick(product.id)}
    >
      <img 
        src={product.img} 
        alt={product.text} 
        className={`w-[15rem] h-[15rem] object-cover shadow-md rounded ${product.stock === 0 ? 'grayscale' : ''}`} 
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
      
      <div className="absolute inset-0 bg-[#f5f5dc] opacity-0 group-hover:opacity-80 flex flex-col justify-center items-center transition-opacity">
        <span className="text-lg font-bold">{product.text}</span>
        <span className="text-sm">Rp {formatIDR(product.price)}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f9f5ef] min-h-screen">
      <div className="font-sans px-6 py-12 max-w-6xl mx-auto">

        {/* NECKLACES */}
        <h2 className="text-2xl font-serif font-semibold mb-6">NECKLACES</h2>
        <div className="relative mb-10">
          <button onClick={() => scroll(necklaceRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2">
            <ChevronLeft size={28} />
          </button>
          <div ref={necklaceRef} className="flex gap-4 overflow-x-auto ml-12 mr-12 pb-2 no-scrollbar">
            {necklaces.map((product) => (
              <ProductItem product={product} key={product.id} />
            ))}
          </div>
          <button onClick={() => scroll(necklaceRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2">
            <ChevronRight size={28} />
          </button>
        </div>

        {/* BRACELETS */}
        <h2 className="text-2xl font-serif font-semibold mt-12 mb-6">BRACELETS</h2>
        <div className="relative mb-10">
          <button onClick={() => scroll(braceletRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2">
            <ChevronLeft size={28} />
          </button>
          <div ref={braceletRef} className="flex gap-4 overflow-x-auto ml-12 mr-12 pb-2 no-scrollbar">
            {bracelets.map((product) => (
              <ProductItem product={product} key={product.id} />
            ))}
          </div>
          <button onClick={() => scroll(braceletRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2">
            <ChevronRight size={28} />
          </button>
        </div>

        {/* CUSTOMIZER */}
        {baseImage && (
          <>
            <h2 className="text-xl font-medium mb-4">Customize Your Charm</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setCharmCount(num);
                    setSelectedTab(1);
                    setSelectedCharms({});
                  }}
                  className={clsx("px-4 py-2 border rounded transition", charmCount === num ? "bg-[#e6d5a7]" : "bg-white")}
                >
                  {num} Charm{num > 1 && "s"}
                </button>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="bg-white rounded w-full max-w-xl aspect-square p-4 relative">
                <img src={baseImage} alt="Base" className="w-full h-full object-contain" />
                {Array.from({ length: charmCount }, (_, i) => (
                  selectedCharms[i + 1] && (
                    <img
                      key={i}
                      src={selectedCharms[i + 1].src}
                      alt={`Charm ${i + 1}`}
                      className="absolute inset-0 object-cover w-full h-full"
                      style={{ zIndex: i + 1 }}
                    />
                  )
                ))}
              </div>

              <div className="flex-1">
                <div className="text-2xl font-semibold mb-4">
                  Rp {formatIDR(139999 + (charmCount - 1) * 25000)}
                </div>

                <div className="flex gap-2 mb-4">
                  {Array.from({ length: charmCount }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedTab(i + 1)}
                      className={clsx(
                        "px-4 py-1 rounded border",
                        selectedTab === i + 1 ? "bg-[#e6d5a7]" : "bg-white"
                      )}
                    >
                      Charm {i + 1}
                    </button>
                  ))}
                </div>

                <button className="w-full bg-[#e6d5a7] text-center py-2 rounded mb-4 font-medium">
                  Add to cart
                </button>

                <div className="space-y-4 max-h-[25vw] overflow-y-auto pr-2">
                  {Object.keys(charms).map((category) => (
                    <div key={category} className="mb-2">
                      <button
                        onClick={() => setOpenCategory(openCategory === category ? null : category)}
                        className="w-full flex justify-between items-center py-2 border-b"
                      >
                        <span>{category}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {openCategory === category && (
                        <div className="grid grid-cols-3 gap-2 p-2">
                          {charms[category].map((charm, i) => (
                            <div key={i} className="relative cursor-pointer group" onClick={() => handleCharmSelect(charm)}>
                              <img
                                src={charm.src}
                                alt={charm.name}
                                className="hover:scale-105 transition rounded border p-1 w-full"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex justify-center items-center text-white text-sm font-semibold transition">
                                {charm.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>               
              </div>
            </div>
          </>
        )}

        {/* RECOMMENDATIONS */}
        <h2 className="text-2xl font-serif font-semibold mb-6 mt-20">YOU MIGHT ALSO LIKE...</h2>
        <div className="relative mb-10">
          <button onClick={() => scroll(recommendRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2">
            <ChevronLeft size={28} />
          </button>
          <div ref={recommendRef} className="flex gap-4 overflow-x-auto ml-12 mr-12 pb-2 no-scrollbar">
            {recommend.map((product) => (
              <ProductItem product={product} key={product.id} />
            ))}
          </div>
          <button onClick={() => scroll(recommendRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2">
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}