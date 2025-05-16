import React, { useState } from 'react';
import product1 from "../../assets/default/homeproduct1.png";
import product4 from "../../assets/default/homeproduct4.png";
import product5 from "../../assets/default/homeproduct5.jpeg";
import product6 from "../../assets/default/homeproduct6.jpeg";
import product7 from "../../assets/default/homeproduct7.png";

import charm1 from "../../assets/charms/charm1.png";
import charm2 from "../../assets/charms/charm2.png";
import charm3 from "../../assets/charms/charm3.png";
import charm4 from "../../assets/charms/charm4.png";
import charm5 from "../../assets/charms/charm5.png";

const ProductDetail = () => {
  const thumbnails = [
    product1,
    product4,
    product5,
    product6,
    product7,
    product1,
  ];
  const [mainImage, setMainImage] = useState(product7);
  const [showPopup, setShowPopup] = useState(false);
  const [showCharms, setShowCharms] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');

    // Charm data with imported images
  const charms = [
    { name: "Rainbow", image: charm1 },
    { name: "Donut", image: charm2 },
    { name: "Pizza", image: charm3 },
    { name: "Music Note", image: charm4 },
    { name: "Palm Tree", image: charm5 },
    { name: "Horse", image: charm1 }, // Using charm1 as placeholder
    { name: "Ruby Hand", image: charm2 } // Using charm2 as placeholder
  ];

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
                  {charms.map((charm, index) => (
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
          Home &gt; <span className="text-gray-500">Rings</span> &gt; <span className="text-black font-medium">Cain Artisan Ring</span>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Thumbnail Images - Left side in desktop, below main image in mobile */}
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

          {/* Main Product Image - Center in desktop, top in mobile */}
          <div className="flex-1 order-1 md:order-2">
            <img
              src={mainImage}
              alt="Cain Artisan Ring"
              className="w-full max-w-lg rounded-lg shadow-md"
            />
          </div>

          {/* Product Info - Right side in desktop, bottom in mobile */}
          <div className="flex-1 order-3">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">CAIN ARTISAN RING</h2>
            <div className="text-xs tracking-wider border border-[#f6e3b8] text-[#a9a9a9] px-2 py-0.5 inline-block mb-2">
              SILVER
            </div>
            <p className="text-lg font-bold mb-4">Rp. 89.999,00</p>
            
            {/* Divider for mobile only */}
            <div className="md:hidden border-t border-gray-200 my-4"></div>

            <p className="text-base text-[#4d4a45] mb-4 leading-relaxed">
              Uniquely modern and crafted from tarnish-resistant stainless steel, the Cain Artisan Ring is waterproof, hypoallergenic, and safe for sensitive skin. Its sleek, adjustable design offers a stylish, gender-neutral appeal—perfect for effortless, everyday wear.
            </p>

            <div className="text-sm">
              <p className="mb-1 font-medium">Product Details</p>
              <ul className="list-disc pl-5 text-[#4d4a45]">
                <li>Material: Stainless Steel Silver (Waterproof, tarnish-resistant, and anti-rust)</li>
                <li>Size: Adjustable (Fits all sizes)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add to Cart Button - Below thumbnails in mobile, original position in desktop */}
        <div className="mt-10 md:block hidden">
          <button 
            onClick={handleAddToCart}
            className="w-[53%] px-10 py-4 text-lg bg-[#f6e3b8] text-[#2d2a26] font-medium rounded hover:opacity-90 transition"
          >
            Add to Cart
          </button>
        </div>
        <div className="mt-6 md:hidden order-4">
          <button 
            onClick={handleAddToCart}
            className="w-full px-10 py-4 text-lg bg-[#f6e3b8] text-[#2d2a26] font-medium rounded hover:opacity-90 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;