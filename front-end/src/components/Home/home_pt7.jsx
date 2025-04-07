import React from "react";

// Import your images
import img1 from "../../assets/default/homeproduct1.png";
import img2 from "../../assets/default/homeproduct2.png";
import img3 from "../../assets/default/homeproduct3.png";
import img4 from "../../assets/default/homeproduct4.png";
import img5 from "../../assets/default/homeproduct5.jpeg";
import img6 from "../../assets/default/homeproduct6.jpeg";

const images = [img1, img2, img3, img4, img5, img6];

const JewelryGallery = () => {
  return (
    <div className="bg-[#f8f4ed] py-14 px-6">
      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <h2 className="text-gray-900 text-xl md:text-2xl font-semibold tracking-wide">
          JEWELRY THAT SPEAKS FOR YOU
        </h2>
        <p className="text-gray-500 text-md md:text-lg mt-2">
          Tag <span className="font-medium">@sparklore.official</span> to be featured
        </p>
      </div>

      {/* 3x2 Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            <img
              src={image}
              alt={`Jewelry ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JewelryGallery;
