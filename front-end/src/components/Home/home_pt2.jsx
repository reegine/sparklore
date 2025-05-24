import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { isLoggedIn, addToCart } from "../../utils/api";
import Snackbar from '../snackbar.jsx';

const HomePart2 = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Fetch discounted products from API
  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const response = await fetch("http://192.168.1.12:8000/api/products/");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        
        // Filter products with discount > 0 and transform data
        const discountedProducts = data
        .filter(product => parseFloat(product.discount) > 0)
        .map(product => {
          const originalPrice = parseFloat(product.price); // This is the original price from API
          const discountPercentage = parseFloat(product.discount);
          const discountAmount = originalPrice * (discountPercentage / 100);
          const discountedPrice = originalPrice - discountAmount;
          
          return {
            id: product.id,
            name: product.name,
            tag: product.label.toUpperCase(),
            rating: parseFloat(product.rating) || 0,
            price: `Rp ${discountedPrice.toLocaleString('id-ID', {maximumFractionDigits: 2})}`, // Discounted price
            originalPrice: `Rp ${originalPrice.toLocaleString('id-ID')}`, // Original price
            image: product.image,
            stock: product.stock,
            soldStock: product.sold_stok || 0,
            discount: discountPercentage
          };
        });

        setProducts(discountedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    
    if (!isLoggedIn()) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      await addToCart(productId);
      setSnackbarMessage('Item quantity updated in cart!');
      setSnackbarType('success');
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setSnackbarMessage(error.message || 'Failed to update cart');
      setSnackbarType('error');
      setShowSnackbar(true);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#F9F5EE] px-1 pb-2 md:px-10 md:pb-10 text-center pt-[1rem] md:pt-[8rem] flex justify-center items-center h-64">
        <p>Loading special offers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F9F5EE] px-1 pb-2 md:px-10 md:pb-10 text-center pt-[1rem] md:pt-[8rem] flex justify-center items-center h-64">
        <p>Error: {error}</p>
      </div>
    );
  }

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

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p>No special offers available at the moment</p>
        </div>
      ) : (
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
                  className={`rounded-lg w-full h-auto object-cover ${product.stock === 0 ? 'grayscale' : ''}`}
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
                
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-[#c3a46f] text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </div>
                )}
                
                {/* Only show add to cart button if product is in stock */}
                {product.stock > 0 && (
                  <div className="absolute bottom-2 right-2 bg-[#faf7f0] p-2 rounded-sm shadow">
                    <button 
                      className="p-2 rounded-full border-2 border-[#e8d6a8] bg-[#faf7f0]"
                      onClick={(e) => handleAddToCart(product.id, e)}
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
                <span className="ml-2">({product.rating.toFixed(1)})</span>
              </div>
              <p className="text-red-500 text-lg open-sans-text">{product.price}</p>
              <p className="text-gray-400 line-through open-sans-text">{product.originalPrice}</p>
            </div>
          ))}
        </div>
      )}

      {/* Snackbar for notifications */}
      <Snackbar 
        message={snackbarMessage}
        show={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        type={snackbarType}
      />

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
                  onClick={() => setShowLoginPrompt(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-[#e6d4a5] text-gray-800 rounded-md hover:bg-[#d4c191] transition"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePart2;