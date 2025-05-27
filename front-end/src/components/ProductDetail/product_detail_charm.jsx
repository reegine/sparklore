import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { BASE_URL } from "../../utils/api.js";

// BASE IMAGES
import baseNecklace from "../../assets/default/basenecklace.png";

// Function to format numbers as Indonesian Rupiah
const formatIDR = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",00";
};

const ProductDetailCharm = () => {
  const { productId } = useParams(); // Changed from productId to charmId
  const [charm, setCharm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showCharms, setShowCharms] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  
  useEffect(() => {
    const fetchCharm = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/charms/${productId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch charm');
        }
        const data = await response.json();
        setCharm(data);
        setMainImage(data.image);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCharm();
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

  if (loading) {
    return (
      <div className='bg-[#faf7f0] flex justify-center items-center h-64'>
        <p>Loading charm details...</p>
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

  if (!charm) {
    return (
      <div className='bg-[#faf7f0] flex justify-center items-center h-64'>
        <p>Charm not found</p>
      </div>
    );
  }

  // Create thumbnails array (using the same image for all thumbnails since the API only provides one image)
  const thumbnails = [charm.image];

  return (
    <div className='bg-[#faf7f0] relative'>
      {/* Popup Overlay */}
      {showPopup && (
        <>
          {showCharms && (
            <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-50">
              <div className="bg-[#fdfaf3] p-6 rounded-2xl border-2 border-black text-center max-w-xl w-full">
                <h2 className="text-2xl font-semibold text-[#3b322c]">SURPRISE!</h2>
                <p className="mt-2 text-[#3b322c]">You've unlocked limited edition charms</p>
                <div className="flex gap-4 justify-center mt-6">
                  <button onClick={handleAddOrSkipCharms} className="bg-[#e9d6a9] text-[#3b322c] font-medium py-2 px-6 rounded-md">Add to Cart</button>
                </div>
              </div>
            </div>
          )}

          {showNote && (
            <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-50">
              <div className="bg-[#fdfaf3] p-6 rounded-2xl border-2 border-black text-center max-w-lg w-full">
                <h2 className="text-2xl font-semibold text-[#3b322c]">Make It Extra Special</h2>
                <p className="mt-2 text-[#3b322c]">Write a special note for someone you love!</p>

                <textarea
                  maxLength={65}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write it and we'll deliver!"
                  className="w-full mt-4 p-4 border border-[#e9d6a9] rounded-md bg-transparent text-[#3b322c] placeholder-[#3b322c] h-40 resize-none"
                ></textarea>
                <div className="text-right text-sm text-[#3b322c]">{note.length}/65</div>

                <div className="flex gap-4 justify-center mt-4">
                  <button onClick={handleNoteSubmit} className="bg-[#e9d6a9] text-[#3b322c] font-medium py-2 px-6 rounded-md">Add Note</button>
                  <button onClick={handleNoteSubmit} className="border border-[#e9d6a9] text-[#3b322c] font-medium py-2 px-6 rounded-md">Skip</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 font-serif text-[#2d2a26]">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-4">
          Home &gt; <span className="text-gray-500">Charms</span> &gt; <span className="text-black font-medium">{charm.name}</span>
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

          {/* Main Charm Image */}
          <div className="flex-1 order-1 md:order-2">
            <img
              src={mainImage}
              alt={charm.name}
              className="w-full max-w-lg rounded-lg shadow-md"
            />
          </div>

          {/* Charm Info */}
          <div className="flex-1 order-3">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">{charm.name}</h2>
            <div className="text-xs tracking-wider border border-[#f6e3b8] text-[#a9a9a9] px-2 py-0.5 inline-block mb-2">
              {charm.category.replace(/_/g, ' ').toUpperCase()}
            </div>
            <p className="text-lg font-bold mb-4">Rp {parseFloat(charm.price).toLocaleString('id-ID')}</p>
            
            {/* Divider for mobile only */}
            <div className="md:hidden border-t border-gray-200 my-4"></div>

            <p className="text-base text-[#4d4a45] mb-4 leading-relaxed">
              {charm.description}
            </p>

            <div className="text-sm">
              <p className="mb-1 font-medium">Charm Details</p>
              <ul className="list-disc pl-5 text-[#4d4a45]">
                <li>Category: {charm.category.replace(/_/g, ' ')}</li>
                <li>Material: {charm.label || 'Not specified'}</li>
                <li>Stock: {charm.stock} available</li>
                <li>Rating: {charm.rating}/5</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-10 md:block hidden">
          <button 
            onClick={handleAddToCart}
            disabled={charm.stock === 0}
            className={`w-[53%] px-10 py-4 text-lg ${charm.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f6e3b8] hover:opacity-90'} text-[#2d2a26] font-medium rounded transition`}
          >
            {charm.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        <div className="mt-6 md:hidden order-4">
          <button 
            onClick={handleAddToCart}
            disabled={charm.stock === 0}
            className={`w-full px-10 py-4 text-lg ${charm.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f6e3b8] hover:opacity-90'} text-[#2d2a26] font-medium rounded transition`}
          >
            {charm.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailCharm;