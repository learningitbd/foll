import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { Search, MapPin, Clock, ShieldCheck, User, Phone, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderTrackingProps {
  orders: Order[];
  pastedOrderId?: string;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orders, pastedOrderId }) => {
  const [searchId, setSearchId] = useState(pastedOrderId || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (pastedOrderId) {
      setSearchId(pastedOrderId);
      handleSearch(pastedOrderId);
    }
  }, [pastedOrderId]);

  const handleSearch = (idToSearch: string) => {
    setErrorMessage('');
    const id = idToSearch.trim().toUpperCase();
    if (!id) {
      setErrorMessage('অনুগ্রহ করে একটি সঠিক অর্ডার আইডি টাইপ করুন।');
      setSelectedOrder(null);
      return;
    }

    const order = orders.find(o => o.id.toUpperCase() === id);
    if (order) {
      setSelectedOrder(order);
    } else {
      setErrorMessage('অর্ডার আইডিটি পাওয়া যায়নি! আইডিটি মিলিয়ে আবার চেষ্টা করুন।');
      setSelectedOrder(null);
    }
  };

  // Helper to determine active status index
  const getStatusIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'packed': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  // Map progress (percentage along path) based on status
  const getMapProgress = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 10;
      case 'packed': return 35;
      case 'shipped': return 70;
      case 'delivered': return 100;
      default: return 10;
    }
  };

  const currentProgress = selectedOrder ? getMapProgress(selectedOrder.status) : 10;

  // Render SVG Map coords according to percentage progress
  const getScooterCoords = (percent: number) => {
    // Defines a path starting at Hub (40, 160) -> Mid 1 (140, 60) -> Mid 2 (260, 180) -> Target (360, 50)
    if (percent <= 10) return { x: 45, y: 155 };
    if (percent <= 35) return { x: 100, y: 105 };
    if (percent <= 70) return { x: 210, y: 135 };
    return { x: 355, y: 55 }; // Arrived
  };

  const scooterPos = getScooterCoords(currentProgress);

  return (
    <div id="order-tracking-view" className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Search Header Board */}
      <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-xs space-y-4">
        <div className="text-center max-w-md mx-auto space-y-2">
          <span className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full font-display">ডেলিভারি ট্র্যাকার</span>
          <h2 className="text-2xl font-extrabold text-slate-800 font-display">আপনার অর্ডারটি কোথায় আছে জানুন</h2>
          <p className="text-xs text-slate-400">অর্ডার সম্পন্ন করার পর প্রাপ্ত আইডি (যেমন: SF-94821) নিচে দিয়ে রিয়েল-টাইম ট্র্যাক করুন।</p>
        </div>

        {/* Input Bar */}
        <div className="max-w-lg mx-auto flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              id="tracking-id-input"
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-xl text-sm font-semibold tracking-wide"
              placeholder="অর্ডার আইডি দিন (যেমন: SF-94821)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(searchId);
              }}
            />
          </div>
          <button
            id="tracking-search-btn"
            onClick={() => handleSearch(searchId)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95"
          >
            খুঁজুন
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-500 text-center font-semibold mt-2 font-display">{errorMessage}</p>
        )}
      </div>

      {selectedOrder ? (
        <div className="grid md:grid-cols-12 gap-5">
          {/* Left Column: Progress Timeline */}
          <div className="md:col-span-6 bg-white p-6 border border-slate-100 rounded-2xl shadow-xs space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-rose-50/50">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">ইনভয়েস ট্র্যাকিং</span>
                <h3 className="font-extrabold text-slate-800 font-mono tracking-wide">{selectedOrder.id}</h3>
              </div>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase ${
                selectedOrder.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                selectedOrder.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                selectedOrder.status === 'packed' ? 'bg-amber-100 text-amber-800' :
                'bg-slate-100 text-slate-700'
              }`}>
                {selectedOrder.status === 'delivered' ? 'ডেলিভার্ড' :
                 selectedOrder.status === 'shipped' ? 'রাস্তায় আছে' :
                 selectedOrder.status === 'packed' ? 'প্যাকেজিং হয়েছে' :
                 'মূল্যায়ন চলছে'}
              </span>
            </div>

            {/* Rider Information Section (only shows when packed, shipped or delivered) */}
            {selectedOrder.status !== 'pending' && (
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <User className="w-5 h-5 animate-pulse-soft" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">নিযুক্ত রাইডার</p>
                    <h5 className="font-bold text-slate-800 text-sm font-display">মো: হাবিবুর রহমান</h5>
                    <p className="text-[10px] text-emerald-600 font-semibold font-display">✓ ৯৯.৮% পজিটিভ রেটিং (পাবনা ড্রাইভ)</p>
                  </div>
                </div>
                <a
                  href="tel:01786803899"
                  className="p-2 bg-white hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 rounded-lg shadow-xs border border-slate-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Timeline Stepper Nodes */}
            <div className="relative pl-6 space-y-6">
              {/* Vertical link line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-slate-100" />

              {/* Step 1: Pending */}
              <div className="relative flex gap-3.5 items-start">
                <span className={`absolute left-[-22px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  getStatusIndex(selectedOrder.status) >= 0 ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200'
                }`}>
                  {getStatusIndex(selectedOrder.status) >= 0 && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-extrabold ${getStatusIndex(selectedOrder.status) >= 0 ? 'text-slate-800' : 'text-slate-400'} font-display`}>অর্ডার গৃহীত হয়েছে ও যাচাই চলছে</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-display">সিজনাল ফল হাব, পাবনা সদর</p>
                </div>
              </div>

              {/* Step 2: Packed */}
              <div className="relative flex gap-3.5 items-start">
                <span className={`absolute left-[-22px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  getStatusIndex(selectedOrder.status) >= 1 ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200'
                }`}>
                  {getStatusIndex(selectedOrder.status) >= 1 && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-extrabold ${getStatusIndex(selectedOrder.status) >= 1 ? 'text-slate-800' : 'text-slate-400'} font-display`}>বাগান থেকে তাজা পেরে প্যাকিং সম্পন্ন</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-display">সতেজতার ডাবল সিল সহ কার্টুনিং সম্পন্ন।</p>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div className="relative flex gap-3.5 items-start">
                <span className={`absolute left-[-22px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  getStatusIndex(selectedOrder.status) >= 2 ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200'
                }`}>
                  {getStatusIndex(selectedOrder.status) >= 2 && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-extrabold ${getStatusIndex(selectedOrder.status) >= 2 ? 'text-slate-800' : 'text-slate-400'} font-display`}>ডেলিভারি রাইডার রওনা দিয়েছেন</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-display">পাবনা প্রধান ডিস্ট্রিবিউশন হাব থেকে রওনা।</p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className="relative flex gap-3.5 items-start">
                <span className={`absolute left-[-22px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  getStatusIndex(selectedOrder.status) >= 3 ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200'
                }`}>
                  {getStatusIndex(selectedOrder.status) >= 3 && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-extrabold ${getStatusIndex(selectedOrder.status) >= 3 ? 'text-slate-800' : 'text-slate-400'} font-display`}>সফলভাবে ডেলিভারি ও হ্যান্ডওভার সম্পন্ন</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-display">গ্রাহকের কাছে তরতাজা রসাল ফল পৌঁছে দেয়া হয়েছে।</p>
                </div>
              </div>
            </div>

            {/* Customer Details info block */}
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5 leading-5 font-display">
              <div className="flex justify-between">
                <span>গ্রাহকের ঠিকানা:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[200px] break-words">{selectedOrder.address}, {selectedOrder.upazila}</span>
              </div>
              <div className="flex justify-between">
                <span>পণ্যের মূল্য:</span>
                <span className="font-bold text-slate-800">৳{selectedOrder.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold text-slate-800">৳{selectedOrder.deliveryCharge}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-50">
                <span className="font-bold text-slate-700">সর্বমোট প্রদেয় বিল:</span>
                <span className="font-extrabold text-emerald-600 text-sm">৳{selectedOrder.grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Styled SVG Delivering Map */}
          <div className="md:col-span-6 bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col justify-between overflow-hidden relative min-h-[350px]">
            {/* Background glowing effects */}
            <div className="absolute top-10 left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 z-10">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h4 className="font-bold text-slate-200 text-xs font-display">লাইভ রুট ম্যাপ (পাবনা রাইড)</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase font-sans">SADAR HUB BYPASS</span>
            </div>

            {/* SVG Interactive Map Area */}
            <div className="flex-1 flex items-center justify-center p-3 z-10 relative">
              <svg viewBox="0 0 400 220" className="w-full max-w-sm h-auto">
                {/* Connecting styled road path */}
                <path
                  id="delivery-road-path"
                  d="M 40,160 Q 140,65 240,155 T 360,50"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Glowing completed rider track line */}
                <path
                  d="M 40,160 Q 140,65 240,155 T 360,50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="400"
                  strokeDashoffset={400 - (400 * (currentProgress / 100))}
                  style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                />

                {/* Road center dash marks */}
                <path
                  d="M 40,160 Q 140,65 240,155 T 360,50"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="5, 8"
                />

                {/* Nodes markers on the map */}
                {/* Node 1: Sadar distribution hub */}
                <g transform="translate(40,160)">
                  <circle r="14" fill="#065f46" className="animate-pulse" />
                  <circle r="7" fill="#10b981" />
                  <text y="24" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="system-ui">পাবনা সদর হাব</text>
                </g>

                {/* Regional Intermediate Milestone: Shalgaria Junction */}
                <g transform="translate(130,100)">
                  <circle r="4" fill="#64748b" />
                  <text y="-8" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="medium" fontFamily="system-ui">শালগাড়ীয়া</text>
                </g>

                {/* Regional Intermediate Milestone: Municipal Bypass */}
                <g transform="translate(240,155)">
                  <circle r="4" fill="#64748b" />
                  <text y="14" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="medium" fontFamily="system-ui">বাইপাস</text>
                </g>

                {/* Node 4: Client Home Destination */}
                <g transform="translate(360,50)">
                  <circle r="14" fill="#1e1b4b" />
                  <motion.circle
                     animate={{ r: [10, 16, 10] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                     r="10" 
                     fill="#6d28d9" 
                     opacity="0.3" 
                  />
                  <circle r="7" fill={selectedOrder.status === 'delivered' ? '#10b981' : '#a855f7'} />
                  <text y="-14" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontWeight="bold" fontFamily="system-ui">আপনার ঠিকানা</text>
                </g>

                {/* Small indicator arrows */}
                <g transform="translate(360,50)">
                  {selectedOrder.status === 'delivered' ? (
                    <circle r="5" fill="#10b981" />
                  ) : null}
                </g>

                {/* Animated Scooter delivery vehicle sliding */}
                <g
                  transform={`translate(${scooterPos.x}, ${scooterPos.y})`}
                  style={{ transition: 'all 1.5s ease-in-out' }}
                >
                  {/* Glowing core wrapper */}
                  <circle r="12" fill="#15803d" opacity="0.35" className="animate-ping" />
                  {/* Vehicle base */}
                  <rect x="-8" y="-8" width="14" height="14" rx="3" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Delivery character symbol representation: Small bicycle silhouette wheel mockup */}
                  <circle cx="-4" cy="6" r="3" fill="#ffffff" />
                  <circle cx="4" cy="6" r="3" fill="#ffffff" />
                  {/* Headlight yellow flare rays */}
                  <polygon points="6,-4 18,-10 18,2" fill="#f59e0b" opacity="0.6" />
                </g>
              </svg>
            </div>

            {/* Status ticker readout */}
            <div className="p-3 bg-slate-800 border border-slate-700/60 rounded-xl space-y-1 mt-auto">
              {selectedOrder.status === 'pending' && (
                <p className="text-xs font-semibold text-slate-300 font-display">
                  🚦 রাইডার সিগন্যাল: আপনার অর্ডারটি পেমেন্ট ভেরিফিকেশনের জন্য সদর বিতরণ হাবে অপেক্ষমাণ আছে।
                </p>
              )}
              {selectedOrder.status === 'packed' && (
                <p className="text-xs font-semibold text-slate-300 font-display">
                  📦 রাইডার সিগন্যাল: তাজা ফলের পেপারবক্সগুলি সুরক্ষিত প্যাকিং সিল যুক্ত করে লোডিং পয়েন্টে তোলা হয়েছে।
                </p>
              )}
              {selectedOrder.status === 'shipped' && (
                <p className="text-xs font-semibold text-amber-400 font-display">
                  ⚡ রাইডার সিগন্যাল: রাইডার হাব পার হয়ে গন্তব্যের দিকে এগিয়ে চলছেন। আনুমানিক ৩০-৪৫ মিনিট সময় লাগতে পারে।
                </p>
              )}
              {selectedOrder.status === 'delivered' && (
                <p className="text-xs font-semibold text-emerald-400 font-display">
                  🎉 রাইডার সিগন্যাল: সফল ডেলিভারি সম্পন্ন! আমাদের তাজা সিজনাল ফল উপভোগ করুন।
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-14 text-center border border-slate-100 hover:border-slate-200 bg-white rounded-2xl shadow-xs">
          <span className="p-4 rounded-full bg-slate-50 text-slate-400 mb-3 inline-block font-sans text-xl">🏍️</span>
          <h4 className="font-bold text-slate-700 font-display">অনুসন্ধান করুন</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">সঠিক ট্র্যাকিং পেতে উপরে আপনার অর্ডার আইডিটি কপি অথবা টাইপ করে "খুঁজুন" বোতামে চাপুন।</p>
        </div>
      )}
    </div>
  );
};
