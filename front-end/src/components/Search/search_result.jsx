import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, Plus } from "lucide-react";



import product1 from "../../assets/default/charmbar_product1.png";
import product2 from "../../assets/default/charmbar_product2.png";
import product3 from "../../assets/default/charmbar_product3.png";
import product4 from "../../assets/default/charmbar_product4.png";
import product5 from "../../assets/default/charmbar_product5.png";
import product6 from "../../assets/default/charmbar_product6.png";
import product7 from "../../assets/default/charmbar_product7.png";
import product8 from "../../assets/default/charmbar_product8.png";

const products = [
  {
    id: 1,
    name: "CLASSIC SHIMMER CHAIN",
    type: "GOLD",
    price: "Rp 59.999,00",
    originalPrice: null,
    rating: 0,
    image: product1,
    category: "Best Seller",
    stock: 5,
  },
  {
    id: 2,
    name: "CLASSIC SERPENT CHAIN",
    type: "GOLD",
    price: "Rp 79.999,00",
    originalPrice: null,
    rating: 0,
    image: product2,
    category: "New Arrival",
    stock: 15,
  },
  {
    id: 3,
    name: "CLASSIC SHIMMER CHAIN",
    type: "SILVER",
    price: "Rp 49.999,00",
    originalPrice: null,
    rating: 0,
    image: product3,
    category: "Newest",
    stock: 0,
  },
  {
    id: 4,
    name: "CLASSIC SERPENT CHAIN",
    type: "SILVER",
    price: "Rp 69.999,00",
    originalPrice: null,
    rating: 0,
    image: product4,
    category: "Oldest",
    stock: 8,
  },
  {
    id: 5,
    name: "THE CLASSIC SERPENT NECKLACE",
    type: "GOLD",
    price: "Rp 85.499,00",
    originalPrice: "Rp 89.999,00",
    rating: 1,
    image: product5,
    category: "Best Seller",
    stock: 0,
  },
  {
    id: 6,
    name: "THE CLASSIC SERPENT NECKLACE",
    type: "SILVER",
    price: "Rp 85.499,00",
    originalPrice: "Rp 89.999,00",
    rating: 1,
    image: product6,
    category: "New Arrival",
    stock: 2,
  },
  {
    id: 7,
    name: "THE LOVE LIFE NECKLACE",
    type: "GOLD",
    price: "Rp 99.999,00",
    originalPrice: null,
    rating: 0,
    image: product7,
    category: "Newest",
    stock: 12,
  },
  {
    id: 8,
    name: "THE LOVE LIFE NECKLACE",
    type: "SILVER",
    price: "Rp 79.999,00",
    originalPrice: null,
    rating: 0,
    image: product8,
    category: "Oldest",
    stock: 1,
  },
];

export default function SearchProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Parse search query from URL
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';
    setSearchQuery(query);

    // Filter products based on search query
    if (query) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.type.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [location.search]);



// API one
//   useEffect(() => {
//   const queryParams = new URLSearchParams(location.search);
//   const query = queryParams.get('q') || '';
//   setSearchQuery(query);

//   if (query) {
//     // Fetch from API instead of filtering local data
//     fetch(`/api/search?q=${encodeURIComponent(query)}`)
//       .then(res => res.json())
//       .then(data => setFilteredProducts(data))
//       .catch(err => console.error("Search error:", err));
//   } else {
//     setFilteredProducts([]); // or fetch popular items
//   }
// }, [location.search]);



  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <div className="min-h-screen bg-[#fdf8f3] px-6 py-10 font-serif relative">
      <div className="text-center px-4 text-[#302E2A] mb-8">
        <h1 className="text-xl md:text-4xl mb-4 tracking-wider">
          Search Results
        </h1>
        <p className="text-md md:text-2xl leading-relaxed">
          {filteredProducts.length} results for "{searchQuery}"
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product.id}
              className={`p-2 rounded-lg hover:shadow-md transition duration-200 relative ${
                product.stock === 0 ? 'opacity-70' : 'cursor-pointer'
              }`}
              onClick={() => product.stock > 0 && handleProductClick(product.id)}
            >
              <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className={`rounded-md w-full h-auto object-cover ${
                  product.stock === 0 ? 'grayscale' : ''
                }`}
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
              
              {/* Only show add to cart button if product is in stock */}
              {product.stock > 0 && (
                <div className="absolute bottom-2 right-2 bg-white p-1 rounded-b-xs">
                  <button 
                    className="bg-white text-[#c3a46f] border border-[#c3a46f] p-1 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="text-center mt-2">
              <p className="text-sm font-semibold uppercase text-[#403c39] leading-tight">
                {product.name}
              </p>
              <p className="text-[10px] mt-1">
                <span className="px-2 py-[2px] text-[#c3a46f] bg-[#f1ede5] border border-[#c3a46f] rounded-sm">
                  {product.type}
                </span>
              </p>
              <div className="flex justify-center mt-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < product.rating ? "text-yellow-500" : "text-gray-300"}
                    />
                  ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.rating})
                </span>
              </div>
              <div className="mt-1">
                <p className="text-sm font-medium text-[#403c39]">
                  {product.price}
                </p>
                {product.originalPrice && (
                  <p className="text-xs text-gray-400 line-through">
                    {product.originalPrice}
                  </p>
                )}
              </div>
            </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-600">No products found matching your search.</p>
          </div>
        )}
      </div>

      {/* Pagination - Only show if there are results */}
      {filteredProducts.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#c3a46f] text-white rounded-l"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-[#403c39]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#c3a46f] text-white rounded-r"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}