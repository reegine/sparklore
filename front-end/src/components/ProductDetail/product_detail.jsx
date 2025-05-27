import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../../utils/api.js";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showCharms, setShowCharms] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/${productId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        // Ensure charms_detail exists as an array
        if (!data.charms_detail) {
          data.charms_detail = [];
        }
        setProduct(data);
        // Set the first image as main image if available
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0].image_url);
        } else {
          // Fallback to a default image if no images are available
          setMainImage('/path/to/default/image.png');
        }
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

  // Create thumbnails array from product.images
  const thumbnails = product.images && product.images.length > 0 
    ? product.images.map(img => img.image_url) 
    : [];

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

              {product.charms_detail && product.charms_detail.length > 0 ? (
                <div className="grid grid-cols-4 gap-4 my-6">
                  {product.charms_detail.map((charm, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img src={charm.image} alt={charm.name} className="h-12" />
                      <span className="text-[#3b322c] mt-1">{charm.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="my-6 text-[#3b322c]">
                  No charms available for this product
                </div>
              )}

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
          {thumbnails.length > 0 && (
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 order-2 md:order-1">
              {thumbnails.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={product.images[idx]?.alt_text || `Thumbnail ${idx + 1}`}
                  onClick={() => setMainImage(src)}
                  className="flex-shrink-0 w-16 h-16 object-cover rounded cursor-pointer border border-gray-200 hover:border-gray-400 transition"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/path/to/default/image.png';
                  }}
                />
              ))}
            </div>
          )}

          {/* Main Product Image */}
          <div className="flex-1 order-1 md:order-2">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full max-w-lg rounded-lg shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/path/to/default/image.png';
              }}
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
                {product.charms_detail && product.charms_detail.length > 0 && (
                  <li>Compatible charms: {product.charms_detail.map(c => c.name).join(', ')}</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-10 md:flex hidden">
          <button 
            onClick={handleAddToCart}
            disabled={charm.stock === 0}
            className={`w-[26.5%] mx-3 px-10 py-4 text-lg ${charm.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f6e3b8] hover:opacity-90'} text-[#2d2a26] font-medium rounded transition`}
          >
            {charm.stock === 0 ? 'Out of Stock' : 'Customize'}
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={charm.stock === 0}
            className={`w-[26.5%] px-10 py-4 text-lg ${charm.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#ffffff00] border-2 border-[#f6e3b8] hover:opacity-90 hover:bg-[#f6e3b8]'} text-[#2d2a26] font-medium rounded transition`}
          >
            {charm.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        <div className="mt-6 md:hidden order-4">
          <button 
            onClick={handleAddToCart}
            disabled={charm.stock === 0}
            className={`w-[26.5%] px-10 py-4 text-lg ${charm.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f6e3b8] hover:opacity-90'} text-[#2d2a26] font-medium rounded transition`}
          >
            {charm.stock === 0 ? 'Out of Stock' : 'Customize'}
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={charm.stock === 0}
            className={`w-[26.5%] px-10 py-4 text-lg ${charm.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#ffffff00] border-2 border-[#f6e3b8] hover:opacity-90 hover:bg-[#f6e3b8]'} text-[#2d2a26] font-medium rounded transition`}
          >
            {charm.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;