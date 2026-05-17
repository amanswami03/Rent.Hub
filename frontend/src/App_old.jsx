import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, ChevronDown, Star, TrendingUp, Clock, Shield } from 'lucide-react';

const API_BASE_URL = 'https://rent-hub-1r5o.onrender.com/api';

function LoginSignupModal({ isOpen, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
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
      onLogin(data.token, data.user);
      setFormData({ email: '', password: '', name: '', confirmPassword: '' });
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        <div className="text-center mb-8">
          <div className="text-4xl font-bold mb-2">
            <span className="text-black">rent</span><span className="text-blue-500">.hub</span>
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
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
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

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/items`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    // Vehicles
    { name: 'Vehicles - Cars', icon: '🚗' },
    { name: 'Vehicles - Bikes', icon: '🏍️' },
    { name: 'Vehicles - Bicycles', icon: '🚲' },
    // Electronics & Entertainment
    { name: 'Electronics - Gaming', icon: '🎮' },
    { name: 'Electronics - VR', icon: '🥽' },
    { name: 'Electronics - Laptops', icon: '💻' },
    { name: 'Electronics - Monitors', icon: '🖥️' },
    { name: 'Electronics - Projectors', icon: '📽️' },
    { name: 'Electronics - Speakers', icon: '🔊' },
    // Cameras & Gear
    { name: 'Cameras - DSLR', icon: '📷' },
    { name: 'Cameras - Lenses', icon: '📸' },
    { name: 'Cameras - Drones', icon: '🚁' },
    { name: 'Cameras - Action', icon: '🎥' },
    { name: 'Cameras - Accessories', icon: '🎬' },
    { name: 'Cameras - Gimbals', icon: '⚙️' },
    // Events & Party
    { name: 'Events - Chairs', icon: '🪑' },
    { name: 'Events - Tents', icon: '⛺' },
    { name: 'Events - Lighting', icon: '💡' },
    { name: 'Events - Sound', icon: '🎤' },
    { name: 'Events - Decor', icon: '🎨' },
    // Tools & Equipment
    { name: 'Tools - Power Tools', icon: '🔨' },
    { name: 'Tools - Hand Tools', icon: '🔧' },
    { name: 'Tools - Construction', icon: '🏗️' },
    { name: 'Tools - Gardening', icon: '🌱' },
    { name: 'Tools - Ladders', icon: '🪜' },
    // Travel & Adventure
    { name: 'Travel - Camping', icon: '🏕️' },
    { name: 'Travel - Trekking', icon: '⛰️' },
    { name: 'Travel - Luggage', icon: '🧳' },
    { name: 'Travel - GoPro', icon: '📹' },
    { name: 'Travel - Coolers', icon: '🧊' },
    // Home Appliances
    { name: 'Appliances - Vacuum', icon: '🧹' },
    { name: 'Appliances - AC', icon: '❄️' },
    { name: 'Appliances - Washing', icon: '🧺' },
    { name: 'Appliances - Water', icon: '💧' },
    { name: 'Appliances - Kitchen', icon: '🍳' },
    // Baby & Kids
    { name: 'Baby - Strollers', icon: '👶' },
    { name: 'Baby - Car Seats', icon: '🚗' },
    { name: 'Baby - Toys', icon: '🧸' },
    { name: 'Baby - Furniture', icon: '🛏️' },
    // Office & Study
    { name: 'Office - Laptops', icon: '💼' },
    { name: 'Office - Desks', icon: '📚' },
    { name: 'Office - Whiteboards', icon: '✏️' },
    { name: 'Office - Connectivity', icon: '📡' },
    { name: 'Office - Chairs', icon: '🪑' }
  ];

  const featuredItems = [
    {
      image: '📷',
      name: 'Canon EOS R5',
      category: 'Cameras',
      price: '₹2,500',
      period: '/day',
      rating: 4.8,
      reviews: 124,
      owner: 'Rajesh K.'
    },
    {
      image: '🔧',
      name: 'Bosch Power Drill Kit',
      category: 'Tools',
      price: '₹500',
      period: '/day',
      rating: 4.9,
      reviews: 89,
      owner: 'Amit S.'
    },
    {
      image: '🚴',
      name: 'Mountain Bike',
      category: 'Sports',
      price: '₹800',
      period: '/day',
      rating: 4.7,
      reviews: 56,
      owner: 'Priya M.'
    },
    {
      image: '🎮',
      name: 'PlayStation 5',
      category: 'Gaming',
      price: '₹1,200',
      period: '/day',
      rating: 5.0,
      reviews: 203,
      owner: 'Karan V.'
    },
    {
      image: '📽️',
      name: 'HD Projector',
      category: 'Electronics',
      price: '₹1,500',
      period: '/day',
      rating: 4.6,
      reviews: 78,
      owner: 'Sneha R.'
    },
    {
      image: '⛺',
      name: 'Camping Tent (4 Person)',
      category: 'Outdoors',
      price: '₹600',
      period: '/day',
      rating: 4.8,
      reviews: 92,
      owner: 'Vikram P.'
    },
    {
      image: '🎸',
      name: 'Electric Guitar',
      category: 'Music',
      price: '₹900',
      period: '/day',
      rating: 4.9,
      reviews: 67,
      owner: 'Arjun T.'
    },
    {
      image: '💍',
      name: 'DSLR + Lens Bundle',
      category: 'Photography',
      price: '₹3,000',
      period: '/day',
      rating: 5.0,
      reviews: 145,
      owner: 'Meera J.'
    }
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

  // Group categories by main type
  const categoryGroups = {
    'Vehicles': categories.filter(c => c.name.startsWith('Vehicles')),
    'Electronics': categories.filter(c => c.name.startsWith('Electronics')),
    'Cameras': categories.filter(c => c.name.startsWith('Cameras')),
    'Events': categories.filter(c => c.name.startsWith('Events')),
    'Tools': categories.filter(c => c.name.startsWith('Tools')),
    'Travel': categories.filter(c => c.name.startsWith('Travel')),
    'Appliances': categories.filter(c => c.name.startsWith('Appliances')),
    'Baby': categories.filter(c => c.name.startsWith('Baby')),
    'Office': categories.filter(c => c.name.startsWith('Office'))
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Categories Modal */}
      {showCategoriesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh]">
            <button
              onClick={() => setShowCategoriesModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl"
            >
              ×
            </button>

            <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
              <h2 className="text-3xl font-bold mb-8 sticky top-0 bg-white pb-4">All Categories</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categoryGroups).map(([groupName, groupItems]) => (
                  <div key={groupName} className="border border-gray-300 rounded-lg p-4 bg-white">
                    <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-blue-500">{groupName}</h3>
                    <div className="space-y-2">
                      {groupItems.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => {
                            setSelectedCategory(cat.name);
                            setShowCategoriesModal(false);
                          }}
                          className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-white hover:text-white font-medium"
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.name.split(' - ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Nav */}
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-12">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold">
                  rent<span className="text-blue-500">.hub</span>
                </div>
              </div>

              {/* Categories Dropdown */}
              <button onClick={() => setShowCategoriesModal(true)} className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-white">
                <Menu className="w-5 h-5" />
                <span className="text-white font-semibold">All Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for items to rent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400 font-semibold"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black hover:bg-gray-800 rounded-md transition text-white">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button onClick={onProtectedAction} className="hidden md:flex items-center space-x-2 hover:text-gray-400 transition text-white">
                <Heart className="w-6 h-6" />
                <span className="text-sm font-semibold">Wishlist</span>
              </button>
              <button onClick={onProtectedAction} className="hidden md:flex items-center space-x-2 hover:text-gray-400 transition text-white">
                <User className="w-6 h-6" />
                <span className="text-sm font-semibold">Account</span>
              </button>
              <button className="relative hover:text-gray-400 transition text-white">
                <i className="fa-solid fa-cart-shopping text-lg"></i>
                <span className="absolute -top-2 -right-2 bg-black text-xs w-5 h-5 rounded-full flex items-center justify-center text-white">
                  0
                </span>
              </button>
              {isLoggedIn && (
                <button onClick={onLogout} className="hidden md:block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition text-white">
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Categories Bar */}
          <div className="hidden lg:flex space-x-8 py-4 border-t border-gray-200 text-sm overflow-x-auto">
            {categories.slice(0, 8).map((cat) => (
              <a key={cat.name} href="#" className="text-black hover:text-gray-700 transition whitespace-nowrap font-semibold no-underline flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{cat.name.split(' - ')[1]}</span>
              </a>
            ))}
            <a href="#" className="text-black hover:text-gray-700 transition font-semibold no-underline">
              View All →
            </a>
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
                <button onClick={onProtectedAction} className="px-8 py-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-semibold text-lg text-white">
                  List Your Items
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-black/20 to-gray-600/20 rounded-3xl p-8 backdrop-blur">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-200 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-sm text-gray-600">Cameras</div>
                  </div>
                  <div className="bg-gray-200 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-2">🔧</div>
                    <div className="text-sm text-gray-600">Tools</div>
                  </div>
                  <div className="bg-gray-200 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-2">🚴</div>
                    <div className="text-sm text-gray-600">Sports</div>
                  </div>
                  <div className="bg-gray-200 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-2">🎮</div>
                    <div className="text-sm text-gray-600">Gaming</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-8 bg-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {deals.map((deal, idx) => (
              <div key={idx} className={`bg-gradient-to-r ${deal.color} rounded-xl p-8 relative overflow-hidden`}>
                <div className="absolute top-4 right-4 bg-black/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white">
                  {deal.badge}
                </div>
                <h3 className="text-3xl font-bold mb-2 text-white">{deal.title}</h3>
                <p className="text-xl text-white mb-6">{deal.subtitle}</p>
                <button onClick={onProtectedAction} className="px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-lg font-semibold transition">
                  Shop Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending Rentals</h2>
              <p className="text-gray-600">Most popular items this week</p>
            </div>
            <button className="text-white hover:text-gray-400 transition font-semibold bg-black px-4 py-2 rounded-lg">
              View All →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading items...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No items available yet. Be the first to list an item!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-200 rounded-xl overflow-hidden hover:ring-2 hover:ring-black transition group">
                  <div className="aspect-square bg-white flex items-center justify-center text-7xl relative">
                    {item.image || '📦'}
                    <button onClick={onProtectedAction} className="absolute top-3 right-3 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-600 mb-1">{item.category}</div>
                    <h3 className="font-semibold mb-2 group-hover:text-black transition">{item.name}</h3>
                    <div className="flex items-center mb-3 text-sm">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
                      <span className="font-semibold">{item.rating || 0}</span>
                      <span className="text-gray-600 ml-1">({item.reviews || 0})</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-black">₹{item.price}</div>
                        <div className="text-xs text-gray-600">{item.period || '/day'}</div>
                      </div>
                      <button onClick={onProtectedAction} className="px-4 py-2 bg-black hover:bg-gray-800 rounded-lg text-sm font-semibold transition text-white">
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

      {/* Newsletter */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-black">Subscribe to Our Newsletter</h2>
            <p className="text-gray-800 mb-8 max-w-2xl mx-auto">
              Get exclusive deals, rental tips, and new item alerts delivered to your inbox
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-600"
              />
              <button className="px-8 py-3 bg-black hover:bg-gray-800 rounded-lg font-semibold transition text-white">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold mb-4">
                rent<span className="text-black">.hub</span>
              </div>
              <p className="text-gray-600 mb-4">
                India's most trusted peer-to-peer rental marketplace for everything you need.
              </p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                  <button key={social} className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition text-black">
                    {social[0]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-black transition">About Us</a></li>
                <li><a href="#" className="hover:text-black transition">How It Works</a></li>
                <li><a href="#" className="hover:text-black transition">Pricing</a></li>
                <li><a href="#" className="hover:text-black transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-black transition">Help Center</a></li>
                <li><a href="#" className="hover:text-black transition">Safety</a></li>
                <li><a href="#" className="hover:text-black transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-black transition">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-black transition">Terms</a></li>
                <li><a href="#" className="hover:text-black transition">Privacy</a></li>
                <li><a href="#" className="hover:text-black transition">Cookies</a></li>
                <li><a href="#" className="hover:text-black transition">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
            <p>&copy; 2026 rent.hub. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span>We accept:</span>
              <span className="font-semibold text-black">💳 UPI | Cards | Wallets</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}