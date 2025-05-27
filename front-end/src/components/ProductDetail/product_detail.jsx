import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BASE_URL, isLoggedIn } from "../../utils/api.js";

// Helper: format IDR currency
const formatIDR = (value) =>
  "Rp " +
  Number(value)
    .toLocaleString("id-ID", { maximumFractionDigits: 2 })
    .replace(/,/g, ".");

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showCharms, setShowCharms] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [discountItem, setDiscountItem] = useState(null);

  // For login-required popup
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoggedInState, setIsLoggedInState] = useState(false);

  // check login state on mount and when auth changes
  useEffect(() => {
    setIsLoggedInState(isLoggedIn());
    // Listen for storage changes for login state (keep in sync between tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'authData') {
        setIsLoggedInState(isLoggedIn());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch product and discount information
  useEffect(() => {
    const fetchProductAndDiscount = async () => {
      try {
        // Fetch the product
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
          setMainImage('/path/to/default/image.png');
        }

        // Fetch discount campaigns and find if this product is in a campaign
        const discountRes = await fetch(`${BASE_URL}/api/discount-campaigns/`);
        if (discountRes.ok) {
          const discountData = await discountRes.json();
          let found = null;
          for (const campaign of discountData) {
            if (campaign.items && campaign.items.length > 0) {
              const item = campaign.items.find((itm) => itm.product && itm.product.id == data.id);
              if (item) {
                found = item;
                break;
              }
            }
          }
          setDiscountItem(found);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductAndDiscount();
  }, [productId]);

  // Handler for Add to Cart or Customize (checks login)
  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      setShowLoginPrompt(true); // Show login required popup if not logged in
      return;
    }
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

  // Login Prompt Handler
  const handleCloseLoginPrompt = () => setShowLoginPrompt(false);

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

  // Compute discounted price and badge
  let displayPrice = parseFloat(product.price);
  let oldPrice = null;
  let discountLabel = "";
  if (discountItem) {
    const discountType = discountItem.discount_type;
    const discountValue = parseFloat(discountItem.discount_value || "0");
    if (discountType === "percent") {
      displayPrice = displayPrice * (1 - discountValue / 100);
      oldPrice = parseFloat(product.price);
      discountLabel = `${discountValue}% OFF`;
    } else if (discountType === "amount") {
      displayPrice = discountValue;
      oldPrice = parseFloat(product.price);
      // percent = (original - discounted) / original * 100
      const percent = oldPrice > 0
        ? Math.round(((oldPrice - displayPrice) / oldPrice) * 100)
        : 0;
      discountLabel = `${percent}% OFF`;
    }
  } else if (parseFloat(product.discount || 0) > 0) {
    const discountValue = parseFloat(product.discount);
    displayPrice = parseFloat(product.price) * (1 - discountValue / 100);
    oldPrice = parseFloat(product.price);
    discountLabel = `${discountValue}% OFF`;
  }

  // Create thumbnails array from product.images
  const thumbnails = product.images && product.images.length > 0 
    ? product.images.map(img => img.image_url) 
    : [];

  // Button width constants
  const BTN_RATIO = "w-[26%]";
  const BTN_SINGLE = "w-[53%]";

  return (
    <div className='bg-[#faf7f0] relative'>
      {/* Login Prompt Popup */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 animate-fadeIn">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Login Required</h3>
              <p className="text-gray-600 mb-6">
                You need to be logged in to add items to your cart.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCloseLoginPrompt}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-[#e6d4a5] text-gray-800 rounded-md hover:bg-[#d4c191] transition"
                  onClick={handleCloseLoginPrompt}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="mb-4">
              {/* Discount section */}
              {discountLabel ? (
                <div>
                  <span className="text-lg font-bold text-red-500 mr-2">{formatIDR(displayPrice)}</span>
                  <span className="text-base line-through text-gray-400 mr-2">{formatIDR(product.price)}</span>
                  <span className="text-xs font-semibold bg-[#c3a46f] text-white px-2 py-1 rounded">{discountLabel}</span>
                </div>
              ) : (
                <span className="text-lg font-bold">{formatIDR(product.price)}</span>
              )}
            </div>
            
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

        {/* Add to Cart & Customize Button */}
        <div className="mt-10 md:flex hidden gap-3">
          {product.charms ? (
            <>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`${BTN_RATIO} px-10 py-4 text-lg ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f6e3b8] hover:opacity-90'} text-[#2d2a26] font-medium rounded transition`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Customize'}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`${BTN_RATIO} px-10 py-4 text-lg ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#ffffff00] border-2 border-[#f6e3b8] hover:opacity-90 hover:bg-[#f6e3b8]'} text-[#2d2a26] font-medium rounded transition`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`${BTN_SINGLE} px-10 py-4 text-lg ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f6e3b8]'} text-[#2d2a26] font-medium rounded transition border-0`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </div>

        {/* MOBILE Add to Cart & Customize Button */}
        <div className="mt-6 md:hidden order-4 flex gap-3">
          {product.charms ? (
            <>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`${BTN_RATIO} px-4 py-3 text-base ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f6e3b8] hover:opacity-90'} text-[#2d2a26] font-medium rounded transition`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Customize'}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`${BTN_RATIO} px-4 py-3 text-base ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#ffffff00] border-2 border-[#f6e3b8] hover:opacity-90 hover:bg-[#f6e3b8]'} text-[#2d2a26] font-medium rounded transition`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`${BTN_SINGLE} px-4 py-3 text-base ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f6e3b8]'} text-[#2d2a26] font-medium rounded transition border-0`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;