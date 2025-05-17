import React from "react";
import { CheckCircle } from "lucide-react";
import product1 from "../../assets/default/homeproduct1.png";
import product2 from "../../assets/default/homeproduct2.png";
import charmHorse from "../../assets/charms/charm1.png";
import charmHand from "../../assets/charms/charm2.png";
import charmPalm from "../../assets/charms/charm3.png";
import charmMusic from "../../assets/charms/charm4.png";

const OrderTrackingPage = () => {
  // Charm data with imported images
  const charms = [
    { name: "Horse", image: charmHorse },
    { name: "Hand", image: charmHand },
    { name: "Palm Tree", image: charmPalm },
    { name: "Music Note", image: charmMusic }
  ];

  return (
    <div className="min-h-screen px-6 py-10 bg-[#FFF9F3]">
      <div className="max-w-6xl mx-auto">
        <nav className="text-sm text-gray-400 mb-4">
          <span>Checkout</span> <span className="mx-1">&gt;</span> <span>Payment</span> <span className="mx-1">&gt;</span> <span className="text-gray-800">Track my order</span>
        </nav>
        
        <div className="bg-white border border-[#f4e7d8] rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-serif font-semibold mb-4">My Order</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-b py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Regular delivery service</h3>
              <p className="text-lg">Est. 1 - Feb - 2025</p>
            </div>
            <div className="md:text-right">
              <h3 className="text-lg font-semibold">Order ID</h3>
              <p className="text-lg">#1234567890</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-6 border-b pb-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Payment Successful</span>
              </div>
              <div className="text-sm space-y-1">
                <div>Paid by <span className="font-bold text-blue-700 ml-1">VISA</span></div>
                <div className="flex justify-between max-w-xs">
                  <span>Order Time</span><span>28-01-2025 11:04</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span>Payment Time</span><span>28-01-2025 11:04</span>
                </div>
              </div>
            </div>
            <div className="md:pl-8 mt-4 md:mt-0">
              <p className="font-semibold text-gray-700">
                <span role="img" aria-label="box">📦</span> Your jewel is in the packing process
              </p>
              <p className="text-sm text-gray-400 mb-2">Will be delivered by 1 Feb 2025</p>
              <div className="text-sm">
                <p className="font-semibold">Jane Doe <span className="text-gray-500">(+62) 812 345 678 900</span></p>
                <p>Jl. Pahlawan No. 45, RT 05/RW 03,<br/>Menteng, Menteng, Jakarta Pusat, DKI Jakarta, 10310</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4">
            <div className="space-y-4">
              {/* Bracelet Product */}
              <div className="flex items-start space-x-4">
                <img 
                  src={product1} 
                  alt="Bracelet" 
                  className="rounded w-24 h-24 object-cover" 
                  style={{ aspectRatio: "1/1" }}
                />
                <div>
                  <p className="font-semibold">Charm Link Custom Bracelet</p>
                  <p className="text-sm text-gray-500">x1</p>
                  <p className="mt-1">Rp. 369.998,00</p>
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Charm Selection</p>
                    <div className="flex space-x-2 mt-2">
                      {charms.map((charm, i) => (
                        <img 
                          key={i} 
                          src={charm.image} 
                          alt={charm.name} 
                          className="w-8 h-8 object-contain"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="font-medium text-start text-gray-600">Special Message</p>
                    <p className="italic text-gray-600">"This is for the special message if the user want to send a message to the recipient."</p>
                  </div>
                </div>
              </div>

              {/* Ring Product */}
              <div className="flex items-start space-x-4">
                <img 
                  src={product2} 
                  alt="Ring" 
                  className="rounded w-24 h-24 object-cover"
                  style={{ aspectRatio: "1/1" }}
                />
                <div>
                  <p className="font-semibold">Marbella Ring</p>
                  <p className="text-sm text-gray-500">x1</p>
                  <p className="mt-1">Rp. 99.999,00</p>
                </div>
              </div>

              <div className="pt-2 border-t text-right font-semibold">
                <p>Total <span className="ml-2">Rp. 469.997,00</span></p>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="md:pl-8">
              <div className="border-l-2 border-gray-300 pl-6 relative">
                <div className="absolute -left-[11px] top-2">
                  <CheckCircle className="text-green-500" size={20} />
                </div>
                <p className="text-sm text-gray-500">12:05, 28 - 01 - 2024</p>
                <p className="mb-4">Your jewel is in the packing process</p>

                <div className="absolute -left-[11px] top-20">
                  <CheckCircle className="text-green-500" size={20} />
                </div>
                <p className="text-sm text-gray-500">11:04, 28 - 01 - 2024</p>
                <p>We've received your order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;