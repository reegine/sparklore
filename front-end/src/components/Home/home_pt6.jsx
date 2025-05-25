import React, { useState, useEffect } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { BASE_URL, fetchProduct } from "../../utils/api.js";

const Reviews = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showRatingBreakdown, setShowRatingBreakdown] = useState(false);

  // Calculate rating statistics
  const calculateRatingStats = () => {
    const stats = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
      total: allReviews.length,
      average: 0
    };

    if (stats.total === 0) return stats;

    // Count each rating
    allReviews.forEach(review => {
      stats[review.rating]++;
    });

    // Calculate average
    const sum = allReviews.reduce((acc, review) => acc + review.rating, 0);
    stats.average = (sum / stats.total).toFixed(1);

    return stats;
  };

  const ratingStats = calculateRatingStats();

  // Fetch reviews and product details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reviews
        const reviewsResponse = await fetch(`${BASE_URL}/api/reviews/`);
        if (!reviewsResponse.ok) throw new Error("Failed to fetch reviews");
        const reviewsData = await reviewsResponse.json();
        
        // Fetch product details for each review
        const productIds = new Set();
        reviewsData.forEach(review => {
          review.products.forEach(productId => productIds.add(productId));
        });
        
        const productDetailsMap = {};
        for (const productId of productIds) {
          try {
            const product = await fetchProduct(productId);
            productDetailsMap[productId] = {
              name: product.name,
              type: product.label.toUpperCase(),
              image: product.image
            };
          } catch (err) {
            console.error(`Error fetching product ${productId}:`, err);
            productDetailsMap[productId] = {
              name: "Unknown Product",
              type: "UNKNOWN",
              image: ""
            };
          }
        }
        
        setProductDetails(productDetailsMap);
        setAllReviews(reviewsData);
        // Initially show only 6 reviews or all if less than 6
        setDisplayedReviews(reviewsData.slice(0, 6));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle show more/less reviews
  useEffect(() => {
    if (showAllReviews) {
      setDisplayedReviews(allReviews);
    } else {
      setDisplayedReviews(allReviews.slice(0, 6));
    }
  }, [showAllReviews, allReviews]);

  // Format date from API to match static UI
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-[#F9F5EE] py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F9F5EE] py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F5EE] py-16 px-4">
      {/* Section Title & Rating Summary */}
      <div className="max-w-6xl mx-auto text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">WHAT THEY SAY</h2>
        <div className="flex items-center justify-start mt-4">
          <div className="flex items-center">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.floor(ratingStats.average) ? "currentColor" : "none"}
                  className={i < Math.floor(ratingStats.average) ? "text-yellow-500" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-800 text-lg font-medium justify-start">
              {ratingStats.average} ({ratingStats.total} Reviews)
            </span>
            <button 
              onClick={() => setShowRatingBreakdown(!showRatingBreakdown)}
              className="ml-2 text-gray-800 justify-start"
            >
              {showRatingBreakdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Rating Breakdown - Only shown when dropdown is clicked */}
        {showRatingBreakdown && (
          <div className="max-w-full mx-auto mt-6 bg-[#fdfbf7] p-6 rounded-xl shadow-md">
            <div className="flex justify-start items-center mb-6">
              <Star className="text-yellow-400" size={40} fill="currentColor" />
              <span className="text-4xl font-bold text-gray-900 ml-2">{ratingStats.average}</span>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingStats[stars];
                const percent = ratingStats.total ? (count / ratingStats.total) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < stars ? "text-yellow-400" : "text-gray-300"}
                          fill={i < stars ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gray-900 h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-right text-sm text-gray-700">({count})</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Masonry Grid */}
      <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-[#faf7f0] p-4 rounded-xl shadow-lg break-inside-avoid mb-6"
          >
            {/* Review Image */}
            <img
              src={review.image}
              alt={review.user_name}
              className="w-full object-cover rounded-md"
            />

            {/* Review Content */}
            <div className="mt-4 px-2">
              <h3 className="font-semibold text-lg text-gray-900">{review.user_name}</h3>
              <p className="text-gray-500 text-sm">{formatDate(review.uploaded_at)}</p>
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < review.rating ? "currentColor" : "none"}
                    className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-gray-700 mt-2">{review.review_text}</p>

              {/* Purchased Products */}
              <div className="mt-4 border-t border-gray-300 pt-3">
                {review.products.map((productId, idx) => {
                  const product = productDetails[productId] || {
                    name: "Unknown Product",
                    type: "UNKNOWN",
                    image: ""
                  };
                  
                  return (
                    <div key={`${review.id}-${productId}-${idx}`} className="flex items-start gap-3 mt-2">
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
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button - Only show if there are more than 6 reviews */}
      {allReviews.length > 6 && (
        <div className="text-center mt-8">
          <button 
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="px-6 py-2 border border-gray-900 text-gray-900 rounded-md hover:bg-gray-900 hover:text-white transition"
          >
            {showAllReviews ? "Show Less Reviews" : "Show More Reviews"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;