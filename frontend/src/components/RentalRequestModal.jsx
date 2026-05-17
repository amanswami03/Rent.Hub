import React, { useState } from 'react';
import { X, AlertCircle, Calendar } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

function RentalRequestModal({ isOpen, onClose, item, token, onRequestSent }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/rentals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          item_id: item.id,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          message: message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send rental request');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        if (onRequestSent) onRequestSent();
        onClose();
      }, 2000);
    } catch (err) {
      setError('Error: ' + err.message);
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  const days = startDate && endDate 
    ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : 0;
  
  const totalCost = days * item.price;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Rent {item.name}</h2>
        <p className="text-gray-600 mb-6">Send a rental request to the owner</p>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-semibold">✓ Rental request sent successfully!</p>
            <p className="text-green-600 text-sm mt-1">The owner will review your request shortly.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Price</p>
            <p className="text-2xl font-bold text-black">₹{item.price} <span className="text-lg">{item.period}</span></p>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>
          </div>

          {/* Duration and Cost */}
          {days > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Duration: {days} day{days > 1 ? 's' : ''}</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">Total: ₹{totalCost}</p>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Message to Owner</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the owner about your rental needs..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !startDate || !endDate}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Sending Request...' : 'Send Rental Request'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            The owner will review your request and contact you within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}

export default RentalRequestModal;
