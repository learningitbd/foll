import React, { useState, useEffect, useMemo } from 'react';
import { FruitItem, CartItem, Order, CustomerMessage, OrderStatus } from './types';
import { INITIAL_FRUITS } from './data/fruits';
import { INITIAL_ORDERS, INITIAL_MESSAGES } from './data/mockOrders';
import { FruitDetailsModal } from './components/FruitDetailsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracking } from './components/OrderTracking';
import { AdminDashboard } from './components/AdminDashboard';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Truck, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  Filter, 
  Check, 
  ArrowRight, 
  Lock, 
  Unlock, 
  Calendar, 
  Activity, 
  Heart, 
  MessageSquare, 
  Sparkles,
  Award,
  Clock,
  ChevronRight,
  Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- Persistent LocalState ---
  const [fruits, setFruits] = useState<FruitItem[]>(() => {
    const saved = localStorage.getItem('seasonal_fruits');
    return saved ? JSON.parse(saved) : INITIAL_FRUITS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('seasonal_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [messages, setMessages] = useState<CustomerMessage[]>(() => {
    const saved = localStorage.getItem('seasonal_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('seasonal_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Nav View State ---
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'tracking' | 'contact' | 'admin'>('home');

  // --- Shopping Filters ---
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Modals Interacting States ---
  const [activeDetailFruit, setActiveDetailFruit] = useState<FruitItem | null>(null);
  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState(false);
  const [prefilledTrackingId, setPrefilledTrackingId] = useState<string | undefined>(undefined);

  // --- Contact form inputs ---
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // --- Save State to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('seasonal_fruits', JSON.stringify(fruits));
  }, [fruits]);

  useEffect(() => {
    localStorage.setItem('seasonal_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('seasonal_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('seasonal_cart', JSON.stringify(cart));
  }, [cart]);

  // --- Quick Helpers ---
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.fruit.price * item.quantity), 0);

  // --- Shopping List Modifiers ---
  const handleAddToCart = (fruit: FruitItem) => {
    if (fruit.stock <= 0) return;
    
    setCart(prev => {
      const idx = prev.findIndex(item => item.fruit.id === fruit.id);
      if (idx > -1) {
        // limit cart count strictly to stock maximum
        const newQty = Math.min(fruit.stock, prev[idx].quantity + 1);
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: newQty };
        return updated;
      }
      return [...prev, { fruit, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (fruitId: string, qty: number) => {
    setCart(prev => prev.map(item => {
      if (item.fruit.id === fruitId) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (fruitId: string) => {
    setCart(prev => prev.filter(item => item.fruit.id !== fruitId));
  };

  // --- Contact Form submission ---
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim() || !contactMessage.trim()) {
      alert('অনুগ্রহ করে প্রয়োজনীয় তথ্যসমূহ (নাম, মোবাইল ও বার্তা) পূরণ করুন।');
      return;
    }

    const newMessage: CustomerMessage = {
      id: `msg-${Date.now()}`,
      name: contactName,
      phone: contactPhone,
      email: contactEmail.trim() ? contactEmail : undefined,
      message: contactMessage,
      date: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [newMessage, ...prev]);
    setContactSuccess(true);
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setContactMessage('');

    setTimeout(() => {
      setContactSuccess(false);
    }, 5000);
  };

  // --- Order placed controller ---
  const handleOrderPlaced = (order: Order) => {
    // Save order in master logs
    setOrders(prev => {
      const exists = prev.some(o => o.id === order.id);
      if (exists) {
        // Update states: Order matches perfectly
        return prev.map(o => o.id === order.id ? order : o);
      }
      return [order, ...prev];
    });

    // Empty active shopping cart
    setCart([]);

    // Force automatic redirection to Real-time Delivery Tracker with seeded OrderId!
    setPrefilledTrackingId(order.id);
    setActiveTab('tracking');
  };

  // --- Filtering Fruits Logic ---
  const filteredFruits = useMemo(() => {
    return fruits.filter(fruit => {
      const matchSeason = selectedSeason === 'All' || fruit.seasonEn === selectedSeason;
      const matchSearch = searchQuery.trim() === '' || 
        fruit.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fruit.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSeason && matchSearch;
    });
  }, [fruits, selectedSeason, searchQuery]);

  // Featured seasonal picks shown under home views
  const seasonalFeaturedPicks = useMemo(() => {
    return fruits.filter(f => f.isSeasonalPick && f.isAvailable);
  }, [fruits]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-colors duration-300">
      
      {/* 1. TOP STYLED GLUE HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 flex-none">
        <div id="nav-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          
          {/* Logo Brand with Pabna coordinates */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-200/50 group-hover:scale-105 transition-all">
              ফ
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-800 tracking-tight font-display flex items-center gap-1">
                সিজনাল ফল <span className="text-emerald-600 text-xs font-semibold px-1.5 py-0.2 bg-emerald-50 rounded">তাজা</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-sans tracking-tight font-semibold flex items-center gap-1 leading-none mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-emerald-500" /> পাবনা সদর, পাবনা
              </p>
            </div>
          </div>

          {/* Navigation Items (Responsive layouts) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => setActiveTab('home')} 
              className={`hover:text-emerald-600 transition-colors font-display ${activeTab === 'home' ? 'text-emerald-600 font-bold border-b-2 border-emerald-500 pb-0.5' : ''}`}
            >
              হোম পেজ
            </button>
            <button 
              onClick={() => setActiveTab('shop')} 
              className={`hover:text-emerald-600 transition-colors font-display ${activeTab === 'shop' ? 'text-emerald-600 font-bold border-b-2 border-emerald-500 pb-0.5' : ''}`}
            >
              ফল কিনুন
            </button>
            <button 
              onClick={() => { setActiveTab('tracking'); setPrefilledTrackingId(undefined); }} 
              className={`hover:text-emerald-600 transition-colors font-display ${activeTab === 'tracking' ? 'text-emerald-600 font-bold border-b-2 border-emerald-500 pb-0.5' : ''}`}
            >
              ডেলিভারি ট্র্যাকিং
            </button>
            <button 
              onClick={() => setActiveTab('contact')} 
              className={`hover:text-emerald-600 transition-colors font-display ${activeTab === 'contact' ? 'text-emerald-600 font-bold border-b-2 border-emerald-500 pb-0.5' : ''}`}
            >
              যোগাযোগ
            </button>
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`hover:text-emerald-600 transition-colors font-display ${activeTab === 'admin' ? 'text-emerald-600 font-bold border-b-2 border-emerald-500 pb-0.5' : ''}`}
            >
              মার্চেন্ট ড্যাশবোর্ড
            </button>
          </nav>

          {/* Active shopping cart and profile stats */}
          <div className="flex items-center gap-3">
            
            {/* Quick Operating Info Banner (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100/60">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] text-amber-800 font-bold font-display">১২ ঘণ্টা হোম ডেলিভারি</span>
            </div>

            {/* Float Cart Tracker Icon */}
            <button
              id="header-cart-floating-btn"
              onClick={() => setShowCheckoutDrawer(true)}
              className="relative p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-850 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-xs"
              title="শপিং ব্যাগ"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-sans shadow"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile quick tabs subnav */}
        <div className="md:hidden flex bg-slate-50 border-t border-slate-100 py-1.5 px-3 justify-around text-xs font-semibold text-slate-500">
          <button onClick={() => setActiveTab('home')} className={`p-1 font-display ${activeTab === 'home' ? 'text-emerald-600 font-bold' : ''}`}>হোম</button>
          <button onClick={() => setActiveTab('shop')} className={`p-1 font-display ${activeTab === 'shop' ? 'text-emerald-600 font-bold' : ''}`}>পণ্য</button>
          <button onClick={() => { setActiveTab('tracking'); setPrefilledTrackingId(undefined); }} className={`p-1 font-display ${activeTab === 'tracking' ? 'text-emerald-600 font-bold' : ''}`}>ট্র্যাকার</button>
          <button onClick={() => setActiveTab('contact')} className={`p-1 font-display ${activeTab === 'contact' ? 'text-emerald-600 font-bold' : ''}`}>যোগাযোগ</button>
          <button onClick={() => setActiveTab('admin')} className={`p-1 font-display ${activeTab === 'admin' ? 'text-emerald-600 font-bold' : ''}`}>ড্যাশবোর্ড</button>
        </div>
      </header>

      {/* 2. BODY SCROLL CONTROLLER MODULES */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 my-2">
        <AnimatePresence mode="wait">
          
          {/* VIEW A: HOME PAGE */}
          {activeTab === 'home' && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="space-y-12"
            >
              {/* Gorgeous visual Hero Section */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-xl">
                
                {/* Background high-resolution fruits collage */}
                <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1200&auto=format&fit=crop')` }} />
                
                <div className="relative z-10 grid md:grid-cols-2 gap-8 p-8 md:p-14 items-center">
                  <div className="space-y-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400">
                      <Sparkles className="w-3.5 h-3.5" /> পাবনার নং ১ অর্গানিক ফলের দোকান
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold font-display leading-[1.15]">
                      তাজা, রসালো ও প্রাকৃতিক <span className="text-emerald-400">সিজনাল ফল</span>
                    </h2>
                    <p className="text-slate-200 text-sm md:text-base leading-relaxed leading-6 font-display">
                      ❤️ তাজা, রসালো ও প্রাকৃতিক সিজনাল ফল ❤️ আপনার সুস্থ জীবনের প্রতিশ্রুতি ❤️ সরাসরি পাবনা ও ঈশ্বরদীর বাগান থেকে কেমিক্যাল মুক্ত অবস্থায় আপনার ঠিকানায় পৌঁছে দিই।
                    </p>

                    {/* Integrated dynamic Search bar redirector */}
                    <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15 flex items-center gap-2 max-w-md">
                      <Search className="w-4 h-4 ml-2.5 text-slate-300" />
                      <input
                        type="text"
                        placeholder="যেমন: আম বা ল্যাংড়া..."
                        className="bg-transparent border-0 focus:ring-0 text-white placeholder-slate-400 text-xs flex-1 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setActiveTab('shop');
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          setActiveTab('shop');
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow"
                      >
                        খুঁজুন
                      </button>
                    </div>

                    <div className="flex gap-4 text-xs font-semibold pt-1">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>১০০% শতভাগ কেমিক্যালমুক্ত</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>পাবনা সিটিতে দ্রুত ক্যাশ অন ডেলিভারি</span>
                      </div>
                    </div>
                  </div>

                  {/* Right hand graphic showcasing lovely products */}
                  <div className="relative flex justify-center">
                    <div className="relative max-w-sm animate-float">
                      <img
                        src="https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop"
                        alt="Summer Organic Fruits"
                        className="rounded-2xl shadow-2xl object-cover w-64 h-64 border-4 border-emerald-500/40 relative z-10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -top-4 -left-4 w-28 h-28 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
                      <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informational Cards (About coordinates & contact credentials) */}
              <div className="grid md:grid-cols-3 gap-5">
                <div className="p-5 bg-white border border-slate-100 rounded-2xl flex gap-4 items-start shadow-xs">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm font-display">আমাদের আউটলেট ঠিকানা</h4>
                    <p className="text-xs text-slate-400 mt-1 font-display">পাবনা সদর , পাবনা, Pabna, Bangladesh, 6600</p>
                    <span className="text-[10px] text-emerald-600 font-extrabold mt-1.5 inline-block font-display">অবস্থান: স্টেডিয়াম রোড বাইপাস</span>
                  </div>
                </div>

                <div className="p-5 bg-white border border-slate-100 rounded-2xl flex gap-4 items-start shadow-xs">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Clock className="w-5 h-5 animate-pulse-soft" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm font-display">অর্ডার গ্রহণের সময়াবলি</h4>
                    <p className="text-xs text-slate-400 mt-1 font-display">সপ্তাহের ৭ দিন আমাদের সেবা চালু আছে।</p>
                    <span className="text-[10px] text-emerald-600 font-extrabold mt-1.5 inline-block font-display">ট্যাগ: সর্বদা সচল (Always open)</span>
                  </div>
                </div>

                <div className="p-5 bg-white border border-slate-100 rounded-2xl flex gap-4 items-start shadow-xs">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm font-display">গ্রাহক সাপোর্ট ফোন ও ইমেইল</h4>
                    <p className="text-xs text-slate-400 mt-1 font-sans">01786-803899<br/>seasonalfool@gmail.com</p>
                    <span className="text-[10px] text-[#e2136e] font-extrabold mt-1.5 inline-block font-sans">বিকাশ হেল্পলাইন: +৮৮০ ১৭৮৬৮০৩৮৯৯</span>
                  </div>
                </div>
              </div>

              {/* Jaistha Month/Summer Specials Grid Feature */}
              <div className="space-y-4">
                <div className="flex justify-between items-end pb-3 border-b border-rose-50/50">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded font-display uppercase tracking-wider mb-1">মধুমাস জ্যৈষ্ঠ স্পেশাল</span>
                    <h3 className="font-extrabold text-slate-800 text-lg font-display">চলতি মৌসুমের সেরা পুষ্টিকর ফলসমূহ</h3>
                  </div>
                  <button
                    onClick={() => { setSelectedSeason('Summer'); setActiveTab('shop'); }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center font-display"
                  >
                    সব ফল দেখুন <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {seasonalFeaturedPicks.slice(0, 4).map((fruit) => (
                    <div 
                      key={fruit.id} 
                      className="bg-white border border-slate-100 hover:border-emerald-100 rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                    >
                      <div className="relative h-40 bg-slate-50 overflow-hidden">
                        <img
                          src={fruit.image}
                          alt={fruit.nameBn}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold font-display uppercase">
                          {fruit.seasonBn}
                        </span>
                      </div>
                      
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs truncate font-display">{fruit.nameBn}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-semibold text-slate-400 font-sans uppercase">{fruit.nameEn}</span>
                          </div>
                        </div>

                        {/* Price & Add trigger inside small home cards */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                          <span className="text-sm font-extrabold text-emerald-600 font-display">৳{fruit.price} <span className="text-[9px] font-medium text-slate-400">/{fruit.unitBn}</span></span>
                          <button
                            onClick={() => handleAddToCart(fruit)}
                            disabled={fruit.stock === 0}
                            className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${
                              fruit.stock > 0 
                                ? 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-100 hover:border-emerald-600 active:scale-90 shadow-xs'
                                : 'bg-slate-100 text-slate-300 pointer-events-none'
                            }`}
                            title="কার্টে যোগ করুন"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secure simulated trust seals and guarantees review */}
              <div className="p-6 bg-gradient-to-br from-emerald-50/50 to-slate-50 border border-slate-100 rounded-2xl text-center space-y-4 max-w-2xl mx-auto">
                <h4 className="font-extrabold text-slate-800 font-display text-sm">সিজনাল ফল-এর বিশুদ্ধতা প্রতিশ্রুতি</h4>
                <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-slate-600 font-display">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="block text-lg mb-1 leading-none">🚫</span>
                    <span>কোনো কার্বাইড বা ফরমালিন নেই</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="block text-lg mb-1 leading-none">🌳</span>
                    <span>সরাসরি বাগান থেকে চয়নকৃত</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="block text-lg mb-1 leading-none">🚲</span>
                    <span>পাবনায় ফাস্ট ১২ ঘণ্টা ডেলিভারি</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* VIEW B: SHOP VIEW (ফল কিনুন) */}
          {activeTab === 'shop' && (
            <motion.div
              key="shop-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="space-y-6"
            >
              {/* Category selector row & search query */}
              <div className="bg-white p-4 border border-slate-100 rounded-3xl shadow-xs space-y-4 md:space-y-0 md:flex items-center justify-between gap-5">
                
                {/* Category filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 md:pb-0 scrollbar-none">
                  <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1 font-display">
                    <Filter className="w-3.5 h-3.5" /> ফিল্টার:
                  </span>
                  {[
                    { en: 'All', bn: 'সব ফল ক্যাটালগ' },
                    { en: 'Summer', bn: 'গ্রীষ্মের ফল' },
                    { en: 'Monsoon', bn: 'বর্ষাকালীন ফল' },
                    { en: 'Winter', bn: 'শীতের ফল' },
                    { en: 'Year-round', bn: 'বারোমাসি ফল' }
                  ].map((cat, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSeason(cat.en)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex-shrink-0 ${
                        selectedSeason === cat.en
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.bn}
                    </button>
                  ))}
                </div>

                {/* Sub search input */}
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-1.8 bg-slate-50 focus:bg-white border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl text-xs font-semibold font-display"
                    placeholder="পছন্দের ফল খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Dynamic products list grid */}
              {filteredFruits.length === 0 ? (
                <div className="py-24 text-center border bg-white rounded-3xl shadow-xs">
                  <p className="text-xs text-slate-400 font-display">দুঃখিত, এই মৌসুমী ফিল্টারে কোনো ফল খুঁজে পাওয়া যায়নি!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {filteredFruits.map((fruit) => (
                    <div 
                      key={fruit.id}
                      className="bg-white border border-slate-100 hover:border-emerald-100 rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group h-full"
                    >
                      {/* Product Cover image */}
                      <div className="relative h-44 bg-slate-50 overflow-hidden">
                        <img
                          src={fruit.image}
                          alt={fruit.nameBn}
                          className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-emerald-600 text-white rounded text-[9px] font-extrabold font-display uppercase shadow-md">
                          {fruit.seasonBn}
                        </span>

                        {/* Rating floating overlay badge */}
                        <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 bg-white/90 backdrop-blur-md text-amber-600 rounded-md text-[10px] font-bold shadow font-sans">
                          ★ {fruit.rating}
                        </span>
                      </div>

                      {/* Product metadata information details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <h4 
                            onClick={() => setActiveDetailFruit(fruit)}
                            className="font-extrabold text-slate-800 text-sm hover:text-emerald-600 cursor-pointer font-display truncate"
                          >
                            {fruit.nameBn}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-sans tracking-wide truncate">{fruit.nameEn}</p>
                          
                          {/* Stock gauge display */}
                          {fruit.stock > 0 ? (
                            <span className="inline-block text-[10px] font-bold text-emerald-600 mt-0.5">গুদামে আছে: {fruit.stock} {fruit.unitBn}</span>
                          ) : (
                            <span className="inline-block text-[10px] font-bold text-rose-500 mt-0.5">স্টক শেষ</span>
                          )}
                        </div>

                        {/* Pricing & shopping actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-base font-extrabold text-emerald-600 font-display">৳{fruit.price}</span>
                            <span className="text-[9px] text-slate-400">/ {fruit.unitBn}</span>
                          </div>

                          <div className="flex gap-1.5">
                            {/* Benefits Details action */}
                            <button
                              id="view-details-btn"
                              onClick={() => setActiveDetailFruit(fruit)}
                              className="px-2.5 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg text-[10px] font-bold transition-all font-display active:scale-95"
                            >
                              উপকারিতা
                            </button>

                            {/* Add to Cart checkout button */}
                            <button
                              id="add-to-cart-btn"
                              disabled={fruit.stock === 0}
                              onClick={() => handleAddToCart(fruit)}
                              className={`p-1.5 px-2.5 rounded-lg font-bold text-xs shadow-xs transition-all active:scale-[0.92] ${
                                fruit.stock > 0 
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md' 
                                  : 'bg-slate-100 text-slate-300 pointer-events-none'
                              }`}
                            >
                              কিনুন
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* VIEW C: DELIVERY TRACKING */}
          {activeTab === 'tracking' && (
            <motion.div
              key="tracking-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <OrderTracking 
                orders={orders} 
                pastedOrderId={prefilledTrackingId} 
              />
            </motion.div>
          )}

          {/* VIEW D: CONTACT / ABOUT */}
          {activeTab === 'contact' && (
            <motion.div
              key="contact-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="grid md:grid-cols-12 gap-6 items-start">
                
                {/* Left col: text and contacts list */}
                <div className="md:col-span-5 bg-white p-6 border border-slate-100 rounded-2xl shadow-xs space-y-6">
                  <div>
                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest font-display">আমাদের বিবরণ</span>
                    <h2 className="text-xl font-extrabold text-slate-800 font-display mt-0.5">যোগাযোগের হেল্পডেস্ক</h2>
                    <p className="text-xs text-slate-400 mt-1.5 font-display leading-5">পাবনা পৌরসভা এবং পাশ্ববর্তী এলাকাগুলোতে পাইকারি ও খুচরা তাজা আম ও অন্যান্য মৌসুমি ফল হোম ডেলিভারি দিতে আমাদের টিম সর্বদা প্রস্তুত।</p>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-slate-700 leading-normal">
                    <div className="flex gap-3 items-center">
                      <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><Phone className="w-4 h-4" /></span>
                      <span className="font-sans">01786-803899</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><Mail className="w-4 h-4" /></span>
                      <span className="font-sans">seasonalfool@gmail.com</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><MapPin className="w-4 h-4" /></span>
                      <span className="font-display">পাবনা সদর , পাবনা, Bangladesh, 6600</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 text-amber-800 rounded-xl text-xs leading-5">
                    <p className="font-bold font-display">⏰ কাজের সময়:</p>
                    <p className="font-display">সকাল ৯ টা থেকে রাত ১০ টা পর্যন্ত। অর্ডার সবসময় ওপেন থাকে।</p>
                  </div>
                </div>

                {/* Right col: Send inquiry form */}
                <div className="md:col-span-7 bg-white p-6 border border-slate-100 rounded-2xl shadow-xs">
                  <h3 className="font-extrabold text-slate-800 mb-4 font-display text-sm">আমাদের কাছে সরাসরি বার্তা পাঠান</h3>
                  
                  {contactSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl mb-4 font-display"
                    >
                      ✓ বার্তাটি সফলভাবে পাঠানো হয়েছে! মার্চেন্ট চেক করার পর আপনার ফোনে যোগাযোগ করবেন।
                    </motion.div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1 font-display">আপনার নাম *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-lg"
                        placeholder="যেমন: আশরাফুল ইসলাম"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-600 mb-1 font-display">মোবাইল নম্বর *</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-lg"
                          placeholder="017xxxxxxxx"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 mb-1 font-display">ইমেইল (ঐচ্ছিক)</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-lg"
                          placeholder="e.g. ashraf@gmail.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1 font-display">আপনার বার্তা / অর্ডার চাহিদা লিখুন *</label>
                      <textarea
                        rows={4}
                        required
                        className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-lg resize-none leading-relaxed"
                        placeholder="যেমন: আপনাদের কাছে হিমসাগর আম ৫০ কেজি কত দরে পাবো?"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      id="contact-submit-btn"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95"
                    >
                      বার্তা প্রেরণ করুন
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW E: ADMIN DASHBOARD */}
          {activeTab === 'admin' && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <AdminDashboard
                fruits={fruits}
                onUpdateFruits={setFruits}
                orders={orders}
                onUpdateOrders={setOrders}
                messages={messages}
                onUpdateMessages={setMessages}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3. FOOTER SECTION */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-12 flex-none font-display">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-600">সিজনাল ফল (Seasonal Fruits)</p>
          <p>পাবনা পৌরসভা বাইপাস সড়ক, পাবনা সদর, বাংলাদেশ</p>
          <p className="text-[10px] font-sans">© {new Date().getFullYear()} Seasonal Fruits. All Rights Reserved. Crafted with pure freshness.</p>
        </div>
      </footer>

      {/* --- INTEGRATED COMPONENT MODALS FLOATING GATEWAY --- */}
      
      {/* 1. Details informational facts modal popup */}
      <FruitDetailsModal 
        fruit={activeDetailFruit}
        onClose={() => setActiveDetailFruit(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 2. Side navigation Cart & payment checking drawers */}
      {showCheckoutDrawer && (
        <CheckoutModal 
          cart={cart}
          onUpdateQty={handleUpdateCartQty}
          onRemoveItem={handleRemoveFromCart}
          onClose={() => setShowCheckoutDrawer(false)}
          onOrderPlaced={handleOrderPlaced}
          fruits={fruits}
          onUpdateFruitStocks={setFruits}
        />
      )}

    </div>
  );
}
