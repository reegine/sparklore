import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { BASE_URL } from "../../utils/api.js";

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

const ProductDetailCharm = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showCharms, setShowCharms] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  
  // Charm bar state
  const necklaceRef = useRef(null);
  const braceletRef = useRef(null);
  const recommendRef = useRef(null);
  const [baseImage, setBaseImage] = useState(baseNecklace);
  const [charmCount, setCharmCount] = useState(2);
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedCharms, setSelectedCharms] = useState({});
  const [openCategory, setOpenCategory] = useState("Birthstone");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/${productId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        setMainImage(data.image);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    setShowPopup(true);
    setShowCharms(true);
  };

  const handleAddOrSkipCharms = () => {
    setShowCharms(false);
    setShowNote(true);
  };

  const handleNoteSubmit = () => {
    setShowNote(false);
    setShowPopup(false);
    // Submit note here if needed
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

  if (loading) {
    return (
      <div className='bg-[#faf7f0] flex justify-center items-center h-64'>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-[#faf7f0] flex justify-center items-center h-64'>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='bg-[#faf7f0] flex justify-center items-center h-64'>
        <p>Product not found</p>
      </div>
    );
  }

  // Create thumbnails array including main image and any additional images
  const thumbnails = [product.image, ...(product.additional_images || [])];

  return (
    <div className='bg-[#faf7f0] relative'>
      {/* Popup Overlay */}
      {showPopup && (
        <>
          {showCharms && (
            <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-50">
              <div className="bg-[#fdfaf3] p-6 rounded-2xl border-2 border-black text-center max-w-xl w-full">
                <h2 className="text-2xl font-semibold text-[#3b322c]">SURPRISE!</h2>
                <p className="mt-2 text-[#3b322c]">You've unlock limited edition charms, do you want to add them for only Rp. 89.999/charm</p>

                <div className="grid grid-cols-4 gap-4 my-6">
                  {product.charms_detail.map((charm, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img src={charm.image} alt={charm.name} className="h-12" />
                      <span className="text-[#3b322c] mt-1">{charm.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 justify-center">
                  <button onClick={handleAddOrSkipCharms} className="bg-[#e9d6a9] text-[#3b322c] font-medium py-2 px-6 rounded-md">Add</button>
                  <button onClick={handleAddOrSkipCharms} className="border border-[#e9d6a9] text-[#3b322c] font-medium py-2 px-6 rounded-md">Maybe Next Time</button>
                </div>
              </div>
            </div>
          )}

          {showNote && (
            <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-50">
              <div className="bg-[#fdfaf3] p-6 rounded-2xl border-2 border-black text-center max-w-lg w-full">
                <h2 className="text-2xl font-semibold text-[#3b322c]">Make It Extra Special</h2>
                <p className="mt-2 text-[#3b322c]">Write a special notes for someone you love!</p>

                <textarea
                  maxLength={65}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write it and we'll deliver!"
                  className="w-full mt-4 p-4 border border-[#e9d6a9] rounded-md bg-transparent text-[#3b322c] placeholder-[#3b322c] h-40 resize-none"
                ></textarea>
                <div className="text-right text-sm text-[#3b322c]">{note.length}/65</div>

                <div className="flex gap-4 justify-center mt-4">
                  <button onClick={handleNoteSubmit} className="bg-[#e9d6a9] text-[#3b322c] font-medium py-2 px-6 rounded-md">Add</button>
                  <button onClick={handleNoteSubmit} className="border border-[#e9d6a9] text-[#3b322c] font-medium py-2 px-6 rounded-md">Maybe Next Time</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 font-serif text-[#2d2a26]">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-4">
          Home &gt; <span className="text-gray-500">{product.category}</span> &gt; <span className="text-black font-medium">{product.name}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Thumbnail Images */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 order-2 md:order-1">
            {thumbnails.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setMainImage(src)}
                className="flex-shrink-0 w-16 h-16 object-cover rounded cursor-pointer border border-gray-200 hover:border-gray-400 transition"
              />
            ))}
          </div>

          {/* Main Product Image */}
          <div className="flex-1 order-1 md:order-2">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full max-w-lg rounded-lg shadow-md"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 order-3">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">{product.name}</h2>
            <div className="text-xs tracking-wider border border-[#f6e3b8] text-[#a9a9a9] px-2 py-0.5 inline-block mb-2">
              {product.label.toUpperCase()}
            </div>
            <p className="text-lg font-bold mb-4">Rp {parseFloat(product.price).toLocaleString('id-ID')}</p>
            
            {/* Divider for mobile only */}
            <div className="md:hidden border-t border-gray-200 my-4"></div>

            <p className="text-base text-[#4d4a45] mb-4 leading-relaxed">
              {product.description}
            </p>

            <div className="text-sm">
              <p className="mb-1 font-medium">Product Details</p>
              <ul className="list-disc pl-5 text-[#4d4a45]">
                <li>Material: {product.label}</li>
                <li>Stock: {product.stock} available</li>
                {product.charms_detail.length > 0 && (
                  <li>Compatible charms: {product.charms_detail.map(c => c.name).join(', ')}</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-10 md:block hidden">
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-[53%] px-10 py-4 text-lg ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f6e3b8] hover:opacity-90'} text-[#2d2a26] font-medium rounded transition`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        <div className="mt-6 md:hidden order-4">
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full px-10 py-4 text-lg ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f6e3b8] hover:opacity-90'} text-[#2d2a26] font-medium rounded transition`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailCharm;