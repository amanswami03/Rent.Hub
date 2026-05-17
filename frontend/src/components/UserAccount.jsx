import React, { useState, useEffect } from 'react';
import { X, LogOut, AlertCircle, MessageCircle } from 'lucide-react';
import MessagingUI from './MessagingUI';

const API_BASE_URL = 'http://localhost:8080/api';

function UserAccount({ isOpen, onClose, token, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [myItems, setMyItems] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMessaging, setShowMessaging] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (isOpen && token) {
      fetchUserData();
    }
  }, [isOpen, activeTab, token]);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');

    try {
      if (activeTab === 'profile') {
        // Already have user data
        setLoading(false);
      } else if (activeTab === 'my-items') {
        const response = await fetch(`${API_BASE_URL}/user/my-items`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setMyItems(Array.isArray(data) ? data : []);
      } else if (activeTab === 'incoming') {
        const response = await fetch(`${API_BASE_URL}/rentals/requests/incoming`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setIncomingRequests(Array.isArray(data) ? data : []);
      } else if (activeTab === 'outgoing') {
        const response = await fetch(`${API_BASE_URL}/rentals/requests/outgoing`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setOutgoingRequests(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
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
    }
  };

  const handleRejectRequest = async (requestId) => {
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
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto pt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Account</h2>
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === 'profile'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('my-items')}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === 'my-items'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            My Items
          </button>
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === 'incoming'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Rental Requests
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === 'outgoing'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            My Requests
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {loading && <p className="text-center text-gray-600 py-8">Loading...</p>}

          {activeTab === 'profile' && !loading && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Name</label>
                <p className="text-lg text-black">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Email</label>
                <p className="text-lg text-black">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">City</label>
                <p className="text-lg text-black">{user?.city || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Pincode</label>
                <p className="text-lg text-black">{user?.pincode || 'Not set'}</p>
              </div>
            </div>
          )}

          {activeTab === 'my-items' && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myItems.length === 0 ? (
                <p className="text-gray-600 col-span-2">You haven't listed any items yet</p>
              ) : (
                myItems.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-black mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                    <p className="text-black font-bold">₹{item.price} {item.period}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Status: {item.available ? 'Available' : 'Rented Out'}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'incoming' && !loading && (
            <div className="space-y-4">
              {incomingRequests.length === 0 ? (
                <p className="text-gray-600">No rental requests</p>
              ) : (
                incomingRequests.map(request => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-black">
                      {request.renter_name} wants to rent: {request.item_name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      From: {new Date(request.start_date).toLocaleDateString()} To: {new Date(request.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">{request.message}</p>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedMessage({
                            id: request.id,
                            otherUserName: request.renter_name,
                            itemName: request.item_name
                          });
                          setShowMessaging(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold"
                      >
                        <MessageCircle size={16} />
                        Message
                      </button>
                      {request.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApproveRequest(request.id)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
                          request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'outgoing' && !loading && (
            <div className="space-y-4">
              {outgoingRequests.length === 0 ? (
                <p className="text-gray-600">You haven't sent any rental requests</p>
              ) : (
                outgoingRequests.map(request => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-black">{request.item_name}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      From: {request.owner_name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Requested from: {new Date(request.start_date).toLocaleDateString()} to {new Date(request.end_date).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-4 flex-wrap items-center">
                      <button
                        onClick={() => {
                          setSelectedMessage({
                            id: request.id,
                            otherUserName: request.owner_name,
                            itemName: request.item_name
                          });
                          setShowMessaging(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold"
                      >
                        <MessageCircle size={16} />
                        Message
                      </button>
                      <span className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
                        request.status === 'pending' ? 'bg-yellow-500' :
                        request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
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

export default UserAccount;
