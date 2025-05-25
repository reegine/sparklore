import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, Plus } from "lucide-react";
import { BASE_URL, fetchAllCharms } from "../../utils/api.js";

export default function SearchProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allCharms, setAllCharms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products and charms from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch(`${BASE_URL}/api/products/`);
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();
        
        // Transform products data
        const transformedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          type: product.label.toUpperCase(),
          price: `Rp ${parseFloat(product.price).toLocaleString('id-ID')}`,
          originalPrice: null,
          rating: parseFloat(product.rating) || 0,
          image: product.image,
          stock: product.stock,
          soldStock: product.sold_stok || 0,
          category: product.category,
          createdAt: product.created_at,
          itemType: 'product' // Add item type identifier
        }));

        // Fetch charms
        const charmsData = await fetchAllCharms();
        
        // Transform charms data
        const transformedCharms = charmsData.map(charm => {
          const originalPrice = parseFloat(charm.price);
          const discountPercentage = parseFloat(charm.discount || 0) / 100;
          const discountedPrice = originalPrice - (originalPrice * discountPercentage);
          const hasDiscount = charm.discount > 0;
          
          return {
            id: charm.id,
            name: charm.name,
            type: charm.category.toUpperCase(),
            price: hasDiscount 
              ? `Rp ${discountedPrice.toLocaleString('id-ID')}`
              : `Rp ${originalPrice.toLocaleString('id-ID')}`,
            originalPrice: hasDiscount 
              ? `Rp ${originalPrice.toLocaleString('id-ID')}`
              : null,
            discount: parseFloat(charm.discount || 0),
            rating: Math.round(charm.rating),
            image: charm.image,
            category: charm.category,
            stock: charm.stock,
            itemType: 'charm' // Add item type identifier
          };
        });

        setAllProducts(transformedProducts);
        setAllCharms(transformedCharms);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search when query changes or data is loaded
  useEffect(() => {
    if (allProducts.length === 0 && allCharms.length === 0) return;

    // Parse search query from URL
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';
    setSearchQuery(query);

    // Combine products and charms for searching
    const allItems = [...allProducts, ...allCharms];

    // Filter items based on search query
    if (query) {
      const filtered = allItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(allItems);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [location.search, allProducts, allCharms]);

  const handleProductClick = (itemId, itemType) => {
    navigate(`/${itemType}s/${itemId}`);
  };

  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredItems.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + productsPerPage
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] px-6 py-10 font-serif flex items-center justify-center">
        <p>Loading items...</p>
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
      <div className="text-center px-4 text-[#302E2A] mb-8">
        <h1 className="text-xl md:text-4xl mb-4 tracking-wider">
          Search Results
        </h1>
        <p className="text-md md:text-2xl leading-relaxed">
          {filteredItems.length} results for "{searchQuery}"
        </p>
      </div>

      {/* Items Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div
              key={`${item.itemType}-${item.id}`} className={`p-2 rounded-lg hover:shadow-md transition duration-200 relative ${item.stock === 0 ? 'opacity-70' : 'cursor-pointer'}`} onClick={() => item.stock > 0 && handleProductClick(item.id, item.itemType)}
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className={`rounded-md w-full h-auto object-cover ${item.stock === 0 ? 'grayscale' : ''}`}
                />
                
                {/* Discount badge (for charms) */}
                {item.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-[#b87777] text-white text-xs font-bold px-2 py-1 rounded">
                    {item.discount}% OFF
                  </div>
                )}
                
                {/* Stock Status Badge */}
                {item.stock === 0 ? (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    SOLD OUT
                  </div>
                ) : item.stock < 10 ? (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                    LOW STOCK
                  </div>
                ) : null}
                
                {/* Best Seller Badge (for products) */}
                {item.soldStock > 0 && (
                  <div className="absolute top-2 right-2 bg-[#c3a46f] text-white text-xs font-bold px-2 py-1 rounded">
                    BEST SELLER
                  </div>
                )}
                
                {/* Only show add to cart button if item is in stock */}
                {item.stock > 0 && (
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
                  {item.name}
                </p>
                <p className="text-[10px] mt-1">
                  <span className="px-2 py-[2px] text-[#c3a46f] bg-[#f1ede5] border border-[#c3a46f] rounded-sm">
                    {item.type}
                  </span>
                </p>
                <div className="flex justify-center mt-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < item.rating ? "text-yellow-500" : "text-gray-300"}
                      />
                    ))}
                  <span className="text-xs text-gray-500 ml-1">
                    ({item.rating.toFixed(1)})
                  </span>
                </div>
                <div className="mt-1">
                  <p className="text-sm font-medium text-[#403c39]">
                    {item.price}
                  </p>
                  {item.originalPrice && (
                    <p className="text-xs text-gray-400 line-through">
                      {item.originalPrice}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-600">
              {searchQuery ? 
                "No items found matching your search." : 
                "No items available."
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination - Only show if there are results */}
      {filteredItems.length > 0 && (
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