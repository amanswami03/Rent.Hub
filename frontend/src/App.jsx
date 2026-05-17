import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, ChevronDown, Star, TrendingUp, Clock, Shield, MessageSquare } from 'lucide-react';
import LocationSelector from './components/LocationSelector';
import AddItemForm from './components/AddItemForm';
import RatingsReviews from './components/RatingsReviews';
import UserAccount from './components/UserAccount';
import RentalRequestModal from './components/RentalRequestModal';
import RequestDashboard from './components/RequestDashboard';

const API_BASE_URL = 'http://localhost:8080/api';

function LoginSignupModal({ isOpen, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    city: '',
    pincode: '',
    latitude: null,
    longitude: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? 'auth/login' : 'auth/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login successful, token stored:', data.token);
      onLogin(data.token, data.user);
      setFormData({ email: '', password: '', name: '', confirmPassword: '', city: '', pincode: '', latitude: null, longitude: null });
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        <div className="text-center mb-8">
          <div className="text-4xl font-bold mb-2">
            <span className="text-blue-500">RentHub</span>
          </div>
          <p className="text-gray-800 font-medium">Welcome to India's largest rental marketplace</p>
        </div>

        <div className="flex mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              isLogin ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              !isLogin ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
                  placeholder="Your city"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
                  placeholder="Your pincode"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-black mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-black mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
                placeholder="Confirm your password"
                required={!isLogin}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-800 text-sm font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-bold ml-1"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token, userData) => {
    setToken(token);
    setUser(userData);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setShowUserAccount(false);
  };

  const handleProtectedAction = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      e.stopPropagation();
      setShowAuthModal(true);
      return false;
    }
  };

  return (
    <>
      <RentHubHomepage isLoggedIn={isLoggedIn} token={token} user={user} onProtectedAction={handleProtectedAction} onLogout={handleLogout} />
      <LoginSignupModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </>
  );
}

