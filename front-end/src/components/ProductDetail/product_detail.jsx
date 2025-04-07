import React, { useState } from 'react';
import product1 from "../../assets/default/homeproduct1.png";
import product4 from "../../assets/default/homeproduct4.png";
import product5 from "../../assets/default/homeproduct5.jpeg";
import product6 from "../../assets/default/homeproduct6.jpeg";
import product7 from "../../assets/default/homeproduct7.png";


const ProductDetail = () => {
  const thumbnails = [
    product1,
    product4,
    product5,
    product6,
    product7,
    product1,
  ];
  const [mainImage, setMainImage] = useState(product7); // Replace with actual main image path

  return (
    <div className='bg-[#faf7f0] '>
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 font-serif text-[#2d2a26]">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-4">
            Home &gt; <span className="text-gray-500">Rings</span> &gt; <span className="text-black font-medium">Cain Artisan Ring</span>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
            {/* Thumbnail Images */}
            <div className="flex md:flex-col gap-4">
            {thumbnails.map((src, idx) => (
                <img
                key={idx}
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setMainImage(src)}
                className="w-16 h-16 object-cover rounded cursor-pointer border border-gray-200 hover:border-gray-400 transition"
                />
            ))}
            </div>

            {/* Main Product Image */}
            <div className="flex-1">
            <img
                src={mainImage}
                alt="Cain Artisan Ring"
                className="w-full max-w-lg rounded-lg shadow-md"
            />
            </div>

            {/* Product Info */}
            <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">CAIN ARTISAN RING</h2>
            <div className="text-xs tracking-wider border border-[#f6e3b8] text-[#a9a9a9] px-2 py-0.5 inline-block mb-2">
                SILVER
            </div>
            <p className="text-lg font-bold mb-4">Rp. 89.999,00</p>

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

        {/* Add to Cart Button */}
        <div className="mt-10">
            <button className="w-[53%] px-10 py-4 text-lg bg-[#f6e3b8] text-[#2d2a26] font-medium rounded hover:opacity-90 transition">
            Add to Cart
            </button>
        </div>
        </div>
    </div>
  );
};

export default ProductDetail;
