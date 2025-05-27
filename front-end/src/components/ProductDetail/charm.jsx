import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { BASE_URL, fetchProduct } from "../../utils/api";
import { useParams } from 'react-router-dom';

// BASE IMAGES
import baseNecklace from "../../assets/default/basenecklace.png";

// Function to format numbers as Indonesian Rupiah
const formatIDR = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Math.round(amount));
};


export default function ProductDetailCharmBar() {
  const { productId } = useParams();
  const necklaceRef = useRef(null);
  const braceletRef = useRef(null);
  const recommendRef = useRef(null);
  const [baseImage, setBaseImage] = useState(baseNecklace);
  const [charmCount, setCharmCount] = useState(2);
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedCharms, setSelectedCharms] = useState({});
  const [openCategory, setOpenCategory] = useState(null);
  const [charmsData, setCharmsData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState({
    charms: true,
    products: true
  });
  const [error, setError] = useState(null);
  const [selectedBaseProduct, setSelectedBaseProduct] = useState(null);
  const navigate = useNavigate();
  

  // Fetch charms and products data from API
  useEffect(() => {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/products/${productId}/`);
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          const data = await response.json();
          setProduct(data);
          setMainImage(data.images[data.images.length - 1].image_url); // Set the main image to the last image
          if (data.charms) {
            setShowCharmCustomizer(true); // Show charm customizer if product has charms
          }
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

    fetchProduct();

    const fetchData = async () => {
      try {
        // Fetch charms
        const charmsResponse = await fetch(`${BASE_URL}/api/charms/`);
        if (!charmsResponse.ok) throw new Error('Failed to fetch charms');
        const charmsData = await charmsResponse.json();
        setCharmsData(charmsData);

        setLoading({ charms: false, products: false });
      } catch (err) {
        setError(err.message);
        setLoading({ charms: false, products: false });
      }
    };

    fetchData();
  }, [productId]);

  // Helper function to get the last image URL from a product
  const getLastProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      // Get the last image in the array
      return product.images[product.images.length - 1].image_url;
    }
    return '../../assets/default/banner_home.jpeg';
  };

  // Helper function to get the first image URL from a product
  const getFirstProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].image_url;
    }
    return '../../assets/default/banner_home.jpeg';
  };

  // Filter products by category and charms:true
  const filterProductsByCategory = (category) => {
    return productsData
      .filter(product => product.category === category && product.charms === true)
      .map(product => ({
        id: product.id,
        img: getFirstProductImage(product), // Use first image
        lastImg: getLastProductImage(product), // Use last image
        text: product.name,
        price: parseFloat(product.price),
        stock: product.stock,
        category: product.category
      }));
  };

  // Group charms by category
  const groupCharmsByCategory = () => {
    const grouped = {};
    charmsData.forEach(charm => {
      if (!grouped[charm.category]) {
        grouped[charm.category] = [];
      }
      grouped[charm.category].push(charm);
    });
    return grouped;
  };

  const handleBaseProductSelect = (product) => {
    setSelectedBaseProduct(product);
    setBaseImage(product.lastImg); // This will be the last image already
  };

  const scroll = (ref, direction) => {
    const scrollByAmount = 260;
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -scrollByAmount : scrollByAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCharmSelect = (charm) => {
    setSelectedCharms((prev) => ({
      ...prev,
      [selectedTab]: charm,
    }));
    if (selectedTab < charmCount) {
      setSelectedTab((prev) => prev + 1);
    }
  };

  const BaseProductItem = ({ product }) => (
    <div 
      key={product.id} 
      className={`relative group min-w-[15rem] ${product.stock === 0 ? 'opacity-70' : 'cursor-pointer'} hover:scale-105 transition-transform ${
        selectedBaseProduct?.id === product.id ? 'ring-4 ring-[#e6d5a7]' : ''
      }`}
      onClick={() => product.stock > 0 && handleBaseProductSelect(product)}
    >
      <img 
        src={product.img} 
        alt={product.text} 
        className={`w-[15rem] h-[15rem] object-cover shadow-md rounded ${product.stock === 0 ? 'grayscale' : ''}`} 
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = '../../assets/default/banner_home.jpeg'; // Fallback image
        }}
      />
      
      {product.stock === 0 ? (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          SOLD OUT
        </div>
      ) : product.stock < 10 ? (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
          LOW STOCK
        </div>
      ) : null}
      
      <div className="absolute inset-0 bg-[#f5f5dc] opacity-0 group-hover:opacity-80 flex flex-col justify-center items-center transition-opacity">
        <span className="text-lg font-bold text-center">{product.text}</span>
        <span className="text-sm">Rp {formatIDR(product.price)}</span>
      </div>
    </div>
  );

  const getCharmPosition = (index, total) => {
    const baseSize = '25.33%';

    if (total === 1) {
      return {
        width: baseSize,
        height: baseSize,
        left: '53%',
        top: '72%',
        transform: 'translate(-50%, -50%) rotate(0deg)'
      };
    }

    if (total === 2) {
      const rotationAngle = index === 0 ? 30 : -40;
      return {
        width: baseSize,
        height: baseSize,
        left: index === 0 ? '43%' : '65%',
        top: index === 0 ? '72%' : '70%',
        transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`
      };
    }
    
    if (total === 3) {
      const positions = [
        { left: '43%', top: '71%', rotation: 30 },
        { left: '55%', top: '73%', rotation: -5 },
        { left: '67%', top: '68%', rotation: -48 }
      ];
      return {
        width: baseSize,
        height: baseSize,
        left: positions[index].left,
        top: positions[index].top,
        transform: `translate(-50%, -50%) rotate(${positions[index].rotation}deg)`
      };
    }

    if (total === 4) {
      const positions = [
        { left: '41%', top: '70%', rotation: 40 },
        { left: '52%', top: '73%', rotation: 2 },
        { left: '64%', top: '70%', rotation: -35 },
        { left: '72%', top: '61%', rotation: -75 }
      ];
      return {
        width: baseSize,
        height: baseSize,
        left: positions[index].left,
        top: positions[index].top,
        transform: `translate(-50%, -50%) rotate(${positions[index].rotation}deg)`
      };
    }

    if (total === 5) {
      const positions = [
        { left: '41%', top: '70%', rotation: 40 },
        { left: '52%', top: '73%', rotation: 2 },
        { left: '64%', top: '70%', rotation: -35 },
        { left: '72%', top: '61%', rotation: -75 },
        { left: '35%', top: '63%', rotation: 73 }
      ];
      return {
        width: baseSize,
        height: baseSize,
        left: positions[index].left,
        top: positions[index].top,
        transform: `translate(-50%, -50%) rotate(${positions[index].rotation}deg)`
      };
    }

    return {
      width: baseSize,
      height: baseSize,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%) rotate(0deg)'
    };
  };

  if (loading.charms || loading.products) {
    return (
      <div className="bg-[#f9f5ef] min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#f9f5ef] min-h-screen flex justify-center items-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  const groupedCharms = groupCharmsByCategory();
  const necklaces = filterProductsByCategory('necklace');
  const bracelets = filterProductsByCategory('bracelet');
  const recommend = [...necklaces.slice(0, 3), ...bracelets.slice(0, 2)];

  // Check if we should show necklace or bracelet sections
  const showNecklaces = necklaces.length > 0;
  const showBracelets = bracelets.length > 0;

  // Calculate total price
  const calculateTotalPrice = () => {
  let total = parseFloat(selectedBaseProduct?.price) || 0;
  for (let i = 1; i <= charmCount; i++) {
    const charmPrice = parseFloat(selectedCharms[i]?.price);
    if (!isNaN(charmPrice)) {
      total += charmPrice;
    }
  }
  return total;
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


  return (
    <div className="bg-[#f9f5ef] min-h-screen">
      <div className="font-sans px-6 py-12 max-w-6xl mx-auto">

        {/* NECKLACES - Only show if there are necklaces with charms:true */}
        {showNecklaces && (
          <>
            <h2 className="text-2xl font-serif font-semibold mb-6">SELECT A NECKLACE (OPTIONAL)</h2>
            <div className="relative mb-10">
              <button onClick={() => scroll(necklaceRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2">
                <ChevronLeft size={28} />
              </button>
              <div ref={necklaceRef} className="flex gap-4 overflow-x-auto ml-12 mr-12 pb-2 no-scrollbar">
                {necklaces.map((product) => (
                  <BaseProductItem product={product} key={product.id} />
                ))}
              </div>
              <button onClick={() => scroll(necklaceRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2">
                <ChevronRight size={28} />
              </button>
            </div>
          </>
        )}

        {/* BRACELETS - Only show if there are bracelets with charms:true */}
        {showBracelets && (
          <>
            <h2 className="text-2xl font-serif font-semibold mt-12 mb-6">OR SELECT A BRACELET (OPTIONAL)</h2>
            <div className="relative mb-10">
              <button onClick={() => scroll(braceletRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2">
                <ChevronLeft size={28} />
              </button>
              <div ref={braceletRef} className="flex gap-4 overflow-x-auto ml-12 mr-12 pb-2 no-scrollbar">
                {bracelets.map((product) => (
                  <BaseProductItem product={product} key={product.id} />
                ))}
              </div>
              <button onClick={() => scroll(braceletRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2">
                <ChevronRight size={28} />
              </button>
            </div>
          </>
        )}

        {/* CUSTOMIZER - Always shown */}
        <div className="my-8 p-4 bg-[#f5f0e6] rounded-lg">
          {selectedBaseProduct ? (
            <>
              <h3 className="text-xl font-medium mb-2">Selected Base: {selectedBaseProduct.text}</h3>
              <p className="text-gray-700">Rp {formatIDR(selectedBaseProduct.price)}</p>
              <button 
                onClick={() => {
                  setSelectedBaseProduct(null);
                  setBaseImage(baseNecklace);
                }}
                className="mt-2 text-sm text-[#c3a46f] hover:underline"
              >
                Reset to Default Base
              </button>
            </>
          ) : (
            <p className="text-gray-700">Using default base product</p>
          )}
        </div>

        <h2 className="text-xl font-medium mb-4">Customize Your Charm</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => {
                setCharmCount(num);
                setSelectedTab(1);
                setSelectedCharms({});
              }}
              className={clsx("px-4 py-2 border rounded transition", charmCount === num ? "bg-[#e6d5a7]" : "bg-white")}
            >
              {num} Charm{num > 1 && "s"}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="bg-white rounded p-4 relative overflow-hidden" style={{ width: '100%', maxWidth: '500px', aspectRatio: '1/1' }}>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative" style={{ width: '100%', height: '100%' }}>
                <img 
                  src={baseImage} 
                  alt="Base" 
                  className="absolute w-full h-full object-contain" 
                  style={{ aspectRatio: '1/1' }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  {Array.from({ length: charmCount }, (_, i) => (
                    selectedCharms[i + 1] && (
                      <div 
                        key={i}
                        className="absolute"
                        style={{
                          width: '33.33%',
                          height: '33.33%',
                          aspectRatio: '1/1',
                          zIndex: i + 1,
                          ...getCharmPosition(i, charmCount)
                        }}
                      >
                        <img
                          src={selectedCharms[i + 1].image}
                          alt={`Charm ${i + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-2xl font-semibold mb-4">
              {formatIDR(calculateTotalPrice())}
            </div>

            <div className="flex gap-2 mb-4">
              {Array.from({ length: charmCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTab(i + 1)}
                  className={clsx(
                    "px-4 py-1 rounded border",
                    selectedTab === i + 1 ? "bg-[#e6d5a7]" : "bg-white"
                  )}
                >
                  Charm {i + 1}
                </button>
              ))}
            </div>

            <button className="w-full bg-[#e6d5a7] text-center py-2 rounded mb-4 font-medium">
              Add to cart
            </button>

            <div className="space-y-4 max-h-[25vw] overflow-y-auto pr-2">
              {Object.entries(groupedCharms).map(([category, charms]) => (
                <div key={category} className="mb-2">
                  <button
                    onClick={() => setOpenCategory(openCategory === category ? null : category)}
                    className="w-full flex justify-between items-center py-2 border-b"
                  >
                    <span>{category.replace(/_/g, ' ')}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {openCategory === category && (
                    <div className="grid grid-cols-3 gap-2 p-2">
                      {charms.map((charm) => (
                        <div 
                          key={charm.id} 
                          className="relative cursor-pointer group" 
                          onClick={() => handleCharmSelect(charm)}
                        >
                          <img
                            src={charm.image}
                            alt={charm.name}
                            className="hover:scale-105 transition rounded border p-1 w-full"
                          />
                          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className="absolute inset-0 opacity-0 group-hover:opacity-100 flex justify-center items-center text-white text-sm font-semibold transition">
                            {charm.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>               
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <h2 className="text-2xl font-serif font-semibold mb-6 mt-20">YOU MIGHT ALSO LIKE...</h2>
        {recommend.length > 0 ? (
          <div className="relative mb-10">
            <button onClick={() => scroll(recommendRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2">
              <ChevronLeft size={28} />
            </button>
            <div ref={recommendRef} className="flex gap-4 overflow-x-auto ml-12 mr-12 pb-2 no-scrollbar">
              {recommend.map((product) => (
                <BaseProductItem product={product} key={product.id} />
              ))}
            </div>
            <button onClick={() => scroll(recommendRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2">
              <ChevronRight size={28} />
            </button>
          </div>
        ) : (
          <p className="text-center py-8">No recommendations available</p>
        )}
      </div>
    </div>
  );
}


// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
// import clsx from "clsx";
// import { BASE_URL } from "../../utils/api.js";

// // BASE IMAGES
// import baseNecklace from "../../assets/default/basenecklace.png";

// // Function to format numbers as Indonesian Rupiah
// const formatIDR = (amount) => {
//   return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",00";
// };

// const ProductDetailCharmBar = () => {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [mainImage, setMainImage] = useState('');
//   const [baseImage, setBaseImage] = useState(baseNecklace);
//   const [charmCount, setCharmCount] = useState(2);
//   const [selectedTab, setSelectedTab] = useState(1);
//   const [selectedCharms, setSelectedCharms] = useState({});
//   const [openCategory, setOpenCategory] = useState(null);
//   const [charmsData, setCharmsData] = useState([]);
//   const [showCharmCustomizer, setShowCharmCustomizer] = useState(false);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/api/products/${productId}/`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch product');
//         }
//         const data = await response.json();
//         setProduct(data);
//         setMainImage(data.images[data.images.length - 1].image_url); // Set the main image to the last image
//         if (data.charms) {
//           setShowCharmCustomizer(true); // Show charm customizer if product has charms
//         }
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   useEffect(() => {
//     const fetchCharms = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/api/charms/`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch charms');
//         }
//         const data = await response.json();
//         setCharmsData(data);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchCharms();
//   }, []);

//   const handleCharmSelect = (charm) => {
//     setSelectedCharms((prev) => ({
//       ...prev,
//       [selectedTab]: charm,
//     }));
//     if (selectedTab < charmCount) {
//       setSelectedTab((prev) => prev + 1);
//     }
//   };

//   const calculateTotalPrice = () => {
//     let total = parseFloat(product.price) || 0; // Start with product price
//     for (let i = 1; i <= charmCount; i++) {
//       const charmPrice = parseFloat(selectedCharms[i]?.price);
//       if (!isNaN(charmPrice)) {
//         total += charmPrice; // Add selected charm prices
//       }
//     }
//     return total;
//   };

//   if (loading) {
//     return (
//       <div className='bg-[#faf7f0] flex justify-center items-center h-64'>
//         <p>Loading product details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className='bg-[#faf7f0] flex justify-center items-center h-64'>
//         <p>Error: {error}</p>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className='bg-[#faf7f0] flex justify-center items-center h-64'>
//         <p>Product not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className='bg-[#faf7f0] relative'>
//       <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 font-serif text-[#2d2a26]">
//         {/* Product Details */}
//         <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
//         <p className="text-lg font-bold mb-4">Rp {formatIDR(product.price)}</p>
//         <img src={mainImage} alt={product.name} className="w-full max-w-lg rounded-lg shadow-md mb-4" />

//         {/* Charm Customizer */}
//         {showCharmCustomizer && (
//           <div className="my-8 p-4 bg-[#f5f0e6] rounded-lg">
//             <h3 className="text-xl font-medium mb-2">Customize Your Charm</h3>
//             <div className="flex flex-wrap gap-2 mb-6">
//               {[1, 2, 3, 4, 5].map((num) => (
//                 <button
//                   key={num}
//                   onClick={() => {
//                     setCharmCount(num);
//                     setSelectedTab(1);
//                     setSelectedCharms({});
//                   }}
//                   className={clsx("px-4 py-2 border rounded transition", charmCount === num ? "bg-[#e6d5a7]" : "bg-white")}
//                 >
//                   {num} Charm{num > 1 && "s"}
//                 </button>
//               ))}
//             </div>

//             <div className="flex flex-col lg:flex-row gap-8">
//               <div className="bg-white rounded p-4 relative overflow-hidden" style={{ width: '100%', maxWidth: '500px', aspectRatio: '1/1' }}>
//                 <img src={baseImage} alt="Base" className="absolute w-full h-full object-contain" />
//                 {Array.from({ length: charmCount }, (_, i) => (
//                   selectedCharms[i + 1] && (
//                     <img
//                       key={i}
//                       src={selectedCharms[i + 1].image}
//                       alt={`Charm ${i + 1}`}
//                       className="absolute inset-0 object-cover w-full h-full"
//                       style={{ zIndex: i + 1 }}
//                     />
//                   )
//                 ))}
//               </div>

//               <div className="flex-1">
//                 <div className="text-2xl font-semibold mb-4">
//                   Rp {formatIDR(calculateTotalPrice())}
//                 </div>

//                 <div className="flex gap-2 mb-4">
//                   {Array.from({ length: charmCount }, (_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setSelectedTab(i + 1)}
//                       className={clsx(
//                         "px-4 py-1 rounded border",
//                         selectedTab === i + 1 ? "bg-[#e6d5a7]" : "bg-white"
//                       )}
//                     >
//                       Charm {i + 1}
//                     </button>
//                   ))}
//                 </div>

//                 <button className="w-full bg-[#e6d5a7] text-center py-2 rounded mb-4 font-medium">
//                   Add to cart
//                 </button>

//                 <div className="space-y-4 max-h-[25vw] overflow-y-auto pr-2">
//                   {charmsData.map((charm) => (
//                     <div key={charm.id} className="relative cursor-pointer group" onClick={() => handleCharmSelect(charm)}>
//                       <img
//                         src={charm.image}
//                         alt={charm.name}
//                         className="hover:scale-105 transition rounded border p-1 w-full"
//                       />
//                       <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex justify-center items-center text-white text-sm font-semibold transition">
//                         {charm.name}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetailCharmBar;
