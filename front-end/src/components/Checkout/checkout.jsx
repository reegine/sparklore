import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { fetchProduct, fetchCharm } from '../../utils/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for cart items
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    province: '',
    postalCode: ''
  });

    // Handle shipping address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Fetch item details when component mounts
  useEffect(() => {
    const fetchItemDetails = async () => {
      const selectedItems = location.state?.selectedItems || [];
      console.log("Selected items from navigation:", selectedItems); // Log the selected items

      try {
        // If we have selected items from navigation, use them
        if (selectedItems.length > 0) {
          // Enhance items with full product and charm details
          const enhancedItems = await Promise.all(
            selectedItems.map(async (item) => {
              try {
                // Fetch product details
                const product = await fetchProduct(item.productId || item.id);
                
                // Fetch charm details if charms exist
                let charmDetails = [];
                if (item.charms && item.charms.length > 0) {
                  // Check if charms are already objects with IDs or just image URLs
                  if (typeof item.charms[0] === 'object') {
                    charmDetails = item.charms; // Already have charm objects
                  } else {
                    // Need to fetch charm details (this assumes charms are image URLs in the cart)
                    // You might need to adjust this based on your actual data structure
                    charmDetails = item.charms.map(image => ({ image }));
                  }
                }

                return {
                  ...item,
                  id: item.id,
                  name: product.name,
                  image: product.image || item.image,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  discount: item.discount,
                  quantity: item.quantity,
                  charms: charmDetails,
                  message: item.message || ""
                };
              } catch (error) {
                console.error("Error enhancing item:", error);
                return item; // Return the original item if enhancement fails
              }
            })
          );
          
          setCartItems(enhancedItems);
          console.log("Enhanced cart items:", enhancedItems); // Log the enhanced items
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [location.state]);

  // Shipping options with prices
  const shippingOptions = [
    { name: "Regular", description: "Est. 2-3 days", price: 15000 },
    { name: "Express", description: "Est. next day", price: 35000 }
  ];

  const paymentMethods = [
    { name: "VISA", icon: "💳" },
    { name: "Mastercard", icon: "💳" },
    { name: "BCA", icon: "🏦" },
    { name: "Mandiri", icon: "🏦" },
    { name: "Gopay", icon: "📱" }
  ];

  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showShippingDropdown, setShowShippingDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  // Calculate prices
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = cartItems.reduce((sum, item) => {
    if (item.discount && item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal + shippingCost;

  // Format currency for display
  const formatCurrency = (amount) => {
    return `Rp. ${amount.toLocaleString('id-ID')},00`;
  };

  const handlePlaceOrder = () => {
    if (!selectedShipping || !selectedPayment) {
      alert('Please select shipping and payment options');
      return;
    }

    // Prepare order data to pass to final checkout
    const orderData = {
      items: cartItems,
      shipping: selectedShipping,
      payment: selectedPayment,
      subtotal: subtotal,
      discount: discount,
      shippingCost: shippingCost,
      total: total,
      shippingAddress: shippingAddress // Add shipping address to order data
    };

    console.log("Data being passed to final_checkout:", orderData); // Log the data

    navigate('/checkout/payment', {
      state: {
        orderDetails: orderData
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfaf3] flex items-center justify-center">
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdfaf3] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">No items selected for checkout</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-[#e9d6a9] px-4 py-2 rounded-md hover:bg-[#e3c990]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf3] p-6 text-[#3b322c]">
      <div className="max-w-6xl mx-auto">
        <nav className="text-sm text-[#c9c3bc] mb-4">
          Home {'>'} Your Cart {'>'} <span className="text-[#3b322c] font-medium">Checkout</span>
        </nav>

        <div className='border border-[#f2e9d5] rounded-xl p-6 bg-white'>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-2xl font-semibold">Checkout</h2>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Contact Information</h3>
                  <a href="#" className="text-sm underline">Have an account?</a>
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleAddressChange}
                  placeholder="Your Full Name"
                  className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleAddressChange}
                  placeholder="your.email@mail.com"
                  className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
                  required
                />
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  Mail me about exclusive offer.
                </label>
              </div>

              <div>
                <h3 className="font-medium mt-4 mb-2">Shipping Address</h3>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                  placeholder="Your address"
                  className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  placeholder="+6281234567890"
                  className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
                  required
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="province"
                    value={shippingAddress.province}
                    onChange={handleAddressChange}
                    placeholder="Province, State"
                    className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    placeholder="12345"
                    className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
                    required
                  />
                </div>
              </div>

              {/* Shipping Dropdown */}
              <div className="relative">
                <h3 className="font-medium mt-4 mb-2">Shipping Option</h3>
                <button
                  className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 bg-[#e9d6a9] text-left flex justify-between items-center"
                  onClick={() => setShowShippingDropdown(!showShippingDropdown)}
                >
                  {selectedShipping ? (
                    <div className="flex justify-between w-full">
                      <span>{selectedShipping.name} ({selectedShipping.description})</span>
                      <span>{formatCurrency(selectedShipping.price)}</span>
                    </div>
                  ) : (
                    "Select shipping option"
                  )}
                  <svg
                    className={`w-5 h-5 transition-transform ${showShippingDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showShippingDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#f2e9d5] rounded-md shadow-lg">
                    {shippingOptions.map((option) => (
                      <div
                        key={option.name}
                        className={`px-4 py-3 cursor-pointer hover:bg-[#f3e3bc] ${selectedShipping?.name === option.name ? 'bg-[#f3e3bc]' : ''}`}
                        onClick={() => {
                          setSelectedShipping(option);
                          setShowShippingDropdown(false);
                        }}
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{option.name}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                          <div>{formatCurrency(option.price)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Dropdown */}
              <div className="relative">
                <h3 className="font-medium mt-4 mb-2">Payment Option</h3>
                <button
                  className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 bg-[#e9d6a9] text-left flex justify-between items-center"
                  onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                >
                  {selectedPayment ? (
                    <div className="flex items-center gap-2">
                      <span>{selectedPayment.icon}</span>
                      <span>{selectedPayment.name}</span>
                    </div>
                  ) : (
                    "Select payment method"
                  )}
                  <svg
                    className={`w-5 h-5 transition-transform ${showPaymentDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showPaymentDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#f2e9d5] rounded-md shadow-lg">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.name}
                        className={`px-4 py-3 cursor-pointer hover:bg-[#f3e3bc] flex items-center gap-2 ${selectedPayment?.name === method.name ? 'bg-[#f3e3bc]' : ''}`}
                        onClick={() => {
                          setSelectedPayment(method);
                          setShowPaymentDropdown(false);
                        }}
                      >
                        <span>{method.icon}</span>
                        <span>{method.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <h3 className="font-medium text-lg">Your Orders</h3>

              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/100"; // Fallback image
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm">x{item.quantity}</p>
                    
                    {/* Display prices with discount if applicable */}
                    {item.discount > 0 && item.originalPrice ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-[#b87777]">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-400 text-sm line-through">
                            {formatCurrency(item.originalPrice * item.quantity)}
                          </p>
                          <span className="text-xs bg-[#c3a46f] text-white px-1 rounded">
                            {item.discount}% OFF
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="font-semibold text-[#b87777]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    )}
                    {item.charms && item.charms.length > 0 && (
                      <>
                        <p className="text-sm mt-2">Charm Selection</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.charms.map((charm, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <img 
                                src={charm.image || charm} 
                                alt={charm.name || `Charm ${index}`}
                                className="w-10 h-10 object-contain border border-[#f2e9d5] rounded-sm p-1"
                                onError={(e) => {
                                  e.target.onerror = null; 
                                  e.target.src = "https://via.placeholder.com/40"; // Fallback image
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {item.message && (
                      <>
                        <p className="text-sm mt-2 text-start text-gray-600">Special Message</p>
                        <p className="text-xs italic">"{item.message}"</p>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-[#f2e9d5] text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-600">-{formatCurrency(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{selectedShipping ? formatCurrency(selectedShipping.price) : "Not selected"}</span>
                </div>
                
                <div className="flex justify-between font-semibold pt-2 border-t border-[#f2e9d5]">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="w-full bg-[#e9d6a9] text-lg font-medium py-3 mt-6 rounded-md hover:bg-[#e3c990] transition-colors disabled:opacity-50"
            onClick={handlePlaceOrder}
            disabled={!selectedShipping || !selectedPayment}
          >
            Place My Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;