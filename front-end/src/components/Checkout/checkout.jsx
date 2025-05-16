import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import product1 from "../../assets/default/homeproduct1.png";
import product2 from "../../assets/default/homeproduct2.png";
import charmHorse from "../../assets/charms/charm1.png";
import charmHand from "../../assets/charms/charm2.png";
import charmPalm from "../../assets/charms/charm3.png";
import charmMusic from "../../assets/charms/charm4.png";

const CheckoutPage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Sample cart items with prices and charm images
  const [cartItems] = useState([
    {
      id: 1,
      name: "Charm Link Custom Bracelet",
      image: product1,
      quantity: 1,
      price: 369998,
      charms: [
        { name: "Horse", image: charmHorse },
        { name: "Hand", image: charmHand },
        { name: "Palm Tree", image: charmPalm },
        { name: "Music Note", image: charmMusic }
      ],
      message: "This is for the special message if the user want to send a message to the recipient."
    },
    {
      id: 2,
      name: "Marbella Ring",
      image: product2,
      quantity: 1,
      price: 99999
    }
  ]);

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

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0;
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal + shippingCost - discount;

  // Format currency for display
  const formatCurrency = (amount) => {
    return `Rp. ${amount.toLocaleString('id-ID')},00`;
  };

  const handlePlaceOrder = () => {
    // You can add any validation or order processing logic here
    // For example, check if shipping and payment are selected
    if (!selectedShipping || !selectedPayment) {
      alert('Please select shipping and payment options');
      return;
    }

    // Navigate to the finalCheckout page
    navigate('/checkout/payment', {
      state: {
        orderDetails: {
          items: cartItems,
          shipping: selectedShipping,
          payment: selectedPayment,
          total: total
        }
      }
    });
  };

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
                  placeholder="Your Full Name"
                  className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
                />
                <input
                  type="email"
                  placeholder="your.email@mail.com"
                  className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
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
                  placeholder="Your address"
                  className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
                />
                <input
                  type="text"
                  placeholder="+6281234567890"
                  className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Province, State"
                    className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
                  />
                  <input
                    type="text"
                    placeholder="12345"
                    className="w-full border border-[#f2e9d5] rounded-md px-4 py-2 mb-3 bg-[#fdfaf3]"
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
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm">x{item.quantity}</p>
                    <p className="font-semibold mt-1">{formatCurrency(item.price * item.quantity)}</p>
                    {item.charms && (
                      <>
                        <p className="text-sm mt-2">Charm Selection</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.charms.map((charm, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <img 
                                src={charm.image} 
                                alt={charm.name}
                                className="w-10 h-10 object-contain border border-[#f2e9d5] rounded-sm p-1" 
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {item.message && (
                      <>
                        <p className="text-sm mt-2">Special Message</p>
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
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{selectedShipping ? formatCurrency(selectedShipping.price) : "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>{formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* <button 
            className="w-full bg-[#e9d6a9] text-lg font-medium py-3 mt-6 rounded-md hover:bg-[#e3c990] transition-colors disabled:opacity-50"
            onClick={() => {
              // Handle order placement
              alert(`Order placed! Total: ${formatCurrency(total)}`);
            }}
            disabled={!selectedShipping || !selectedPayment}
          >
            Place My Order
          </button> */}

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