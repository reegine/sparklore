import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Checkbox component
const Checkbox = ({ id, ...props }) => (
  <input
    type="checkbox"
    id={id}
    className="h-4 w-4 rounded border-[#e3d5c5] text-[#3a2e2a] focus:ring-[#3a2e2a]"
    {...props}
  />
);

const FinalCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails || {
    items: [
      {
        name: "Charm Link Custom Bracelet",
        price: 369998,
        quantity: 1,
        charms: [
          { name: "Horse", image: "/charm1.png" },
          { name: "Hand", image: "/charm2.png" },
          { name: "Palm Tree", image: "/charm3.png" },
          { name: "Music Note", image: "/charm4.png" }
        ],
        message: "This is for the special message if the user want to send a message to the recipient."
      },
      {
        name: "Marbella Ring",
        price: 99999,
        quantity: 1
      }
    ],
    shipping: { name: "Express", price: 35000 },
    payment: { name: "VISA", icon: "💳" },
    total: 504997
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rp. ${amount.toLocaleString('id-ID')},00`;
  };

  // Calculate totals
  const subtotal = orderDetails.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = orderDetails.shipping?.price || 0;
  const total = orderDetails.total || (subtotal + shippingCost);

  // Handle payment submission
  const handlePayment = () => {
    // Here you would typically:
    // 1. Validate form inputs
    // 2. Process payment (API call)
    // 3. Then navigate to tracking page
    
    // Generate a random order ID for demo purposes
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    
    navigate('/track-order', {
      state: {
        orderId,
        orderDetails: {
          ...orderDetails,
          status: 'Processing',
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] px-6 py-10 font-serif text-[#3a2e2a]">
      <div className="max-w-6xl mx-auto border border-[#f4e8d7] rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#fffaf3]">
        {/* Left - Order Summary */}
        <div className="space-y-8">
          <h1 className="text-2xl font-semibold">Order Summary</h1>
          
          {/* Shipping Info */}
          <div className="bg-[#f9f2e6] p-4 rounded-lg">
            <h2 className="font-medium mb-2">Shipping Information</h2>
            <p className="text-sm">Express Delivery (Est. next day)</p>
            <p className="text-sm mt-1">{formatCurrency(orderDetails.shipping?.price || 0)}</p>
          </div>

          {/* Products */}
          {orderDetails.items.map((item, index) => (
            <div key={index} className="flex gap-4">
              <img 
                src={item.image || (item.name.includes('Bracelet') ? "/bracelet.jpg" : "/ring.jpg")} 
                alt={item.name}
                className="w-24 h-24 rounded-md object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-700">x{item.quantity}</p>
                <p className="text-md font-medium mt-1">{formatCurrency(item.price * item.quantity)}</p>
                
                {item.charms && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Charm Selection</p>
                    <div className="flex gap-1">
                      {item.charms.map((charm, i) => (
                        <img key={i} src={charm.image} alt={charm.name} className="w-6 h-6" />
                      ))}
                    </div>
                  </div>
                )}

                {item.message && (
                  <div className="mt-3 text-sm italic text-gray-700">
                    <p>"{item.message}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          <hr className="my-4 border-[#e3d5c5]" />

          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Right - Payment */}
        <div className="bg-[#edd4a7] rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Payment Details</h3>
            <div className="text-2xl">{orderDetails.payment?.icon || "💳"}</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm">Name on Card</label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full mt-1 p-2 rounded-md border border-[#e3d5c5] bg-white"
              />
            </div>
            <div>
              <label className="text-sm">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full mt-1 p-2 rounded-md border border-[#e3d5c5] bg-white"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm">Exp. Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full mt-1 p-2 rounded-md border border-[#e3d5c5] bg-white"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm">CVV</label>
                <input
                  type="text"
                  placeholder="***"
                  className="w-full mt-1 p-2 rounded-md border border-[#e3d5c5] bg-white"
                />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-md mt-4">Billing Address</h4>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox id="sameAddress" />
                  Same as shipping address
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox id="differentAddress" />
                  Use different address
                </label>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              className="w-full mt-6 bg-[#3a2e2a] text-white py-3 rounded-md hover:bg-[#2c221f] transition"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCheckout;