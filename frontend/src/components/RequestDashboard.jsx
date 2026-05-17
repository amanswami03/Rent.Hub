import React, { useState, useEffect } from 'react';
import { X, MessageCircle, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import MessagingUI from './MessagingUI';

const API_BASE_URL = 'https://rent-hub-1r5o.onrender.com/api';

function RequestDashboard({ isOpen, onClose, token }) {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMessaging, setShowMessaging] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
      const interval = setInterval(fetchRequests, 3000); // Refresh every 3 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [incomingRes, outgoingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/rentals/requests/incoming`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/rentals/requests/outgoing`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const incomingData = await incomingRes.json();
      const outgoingData = await outgoingRes.json();

      setIncomingRequests(Array.isArray(incomingData) ? incomingData : []);
      setOutgoingRequests(Array.isArray(outgoingData) ? outgoingData : []);
      setError('');
    } catch (err) {
      setError('Failed to load requests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    setActionLoading(requestId);
    try {
      const response = await fetch(`${API_BASE_URL}/rentals/requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setIncomingRequests(incomingRequests.map(req =>
          req.id === requestId ? { ...req, status: 'approved' } : req
        ));
      } else {
        setError('Failed to approve request');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setActionLoading(requestId);
    try {
      const response = await fetch(`${API_BASE_URL}/rentals/requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setIncomingRequests(incomingRequests.map(req =>
          req.id === requestId ? { ...req, status: 'rejected' } : req
        ));
      } else {
        setError('Failed to reject request');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const pendingIncoming = incomingRequests.filter(r => r.status === 'pending').length;
  const pendingOutgoing = outgoingRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Rental Requests</h2>
          <p className="text-gray-600">Manage incoming and outgoing rental requests, and communicate with renters and owners</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-3 font-semibold transition flex items-center gap-2 ${
              activeTab === 'incoming'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Requests to Me
            {pendingIncoming > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingIncoming}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-4 py-3 font-semibold transition flex items-center gap-2 ${
              activeTab === 'outgoing'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            My Requests
            {pendingOutgoing > 0 && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingOutgoing}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="min-h-96">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-black mr-3" />
              <p className="text-gray-600">Loading requests...</p>
            </div>
          )}

          {!loading && activeTab === 'incoming' && (
            <div>
              {incomingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No rental requests yet</p>
                  <p className="text-gray-500 text-sm mt-1">When someone requests to rent your items, they'll appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map(request => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-xl p-6 hover:border-black transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-black">
                              {request.renter_name} wants to rent{' '}
                              <span className="text-blue-600">{request.item_name}</span>
                            </h3>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Dates:</span> {new Date(request.start_date).toLocaleDateString()} to{' '}
                            {new Date(request.end_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">Duration:</span> {Math.ceil((new Date(request.end_date) - new Date(request.start_date)) / (1000 * 60 * 60 * 24))} days × ₹{request.total_cost ? (request.total_cost / Math.ceil((new Date(request.end_date) - new Date(request.start_date)) / (1000 * 60 * 60 * 24))).toFixed(0) : 0}/day
                          </p>
                        </div>
                      </div>

                      {request.message && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Message from {request.renter_name}:</span>
                          </p>
                          <p className="text-gray-700 mt-1">{request.message}</p>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            setSelectedMessage({
                              id: request.id,
                              otherUserName: request.renter_name,
                              itemName: request.item_name
                            });
                            setShowMessaging(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition"
                        >
                          <MessageCircle size={16} />
                          Chat
                        </button>

                        {request.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              disabled={actionLoading === request.id}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-semibold transition"
                            >
                              {actionLoading === request.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              disabled={actionLoading === request.id}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-semibold transition"
                            >
                              {actionLoading === request.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <XCircle size={16} />
                              )}
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                            request.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {request.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === 'outgoing' && (
            <div>
              {outgoingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">You haven't sent any requests yet</p>
                  <p className="text-gray-500 text-sm mt-1">Browse items and send requests to rent from other users</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {outgoingRequests.map(request => (
                    <div
                      key={request.id}
                      className={`border rounded-xl p-6 hover:border-black transition ${
                        request.status === 'approved' ? 'border-green-300 bg-green-50' : 
                        request.status === 'rejected' ? 'border-red-300 bg-red-50' :
                        'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-black">
                              Requesting <span className="text-blue-600">{request.item_name}</span>
                            </h3>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">From:</span> {request.owner_name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">Dates:</span> {new Date(request.start_date).toLocaleDateString()} to{' '}
                            {new Date(request.end_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Estimated Cost:</span> ₹{request.total_cost ? request.total_cost.toFixed(0) : 'TBD'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            setSelectedMessage({
                              id: request.id,
                              otherUserName: request.owner_name,
                              itemName: request.item_name
                            });
                            setShowMessaging(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition"
                        >
                          <MessageCircle size={16} />
                          Chat
                        </button>

                        {request.status === 'pending' && (
                          <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-700">
                            Waiting for {request.owner_name}'s response...
                          </span>
                        )}
                        {request.status === 'approved' && (
                          <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-100 text-green-700">
                            ✓ Approved! Ready to rent
                          </span>
                        )}
                        {request.status === 'rejected' && (
                          <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700">
                            ✗ Request declined
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showMessaging && selectedMessage && (
        <MessagingUI
          rentalRequestId={selectedMessage.id}
          otherUserName={selectedMessage.otherUserName}
          itemName={selectedMessage.itemName}
          onClose={() => {
            setShowMessaging(false);
            setSelectedMessage(null);
          }}
          token={token}
        />
      )}
    </div>
  );
}

export default RequestDashboard;
