import React, { useState, useEffect } from 'react';
import { Star, X, AlertCircle } from 'lucide-react';

function RatingsReviews({ itemId, isOpen, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setUserToken(token);
    if (isOpen && itemId) {
      fetchReviews();
    }
  }, [isOpen, itemId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://rent-hub-1r5o.onrender.com/api/items/${itemId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!userToken) {
      setError('Please login to submit a review');
      setSubmitting(false);
      return;
    }

    if (formData.comment.trim() === '') {
      setError('Please enter a comment');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`https://rent-hub-1r5o.onrender.com/api/items/${itemId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          rating: formData.rating,
          comment: formData.comment
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit review');
        setSubmitting(false);
        return;
      }

      // Add new review to the list
      setReviews([data, ...reviews]);
      setFormData({ rating: 5, comment: '' });
      setShowForm(false);
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (!isOpen) return null;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-black">Ratings & Reviews</h2>
            <p className="text-gray-600 mt-1">See what others think about this item</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <span className="text-4xl font-bold text-black">{avgRating}</span>
              <div className="flex gap-1">
                {renderStars(Math.round(avgRating))}
              </div>
            </div>
            <p className="text-sm text-gray-600">{reviews.length} reviews</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Write Review Section */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            disabled={!userToken}
            className="w-full mb-6 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
          >
            {userToken ? 'Write a Review' : 'Login to Write a Review'}
          </button>
        ) : (
          <form onSubmit={handleSubmitReview} className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-black mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="p-1"
                  >
                    <Star
                      size={28}
                      className={
                        star <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400 cursor-pointer'
                          : 'text-gray-300 cursor-pointer hover:text-yellow-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-black mb-2">Your Review</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this item..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ rating: 5, comment: '' });
                  setError('');
                }}
                className="flex-1 border border-black hover:bg-gray-100 text-black py-2 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{review.user_name}</p>
                    <div className="flex gap-1 mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RatingsReviews;