function RentHubHomepage({ isLoggedIn, token, user, onProtectedAction, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showRatingsReviews, setShowRatingsReviews] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);
  const [showUserAccount, setShowUserAccount] = useState(false);
  const [showRentalRequestModal, setShowRentalRequestModal] = useState(false);
  const [selectedItemForRental, setSelectedItemForRental] = useState(null);
  const [showRequestDashboard, setShowRequestDashboard] = useState(false);

  useEffect(() => {
    // Show location selector on first visit or if no location selected
    if (!selectedLocation && !localStorage.getItem('userLocation')) {
      setShowLocationSelector(true);
    } else if (localStorage.getItem('userLocation')) {
      const savedLocation = JSON.parse(localStorage.getItem('userLocation'));
      setSelectedLocation(savedLocation);
    }
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchItemsByCity(selectedLocation.city);
    }
  }, [selectedLocation]);

  const fetchItemsByCity = async (city) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/items/city?city=${encodeURIComponent(city)}`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  const handleItemAdded = (newItem) => {
    setItems([newItem, ...items]);
  };

  const handleRatingClick = (itemId) => {
    setSelectedItemForReview(itemId);
    setShowRatingsReviews(true);
  };

  const categories = [
    { name: 'Vehicles - Cars', icon: '🚗' },
    { name: 'Vehicles - Bikes', icon: '🏍️' },
    { name: 'Electronics - Gaming', icon: '🎮' },
    { name: 'Cameras - DSLR', icon: '📷' },
    { name: 'Events - Chairs', icon: '🪑' },
    { name: 'Tools - Power Tools', icon: '🔨' },
    { name: 'Travel - Camping', icon: '🏕️' },
    { name: 'Appliances - Vacuum', icon: '🧹' },
  ];

  const deals = [
    {
      title: 'New Users Get 20% Off',
      subtitle: 'Your First Rental',
      badge: 'NEW',
      color: 'from-black to-gray-800'
    },
    {
      title: 'Weekend Special',
      subtitle: '3 Days for Price of 2',
      badge: 'DEAL',
      color: 'from-gray-600 to-gray-700'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Modals */}
      <LocationSelector 
        isOpen={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onLocationSelect={handleLocationSelect}
      />
      <AddItemForm 
        isOpen={showAddItemForm}
        onClose={() => setShowAddItemForm(false)}
        onItemAdded={handleItemAdded}
      />
      <RatingsReviews 
        itemId={selectedItemForReview}
        isOpen={showRatingsReviews}
        onClose={() => setShowRatingsReviews(false)}
      />
      <UserAccount 
        isOpen={showUserAccount}
        onClose={() => setShowUserAccount(false)}
        token={token}
        user={user}
        onLogout={onLogout}
      />
      <RentalRequestModal 
        isOpen={showRentalRequestModal}
        onClose={() => setShowRentalRequestModal(false)}
        item={selectedItemForRental}
        token={token}
        onRequestSent={() => fetchItemsByCity(selectedLocation.city)}
      />
      <RequestDashboard
        isOpen={showRequestDashboard}
        onClose={() => setShowRequestDashboard(false)}
        token={token}
      />

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-blue-500">
                RentHub
              </div>

              {/* Location Display */}
              {selectedLocation && (
                <button
                  onClick={() => setShowLocationSelector(true)}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-black hover:bg-gray-800 rounded-lg transition text-white ml-8"
                >
                  <span>📍 {selectedLocation.city}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for items to rent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-black border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder-gray-300 font-semibold"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition text-white">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => {
                  if (!isLoggedIn) onProtectedAction({ preventDefault: () => {}, stopPropagation: () => {} });
                  else setShowAddItemForm(true);
                }}
                className="hidden md:flex items-center space-x-2 hover:text-gray-300 transition text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-lg"
              >
                <span className="font-semibold">+ List Item</span>
              </button>
              <button onClick={onProtectedAction} className="hidden md:flex items-center space-x-2 hover:text-gray-600 transition text-black">
                <Heart className="w-6 h-6" />
              </button>
              <button 
                onClick={() => {
                  if (!isLoggedIn) onProtectedAction({ preventDefault: () => {}, stopPropagation: () => {} });
                  else setShowUserAccount(true);
                }}
                className="hidden md:flex items-center space-x-2 hover:text-gray-600 transition text-black"
              >
                <User className="w-6 h-6" />
              </button>
              {isLoggedIn && (
                <button 
                  onClick={() => setShowRequestDashboard(true)}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-black hover:bg-gray-800 rounded-lg text-sm font-semibold transition text-white relative"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Requests</span>
                </button>
              )}
              {isLoggedIn && (
                <button onClick={onLogout} className="hidden md:block px-4 py-2 bg-black hover:bg-gray-800 rounded-lg text-sm font-semibold transition text-white">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-black/20 text-black rounded-full text-sm font-semibold mb-6">
                SMART RENTING SOLUTION
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Rent Anything<br />
                <span className="text-black">Save Everything</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Join India's largest peer-to-peer rental marketplace. Access thousands of items from your neighbors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onProtectedAction} className="px-8 py-4 bg-black hover:bg-gray-800 rounded-lg transition font-semibold text-lg text-white">
                  Start Renting
                </button>
                <button 
                  onClick={() => {
                    if (!isLoggedIn) onProtectedAction({ preventDefault: () => {}, stopPropagation: () => {} });
                    else setShowAddItemForm(true);
                  }}
                  className="px-8 py-4 bg-black hover:bg-gray-800 rounded-lg transition font-semibold text-lg text-white border-2 border-white"
                >
                  List Your Items
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Available in {selectedLocation?.city || 'Your Area'}</h2>
              <p className="text-gray-600">Items available for rent near you</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading items...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No items available in {selectedLocation?.city}. Be the first to list an item!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.filter(item => item.available !== false && (!isLoggedIn || item.owner_id !== user?.id)).map((item) => (
                <div key={item.id} className="bg-gray-200 rounded-xl overflow-hidden hover:ring-2 hover:ring-black transition group relative">
                  <div className="aspect-square bg-white flex items-center justify-center text-7xl relative overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>
                  <button onClick={onProtectedAction} className="absolute top-2 right-2 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white shadow-md z-10">
                    <Heart className="w-5 h-5 fill-white" />
                  </button>
                  <div className="p-4">
                    <div className="text-xs text-gray-600 mb-1">{item.category}</div>
                    <h3 className="font-semibold mb-2 group-hover:text-black transition">{item.name}</h3>
                    <div className="flex items-center mb-3 text-sm cursor-pointer hover:text-black text-gray-800" onClick={() => handleRatingClick(item.id)}>
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
                      <span className="font-semibold">{item.rating ? item.rating.toFixed(1) : 'New'}</span>
                      <span className="text-gray-600 ml-1">({item.reviews || 0})</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-black">₹{item.price}</div>
                        <div className="text-xs text-gray-600">{item.period || '/day'}</div>
                      </div>
                      <button 
                        onClick={() => {
                          if (!isLoggedIn) {
                            onProtectedAction({ preventDefault: () => {}, stopPropagation: () => {} });
                          } else {
                            setSelectedItemForRental(item);
                            setShowRentalRequestModal(true);
                          }
                        }}
                        className="px-4 py-2 bg-black hover:bg-gray-800 rounded-lg text-sm font-semibold transition text-white"
                      >
                        Rent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="w-8 h-8" />, title: 'Secure Payment', text: 'Protected transactions' },
              { icon: <TrendingUp className="w-8 h-8" />, title: 'Best Prices', text: 'Competitive rates' },
              { icon: <Clock className="w-8 h-8" />, title: 'Quick Delivery', text: 'Same day pickup' },
              { icon: <Star className="w-8 h-8" />, title: 'Top Quality', text: 'Verified items' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; 2026 RentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
