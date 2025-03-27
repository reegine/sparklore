import React from "react";
import { Instagram, ShoppingBag, Music2 } from "lucide-react";

// Import payment logos
import visa from "../assets/payment/visa.png";
import mastercard from "../assets/payment/mastercard.png";
import bca from "../assets/payment/bca.png";
import mandiri from "../assets/payment/mandiri.png";
import gopay from "../assets/payment/gopay.png";

const Footer = () => {
  return (
    <footer className="bg-[#f8f4ed] py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:flex md:justify-between gap-8">
        
        {/* Newsletter Section */}
        <div className="text-center md:text-start">
          <h3 className="text-gray-900 text-lg font-semibold tracking-wide">NEWSLETTER</h3>
          <p className="text-gray-600 text-md mt-2">Sign up to our newsletter to receive exclusive offer</p>
          
          <div className="mt-4 max-w-xs mx-auto md:mx-0">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-700 p-2 rounded-md bg-transparent focus:outline-none"
            />
            <button className="w-full bg-[#e5cfa4] text-gray-900 font-semibold py-2 mt-3 rounded-md hover:bg-[#d4bf8f] transition-colors">
              SUBSCRIBE
            </button>
          </div>

          <div className="flex justify-center md:justify-start gap-4 mt-6 text-gray-900">
            <Instagram className="w-6 h-6 hover:text-[#b87777] cursor-pointer" />
            <Music2 className="w-6 h-6 hover:text-[#b87777] cursor-pointer" />
            <ShoppingBag className="w-6 h-6 hover:text-[#b87777] cursor-pointer" />
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center md:text-start">
          <h3 className="text-gray-900 text-lg font-semibold tracking-wide">FOOTER</h3>
          <ul className="mt-3 space-y-2 text-gray-700">
            {["ABOUT US", "SHIPPING", "CONTACT US", "FAQ", "REFUND POLICY"].map((item) => (
              <li key={item} className="hover:text-[#b87777] cursor-pointer">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        {/* Copyright - Mobile: Above payment, Desktop: Same row */}
        <div className="text-gray-500 text-sm text-center md:text-right">
                    © 2025 - SPARKLORE
          </div>

          {/* Payment Methods - Mobile: Below copyright, Desktop: Same row */}
          <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
            <img src={visa} alt="Visa" className="h-6 object-contain" />
            <img src={mastercard} alt="Mastercard" className="h-6 object-contain" />
            <img src={bca} alt="BCA" className="h-6 object-contain" />
            <img src={mandiri} alt="Mandiri" className="h-6 object-contain" />
            <img src={gopay} alt="GoPay" className="h-6 object-contain" />
          </div>
          
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;