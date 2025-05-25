import React from "react";
import { Link } from "react-router-dom";

const FaqRefund = () => {
  return (
    <div className="bg-[#f8f4ed] min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">FAQ & Refund Policy</h1>
        
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-[#e5cfa4] pb-2">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700">How long does shipping take?</h3>
              <p className="text-gray-600 mt-2">
                Our standard shipping typically takes 3-5 business days. During peak seasons, there may be slight delays.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700">Do you offer international shipping?</h3>
              <p className="text-gray-600 mt-2">
                Currently, we only ship within Indonesia. We're working to expand our shipping options in the future.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700">How can I track my order?</h3>
              <p className="text-gray-600 mt-2">
                Once your order is shipped, you'll receive a tracking number via email. You can use this number to track your package on our website or the courier's site.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700">What payment methods do you accept?</h3>
              <p className="text-gray-600 mt-2">
                We accept Visa, Mastercard, BCA, Mandiri, and GoPay. All transactions are secure and encrypted.
              </p>
            </div>
          </div>
        </div>
        
        {/* Refund Policy Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-[#e5cfa4] pb-2">Refund Policy</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Returns & Exchanges</h3>
              <p className="text-gray-600 mt-2">
                We accept returns within 14 days of delivery. Items must be unused, in their original condition, and in the original packaging.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700">Refund Process</h3>
              <p className="text-gray-600 mt-2">
                Once we receive your return, we'll inspect it and notify you of the refund status. If approved, refunds will be processed to the original payment method within 5-10 business days.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700">Damaged or Defective Items</h3>
              <p className="text-gray-600 mt-2">
                If you receive a damaged or defective item, please contact us immediately at <a href="mailto:sparkloremanagement@gmail.com" className="text-[#b87777]">sparkloremanagement@gmail.com</a> with photos of the product and packaging.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700">Non-Refundable Items</h3>
              <p className="text-gray-600 mt-2">
                Certain items like sale products or personalized items cannot be returned unless they arrive damaged or defective.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/" className="bg-[#e5cfa4] text-gray-900 font-semibold py-2 px-6 rounded-md hover:bg-[#d4bf8f] transition-colors inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FaqRefund;