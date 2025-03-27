import React from "react";
import people1 from "../assets/default/people1.jpeg";
import people2 from "../assets/default/people2.jpeg";
import people3 from "../assets/default/people3.jpeg";
import product1 from "../assets/default/homeproduct1.png";
import product2 from "../assets/default/homeproduct2.png";

const reviews = [
  {
    name: "Caroline Thalia",
    date: "02/05/2025",
    text: "Finally found a jewelry brand that can represent my life and affordability!!",
    rating: 5,
    image: people1,
    products: [
      {
        name: "Luna Pin Necklace + 2 Charms",
        type: "SILVER",
        image: product1,
      },
    ],
  },
  {
    name: "Okta R.",
    date: "02/04/2025",
    text: "The Timeless Elegance Studs are exactly what I was looking for! They're simple, classy, and go with everything.",
    rating: 5,
    image: people2,
    products: [
      {
        name: "Timeless Elegance Studs",
        type: "GOLD",
        image: product2,
      },
      {
        name: "Luna Loop Necklace + 1 Charm",
        type: "SILVER",
        image: product1,
      },
    ],
  },
  {
    name: "Nadia",
    date: "01/19/2025",
    text: "Finally found a brand that can combine the charm my grandma gave me and their cut charms so cute! Totally love this!",
    rating: 4,
    image: people3,
    products: [
      {
        name: "Luna Loop Necklace + 1 Charm",
        type: "SILVER",
        image: product2,
      },
    ],
  },
  {
    name: "Gabriel",
    date: "01/10/2025",
    text: "I took my SparkLore bracelet and ring to the beach, and it held up beautifully! The charms didn't tarnish, and the quality is incredible—even after being exposed to sun and saltwater.",
    rating: 5,
    image: people1,
    products: [
      {
        name: "Charm Link Bracelet + 2 Charms",
        type: "GOLD",
        image: product1,
      },
      {
        name: "Timeless Artisan Ring",
        type: "GOLD",
        image: product2,
      },
    ],
  },
  {
    name: "Caroline Thalia",
    date: "02/05/2025",
    text: "Finally found a jewelry brand that can represent my life and affordability!!",
    rating: 5,
    image: people1,
    products: [
      {
        name: "Luna Pin Necklace + 2 Charms",
        type: "SILVER",
        image: product1,
      },
    ],
  },
  {
    name: "Okta R.",
    date: "02/04/2025",
    text: "The Timeless Elegance Studs are exactly what I was looking for! They're simple, classy, and go with everything.",
    rating: 5,
    image: people2,
    products: [
      {
        name: "Timeless Elegance Studs",
        type: "GOLD",
        image: product2,
      },
      {
        name: "Luna Loop Necklace + 1 Charm",
        type: "SILVER",
        image: product1,
      },
    ],
  },
];

const Reviews = () => {
  return (
    <div className="bg-[#F9F5EE] py-16 px-4">
      {/* Section Title & Reviews Count */}
      <div className="max-w-6xl mx-auto text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">WHAT THEY SAY</h2>
        <div className="flex items-center justify-center mt-2 space-x-2">
          <span className="text-yellow-500 text-xl">★★★★★</span>
          <p className="text-gray-800 text-lg font-medium">60 Review ▼</p>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-[#faf7f0] p-4 rounded-xl shadow-lg break-inside-avoid mb-6"
          >
            {/* Review Image */}
            <img
              src={review.image}
              alt={review.name}
              className="w-full h-64 object-cover rounded-md"
            />

            {/* Review Content */}
            <div className="mt-4 px-2">
              <h3 className="font-semibold text-lg text-gray-900">{review.name}</h3>
              <p className="text-gray-500 text-sm">{review.date}</p>
              <p className="text-yellow-500">{'★'.repeat(review.rating)}</p>
              <p className="text-gray-700 mt-2">{review.text}</p>

              {/* Purchased Products */}
              <div className="mt-4 border-t border-gray-300 pt-3">
                {review.products.map((product, idx) => (
                  <div key={idx} className="flex items-start gap-3 mt-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div>
                      <p className="text-gray-800 font-medium mb-2">{product.name}</p>
                      <span className="text-sm text-[#e8d6a8] px-2 py-1 rounded-md border-3 border-[#e8d6a8]">
                        {product.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <div className="text-center mt-8">
        <button className="px-6 py-2 border border-gray-900 text-gray-900 rounded-md hover:bg-gray-900 hover:text-white transition">
          Show More Review
        </button>
      </div>
    </div>
  );
};

export default Reviews;
