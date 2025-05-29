import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BASE_URL, isLoggedIn } from "../../utils/api.js";

// Helper: format IDR currency
const formatIDR = (value) =>
  "Rp " +
  Number(value)
    .toLocaleString("id-ID", { maximumFractionDigits: 2 })
    .replace(/,/g, ".");

const ArrowIcon = ({ direction = "left" }) => (
  <svg
    width="2em"
    height="2em"
    viewBox="0 0 24 24"
    fill="none"
    className="inline"
    style={{ display: 'block' }}
  >
    {direction === "left" ? (
      <path d="M15 18l-6-6 6-6" stroke="#b87777" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M9 6l6 6-6 6" stroke="#b87777" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

const ProductDetail = (props) => {
  // Accept productId from either prop or URL param for compatibility
  const urlParams = useParams();
  const productId = props.productId || urlParams.productId;
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [mainIdx, setMainIdx] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showCharms, setShowCharms] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [discountItem, setDiscountItem] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  // NEW: ref for ProductDetailCharmBar section
  const charmBarRef = useRef(null);

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
          setMainIdx(0);
        } else {
          setMainImage('/path/to/default/image.png');
          setMainIdx(0);
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

  // NEW: Handler for Customize button to scroll to CharmBar
  const handleCustomize = () => {
    const charmBarSection = document.getElementById('product-detail-charm-bar');
    if (charmBarSection) {
      charmBarSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

  // Thumbnail navigation logic
  const thumbnails = product && product.images && product.images.length > 0 
    ? product.images.map(img => img.image_url) 
    : [];
  const totalImages = thumbnails.length;

  // If the mainImage is changed via thumbnail, update idx
  useEffect(() => {
    if (mainImage && thumbnails.length > 0) {
      const idx = thumbnails.indexOf(mainImage);
      if (idx !== -1) setMainIdx(idx);
    }
    // eslint-disable-next-line
  }, [mainImage]);

  const handlePrev = () => {
    if (totalImages === 0) return;
    const prevIdx = (mainIdx - 1 + totalImages) % totalImages;
    setMainIdx(prevIdx);
    setMainImage(thumbnails[prevIdx]);
  };
  const handleNext = () => {
    if (totalImages === 0) return;
    const nextIdx = (mainIdx + 1) % totalImages;
    setMainIdx(nextIdx);
    setMainImage(thumbnails[nextIdx]);
  };

  // Parse details string to display as bullet points
  const getDetailsList = (detailsStr) => {
    if (!detailsStr) return [];
    // Split by newline and remove empty/whitespace-only lines, trim leading/trailing
    return detailsStr
      .split('\n')
      .map(line => line.replace(/^\s*-\s*/, '').trim()) // Remove any leading "- " and trim
      .filter(line => line.length > 0);
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

  // Button width constants
  const BTN_RATIO = "w-[26%]";
  const BTN_SINGLE = "w-[53%]";

  // Prepare details bullet points
  const detailList = getDetailsList(product.details);

  return (
    <div className='bg-[#faf7f0] relative'>
      {/* ...Popups... (unchanged) */}

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
                  onClick={() => {
                    setMainImage(src);
                    setMainIdx(idx);
                  }}
                  className={`flex-shrink-0 w-16 h-16 object-cover rounded cursor-pointer border ${idx === mainIdx ? 'border-[#b87777] ring-2 ring-[#b87777]' : 'border-gray-200 hover:border-gray-400'} transition`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/path/to/default/image.png';
                  }}
                />
              ))}
            </div>
          )}

          {/* Main Product Image with arrows (show arrows only on hover) */}
          <div
            className="flex-1 order-1 md:order-2 relative flex items-start justify-start group"
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
          >
            {totalImages > 1 && showArrows && (
              <button
                aria-label="Previous image"
                onClick={handlePrev}
                className="absolute left-2 top-1/3 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 shadow-md rounded-full p-2 z-20 border border-[#e9d6a9] transition"
                style={{outline: 0}}
              >
                <ArrowIcon direction="left" />
              </button>
            )}
            <img
              src={mainImage}
              alt={product.name}
              className="w-full max-w-lg rounded-lg shadow-md object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/path/to/default/image.png';
              }}
            />
            {totalImages > 1 && showArrows && (
              <button
                aria-label="Next image"
                onClick={handleNext}
                className="absolute right-2 top-1/3 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 shadow-md rounded-full p-2 z-20 border border-[#e9d6a9] transition"
                style={{outline: 0}}
              >
                <ArrowIcon direction="right" />
              </button>
            )}
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
                {detailList.length > 0 ? (
                  detailList.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))
                ) : (
                  <>
                    <li>Material: {product.label}</li>
                    <li>Stock: {product.stock} available</li>
                    {product.charms_detail && product.charms_detail.length > 0 && (
                      <li>Compatible charms: {product.charms_detail.map(c => c.name).join(', ')}</li>
                    )}
                  </>
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
                onClick={handleCustomize}
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
                onClick={handleCustomize}
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