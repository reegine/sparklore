import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  Rows2,
} from "lucide-react";
import { cn } from "../../utils/utils.js";

export default function ProductGrid() {
  const navigate = useNavigate();
  const [layout, setLayout] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filters, setFilters] = useState({
    material: [],
    product: [],
    price: [],
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://192.168.1.12:8000/api/products/");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        
        // Filter only necklace products and transform data
        let necklaceProducts = data
          .filter(product => product.category.toLowerCase() === "necklace")
          .map(product => ({
            id: product.id,
            name: product.name,
            type: product.label.toUpperCase(),
            price: `Rp ${parseFloat(product.price).toLocaleString('id-ID')}`,
            originalPrice: null,
            rating: parseFloat(product.rating) || 0,
            image: product.image,
            stock: product.stock,
            createdAt: product.created_at || new Date().toISOString()
          }));

        // Identify best sellers (top 10 by rating)
        const byRating = [...necklaceProducts].sort((a, b) => b.rating - a.rating);
        const bestSellerIds = byRating.slice(0, 10).map(p => p.id);

        // Identify new arrivals (top 10 most recent)
        const byCreationDate = [...necklaceProducts].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt));
        const newArrivalIds = byCreationDate.slice(0, 10).map(p => p.id);

        // Add category information to products
        necklaceProducts = necklaceProducts.map(product => ({
          ...product,
          category: 
            bestSellerIds.includes(product.id) ? "Best Seller" :
            newArrivalIds.includes(product.id) ? "New Arrival" : 
            "Regular"
        }));

        setProducts(necklaceProducts);
        setFilteredProducts(necklaceProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const productsPerPage = layout === "grid" ? 12 : 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      
      if (category === "price") {
        if (newFilters[category].includes(value)) {
          newFilters[category] = [];
        } else {
          newFilters[category] = [value];
        }
      } else {
        if (newFilters[category].includes(value)) {
          newFilters[category] = newFilters[category].filter(
            (item) => item !== value
          );
        } else {
          newFilters[category] = [...newFilters[category], value];
        }
      }
      return newFilters;
    });
  };

  const isChecked = (category, value) => {
    return filters[category].includes(value);
  };

  const parsePrice = (p) =>
    p ? parseInt(p.replace(/[^\d]/g, "")) : Number.MAX_SAFE_INTEGER;

  const handleDone = () => {
    setIsPopupOpen(false);

    let filtered = [...products];

    if (filters.material.length > 0) {
      filtered = filtered.filter((product) =>
        filters.material.includes(product.type)
      );
    }

    if (filters.product.length > 0) {
      filtered = filtered.filter((product) =>
        filters.product.includes(product.category)
      );
    }

    if (filters.price.includes("Low to High")) {
      filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (filters.price.includes("High to Low")) {
      filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      material: [],
      product: [],
      price: [],
    });
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] px-6 py-10 font-serif flex items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] px-6 py-10 font-serif flex items-center justify-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] px-6 py-10 font-serif relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-[#ede7de] pb-2">
        <div className="flex gap-2 text-[#403c39]">
          <button
            onClick={() => setLayout("rows")}
            className={cn(
              "p-2 rounded",
              layout === "rows" ? "bg-[#e2dbce]" : "bg-transparent"
            )}
          >
            <Rows2 size={20} />
          </button>
          
          <button
            onClick={() => setLayout("grid")}
            className={cn(
              "p-2 rounded",
              layout === "grid" ? "bg-[#e2dbce]" : "bg-transparent"
            )}
          >
            <LayoutGrid size={20} />
          </button>
        </div>
        <p className="text-sm text-[#b1a696] tracking-wide">
          {filteredProducts.length} Products
        </p>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="text-[#403c39]"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Products Grid */}
      <div
        className={`max-w-6xl mx-auto grid ${
          layout === "grid" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
        } gap-6`}
      >
        {currentProducts.map((product) => (
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
              
              {/* Category Badge */}
              {product.category === "Best Seller" && (
                <div className="absolute top-2 right-2 bg-[#c3a46f] text-white text-xs font-bold px-2 py-1 rounded">
                  BEST SELLER
                </div>
              )}
              {product.category === "New Arrival" && (
                <div className="absolute top-2 right-2 bg-[#c3a46f] text-white text-xs font-bold px-2 py-1 rounded">
                  NEW ARRIVAL
                </div>
              )}
              
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
                      className={cn(
                        "mx-[1px]",
                        i < product.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.rating.toFixed(1)})
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
        ))}
      </div>

      {/* Pagination */}
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

      {/* Filter Popup */}
      {isPopupOpen && (
        <>
          <div 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} className="fixed inset-0 z-40 flex items-center justify-center"
            onClick={() => setIsPopupOpen(false)}
          />
          <div
            className="fixed z-50 bg-white rounded-xl p-6 w-[300px] shadow-lg border border-[#ede7de]"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-serif tracking-wide text-[#403c39]">
                FILTER
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={resetFilters}
                  className="text-sm px-3 py-1 rounded border text-[#403c39] border-[#e2dbce] hover:bg-[#f1ede5]"
                >
                  Reset
                </button>
                <button
                  onClick={handleDone}
                  className="text-sm px-3 py-1 rounded border text-[#403c39] border-[#e2dbce] hover:bg-[#f1ede5]"
                >
                  Done
                </button>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#403c39]">
              <div>
                <h3 className="font-semibold mb-1">Material</h3>
                <div className="flex gap-4">
                  {["GOLD", "SILVER"].map((val) => (
                    <label key={val} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={isChecked("material", val)}
                        onChange={() => toggleFilter("material", val)}
                        className="accent-[#c3a46f]"
                      />
                      {val.charAt(0) + val.slice(1).toLowerCase()}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Product</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Best Seller", "New Arrival"].map((val) => (
                    <label key={val} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={isChecked("product", val)}
                        onChange={() => toggleFilter("product", val)}
                        className="accent-[#c3a46f]"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Price</h3>
                <div className="flex gap-4">
                  {["Low to High", "High to Low"].map((val) => (
                    <label key={val} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="price"
                        checked={isChecked("price", val)}
                        onChange={() => toggleFilter("price", val)}
                        className="accent-[#c3a46f]"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}