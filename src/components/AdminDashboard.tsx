import React, { useState } from 'react';
import { FruitItem, Order, CustomerMessage, OrderStatus } from '../types';
import { Lock, Unlock, BarChart3, Package, FileText, MessageSquare, Plus, Minus, Check, Trash2, Calendar, FileDown, PlusCircle, AlertTriangle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  fruits: FruitItem[];
  onUpdateFruits: (fruits: FruitItem[]) => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  messages: CustomerMessage[];
  onUpdateMessages: (messages: CustomerMessage[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  fruits,
  onUpdateFruits,
  orders,
  onUpdateOrders,
  messages,
  onUpdateMessages,
}) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'inventory' | 'messages'>('orders');

  // Add Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFruit, setNewFruit] = useState<Partial<FruitItem>>({
    nameBn: '',
    nameEn: '',
    price: 100,
    unitBn: 'কেজি',
    unitEn: 'kg',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
    isSeasonalPick: false,
    seasonEn: 'Summer',
    seasonBn: 'গ্রীষ্মকাল',
    descriptionBn: '',
    benefitsBn: ['নিয়মিত সেবনে শরীর সতেজ ও সুস্থ থাকে।'],
  });

  // PIN Handler
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  // Quick Stats
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  
  const fruitsSold = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  const lowStockCount = fruits.filter(f => f.stock < 50).length;

  // Status progression router
  const advanceOrderStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus;
    switch (currentStatus) {
      case 'pending': nextStatus = 'packed'; break;
      case 'packed': nextStatus = 'shipped'; break;
      case 'shipped': nextStatus = 'delivered'; break;
      default: return; // already delivered or cancelled
    }

    const now = new Date();
    const timeBn = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' ' + now.toLocaleDateString('bn-BD');

    let titleBn = '';
    let titleEn = '';
    let noteBn = '';
    let noteEn = '';

    if (nextStatus === 'packed') {
      titleBn = 'প্যাকিং সম্পন্ন হয়েছে';
      titleEn = 'Fruit Packing Completed';
      noteBn = 'বাগান থেকে সংগৃহীত তাজা ফল সফলভাবে ডবল-সিল কার্টনে প্যাকিং করা হয়েছে।';
      noteEn = 'Fruits harvested and carefully boxed in premium cardboard.';
    } else if (nextStatus === 'shipped') {
      titleBn = 'ডেলিভারি হাবে প্রেরিত (অন রুট)';
      titleEn = 'Dispatched - Out for Delivery';
      noteBn = 'আপনার ঠিকানায় ডেলিভারি দিতে আমাদের রাইডার মো: হাবিবুর রহমান রওনা হয়েছেন।';
      noteEn = 'Our delivery rider is carrying dispatch items to your physical location.';
    } else if (nextStatus === 'delivered') {
      titleBn = 'সফলভাবে হ্যান্ডওভার সম্পন্ন';
      titleEn = 'Successfully Delivered';
      noteBn = 'আপনার অর্ডার এবং সতেজ ফলসমূহ সফলভাবে আপনার কাছে হস্তান্তর করা হয়েছে। ধন্যবাদ!';
      noteEn = 'Items hand-delivered successfully. Thank you for buying with Seasonal Fruits!';
    }

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: nextStatus,
          trackingUpdates: [
            ...o.trackingUpdates,
            {
              status: nextStatus,
              titleBn,
              titleEn,
              time: timeBn,
              noteBn,
              noteEn
            }
          ]
        };
      }
      return o;
    });

    onUpdateOrders(updatedOrders);
  };

  // Cancel order handler
  const cancelOrder = (orderId: string) => {
    const confirmCancel = window.confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি বাতিল করতে চান?');
    if (!confirmCancel) return;

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'cancelled' as OrderStatus,
          trackingUpdates: [
            ...o.trackingUpdates,
            {
              status: 'cancelled' as OrderStatus,
              titleBn: 'অর্ডার বাতিল করা হয়েছে',
              titleEn: 'Order Cancelled',
              time: new Date().toLocaleTimeString('bn-BD'),
              noteBn: 'অনিবার্য কারণে অর্ডারটি বাতিল হিসেবে গণ্য করা হয়েছে।',
              noteEn: 'The order was cancelled.'
            }
          ]
        };
      }
      return o;
    });
    onUpdateOrders(updatedOrders);
  };

  // Stock controller
  const handleStockAdjust = (fruitId: string, amount: number) => {
    const updatedFruits = fruits.map(f => {
      if (f.id === fruitId) {
        return {
          ...f,
          stock: Math.max(0, f.stock + amount)
        };
      }
      return f;
    });
    onUpdateFruits(updatedFruits);
  };

  // Price adjuster
  const handlePriceChange = (fruitId: string, newPrice: number) => {
    if (newPrice < 10) return;
    const updatedFruits = fruits.map(f => {
      if (f.id === fruitId) {
        return {
          ...f,
          price: newPrice
        };
      }
      return f;
    });
    onUpdateFruits(updatedFruits);
  };

  // Toggle availability
  const toggleAvailability = (fruitId: string) => {
    const updatedFruits = fruits.map(f => {
      if (f.id === fruitId) {
        return {
          ...f,
          isAvailable: !f.isAvailable
        };
      }
      return f;
    });
    onUpdateFruits(updatedFruits);
  };

  // Message Actions
  const toggleMessageRead = (msgId: string) => {
    const updatedMessages = messages.map(m => {
      if (m.id === msgId) return { ...m, isRead: !m.isRead };
      return m;
    });
    onUpdateMessages(updatedMessages);
  };

  const deleteMessage = (msgId: string) => {
    if (window.confirm('বার্তাটি মুছে ফেলতে চান?')) {
      const updatedMessages = messages.filter(m => m.id !== msgId);
      onUpdateMessages(updatedMessages);
    }
  };

  // Handle Add Product Callback
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFruit.nameBn || !newFruit.nameEn || !newFruit.price) {
      alert('অনুগ্রহ করে প্রয়োজনীয় তথ্যসমূহ (ফলের নাম, ইংরেজি নাম, মূল্য) পূরণ করুন।');
      return;
    }

    const uniqueId = newFruit.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finalProduct: FruitItem = {
      id: uniqueId,
      nameBn: newFruit.nameBn,
      nameEn: newFruit.nameEn,
      price: Number(newFruit.price),
      unitBn: newFruit.unitBn || 'কেজি',
      unitEn: newFruit.unitEn || 'kg',
      stock: Number(newFruit.stock) || 100,
      image: newFruit.image || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=600&auto=format&fit=crop',
      isAvailable: true,
      isSeasonalPick: newFruit.isSeasonalPick || false,
      seasonEn: newFruit.seasonEn as any || 'Summer',
      seasonBn: newFruit.seasonBn as any || 'গ্রীষ্মকাল',
      descriptionBn: newFruit.descriptionBn || 'বাগান থেকে তাজা পেরে সংগৃহীত পুষ্টিকর সিজনাল ফল।',
      benefitsBn: newFruit.benefitsBn || ['নিয়মিত সেবনে শরীর সতেজ ও সুস্থ থাকে।'],
      rating: 4.8,
      reviewsCount: 1,
    };

    onUpdateFruits([finalProduct, ...fruits]);
    setShowAddForm(false);
    setNewFruit({
      nameBn: '',
      nameEn: '',
      price: 100,
      unitBn: 'কেজি',
      unitEn: 'kg',
      stock: 100,
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=600&auto=format&fit=crop',
      isAvailable: true,
      isSeasonalPick: false,
      seasonEn: 'Summer',
      seasonBn: 'গ্রীষ্মকাল',
      descriptionBn: '',
      benefitsBn: ['নিয়মিত সেবনে শরীর সতেজ ও সুস্থ থাকে।'],
    });
  };

  // Print Invoice (Simulated)
  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>ইনভয়েস - ${order.id}</title>
          <style>
            body { font-family: 'system-ui', sans-serif; padding: 40px; color: #334155; }
            .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; display: flex; justify-content: space-between; }
            .meta { margin-top: 20px; font-size: 14px; line-height: 1.6; }
            .bill-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .bill-table th { background: #f8fafc; padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            .bill-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
            .total { text-align: right; margin-top: 25px; font-size: 18px; font-weight: bold; color: #10b981; }
            .watermark { text-align: center; color: #cbd5e1; font-size: 12px; margin-top: 80px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="color:#059669;margin:0;">সিজনাল ফল</h1>
              <small>পাবনা সদর, বাংলাদেশ | +৮৮০ ১৭৮৬৮০৩৮৯৯</small>
            </div>
            <div style="text-align:right">
              <h3 style="margin:0;">ট্যাক্স ইনভয়েস</h3>
              <strong>অর্ডার আইডি: ${order.id}</strong>
            </div>
          </div>
          <div class="meta">
            <strong>গ্রাহকের নাম:</strong> ${order.customerName}<br/>
            <strong>মোবাইল নম্বর:</strong> ${order.phone}<br/>
            <strong>ঠিকানা:</strong> ${order.address}, ${order.upazila}, ${order.district}<br/>
            <strong>পেমেন্ট মাধ্যম:</strong> ${order.paymentMethod.toUpperCase()}<br/>
            <strong>অর্ডার তারিখ:</strong> ${new Date(order.date).toLocaleDateString('bn-BD')}
          </div>
          <table class="bill-table">
            <thead>
              <tr>
                <th>ফলের বিবরণ</th>
                <th>পরিমাণ</th>
                <th>একক মূল্য</th>
                <th>মোট মূল্য</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.nameBn} (${item.nameEn})</td>
                  <td>${item.quantity} ${item.unitBn}</td>
                  <td>৳${item.price}</td>
                  <td>৳${item.price * item.quantity}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="3" style="text-align:right">ডেলিভারি চার্জ:</td>
                <td>৳${order.deliveryCharge}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">মোট সংগৃহীত বিল: ৳${order.grandTotal}</div>
          <div class="watermark">সতেজ ও প্রাকৃতিক স্বাস্থ্যকর ফলের নির্ভরযোগ্য অংশীদার - সিজনাল ফল।</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // If Lock Screen is active
  if (!isAuthenticated) {
    return (
      <div id="admin-auth-overlay" className="flex items-center justify-center p-6 min-h-[450px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-white p-7 border border-slate-100 rounded-2xl shadow-xl space-y-5 text-center"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg font-display">মার্চেন্ট ড্যাশবোর্ড লক</h3>
            <p className="text-xs text-slate-400 mt-1 font-display">অর্ডার ও স্টক পরিচালনার জন্য ৪-ডিজিটের ডেমনস্ট্রেশন পিন টাইপ করুন</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setPinError(false);
              }}
              className={`w-full px-4 py-3 bg-slate-50 border text-center font-bold tracking-widest text-lg rounded-xl focus:bg-white focus:outline-none transition-all ${
                pinError ? 'border-rose-400 focus:ring-rose-500/15 ring-2 ring-rose-500/10' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
              }`}
              placeholder="••••"
            />
            {pinError && (
              <p className="text-xs text-rose-500 font-semibold font-display">ভুল পিন কোড! অনুগ্রহ করে '1234' চাপুন।</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              আনলক ড্যাশবোর্ড <Unlock className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-400 font-semibold bg-slate-50 p-2 rounded">
            🔐 ডেমো পিন: <span className="font-sans font-bold text-emerald-600">1234</span> (কোড টাইপ করুন)
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="admin-main-dashboard" className="space-y-6">
      
      {/* Metrics Dashboard Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div id="stat-revenue" className="bg-white p-4 border border-slate-100 rounded-xl shadow-xs">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-display">মোট বিক্রয় (৳)</p>
          <h4 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-1 font-display">৳{totalRevenue.toLocaleString('bn-BD')}</h4>
          <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded mt-1 inline-block">ডেলিভারড পেমেন্ট</span>
        </div>

        <div id="stat-active-orders" className="bg-white p-4 border border-slate-100 rounded-xl shadow-xs">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-display">চলতি কুইউ (অর্ডার)</p>
          <h4 className="text-xl md:text-2xl font-extrabold text-indigo-600 mt-1 font-display">{activeOrders}টি অর্ডার</h4>
          <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.2 rounded mt-1 inline-block">প্যাকিং/পথে প্রেরিত</span>
        </div>

        <div id="stat-fruits-sold" className="bg-white p-4 border border-slate-100 rounded-xl shadow-xs">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-display">সর্বমোট ফল বিক্রয়</p>
          <h4 className="text-xl md:text-2xl font-extrabold text-[#f69220] mt-1 font-display">{fruitsSold}টি কার্টন</h4>
          <span className="text-[9px] text-[#f69220] font-bold bg-orange-50/50 px-1.5 py-0.2 rounded mt-1 inline-block">সম্পূর্ণ খালাস</span>
        </div>

        <div id="stat-low-stock" className="bg-white p-4 border border-slate-100 rounded-xl shadow-xs">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-display">স্টক সতর্কতা</p>
          <h4 className={`text-xl md:text-2xl font-extrabold mt-1 font-display ${lowStockCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{lowStockCount}টি আইটেম</h4>
          <span className="text-[9px] text-slate-400 font-bold bg-slate-50 px-1.5 py-0.2 rounded mt-1 inline-block">সীমা: ৫০ এর নিচে</span>
        </div>
      </div>

      {/* Sub tabs switches */}
      <div className="flex bg-slate-100 p-1 rounded-xl max-w-sm">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'orders' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> অর্ডার কুইউ ({orders.length})
        </button>
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'inventory' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" /> ইনভেন্টরি স্টক ({fruits.length})
        </button>
        <button
          onClick={() => setActiveSubTab('messages')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all relative ${
            activeSubTab === 'messages' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> গ্রাহক বার্তা ({messages.filter(m => !m.isRead).length})
          {messages.some(m => !m.isRead) && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>
      </div>

      {/* Action panels */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: ORDERS */}
        {activeSubTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs overflow-hidden"
          >
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-slate-800 font-display text-sm">গ্রাহক অর্ডার লগ ও পেমেন্ট ভেরিফায়ার</h3>
              <span className="text-xs text-slate-400 font-display">মোট ক্যাটালগড অর্ডার: {orders.length}টি</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-400 font-extrabold">
                    <th className="py-3 px-2 font-display">অর্ডার আইডি</th>
                    <th className="py-3 px-2 font-display">গ্রাহকের বিবরণ</th>
                    <th className="py-3 px-2 font-display">ফলসমূহ</th>
                    <th className="py-3 px-2 font-display">পরিশোধ তথ্য ও বিল</th>
                    <th className="py-3 px-2 font-display text-center">ডেলিভারি স্থিতি</th>
                    <th className="py-3 px-2 text-right font-display">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* ID */}
                      <td className="py-3.5 px-2 font-mono font-bold text-slate-800">{order.id}</td>
                      
                      {/* Customer info */}
                      <td className="py-3.5 px-2 leading- relaxed">
                        <strong className="text-slate-800 block font-display text-xs">{order.customerName}</strong>
                        <span className="text-xs text-slate-500 block font-sans">{order.phone}</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[150px] font-display">{order.address}</span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-2">
                        <div className="space-y-0.5">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="block text-[11px] text-slate-700 font-display">
                              {item.nameBn} - <strong className="font-sans font-semibold text-[10px] bg-slate-100 px-1 rounded">{item.quantity} x {item.price}</strong>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-2">
                        <span className="font-extrabold text-emerald-600 block text-sm font-display">৳{order.grandTotal}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-1 text-[9px] font-extrabold bg-slate-100 rounded text-slate-700 uppercase">{order.paymentMethod}</span>
                          {order.transactionId && (
                            <span className="text-[10px] font-mono font-bold text-[#e2136e]">{order.transactionId}</span>
                          )}
                        </div>
                      </td>

                      {/* Status flag */}
                      <td className="py-3.5 px-2 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'shipped' ? 'bg-indigo-100 text-indigo-850' :
                          order.status === 'packed' ? 'bg-amber-100 text-amber-800' :
                          order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {order.status === 'delivered' ? 'ডেলিভার্ড' :
                           order.status === 'shipped' ? 'পথে আছে' :
                           order.status === 'packed' ? 'প্যাকেজিং হয়েছে' :
                           order.status === 'cancelled' ? 'বাতিল' :
                           'অপেক্ষমান'}
                        </span>
                      </td>

                      {/* Controls */}
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Invoice downloader print */}
                          <button
                            onClick={() => handlePrintInvoice(order)}
                            className="p-1 px-1.5 hover:bg-slate-100 text-slate-500 rounded border border-slate-200 transition-colors"
                            title="ইনভয়েস প্রিন্ট"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Trigger Stepper advanced status */}
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => advanceOrderStatus(order.id, order.status)}
                              className="p-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] transition-colors"
                            >
                              {order.status === 'pending' ? 'প্যাকিং করুন' : 
                               order.status === 'packed' ? 'অন-রুট করুন' : 'ডেলিভারি সফল'}
                            </button>
                          )}

                          {/* Cancel handler */}
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded transition-colors"
                              title="বাতিল করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 2: INVENTORY STOCK CONTROL */}
        {activeSubTab === 'inventory' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="space-y-4"
          >
            {/* Action Header and Add triggers */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-800 font-display text-sm">ফল স্টক ও দাম কাস্টমাইজার</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">তাত্ক্ষণিক বা সতেজ দাম পরিবর্তন ও মজুদ পরিমাণ আপডেট করুন</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" /> নতুন ফল যোগ করুন
              </button>
            </div>

            {/* Expandable Add Product Form */}
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleAddProduct}
                className="bg-white border-2 border-emerald-500/20 rounded-2xl p-5 space-y-4 shadow-md"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                  <h4 className="font-extrabold text-slate-800 text-xs font-display">নতুন ফল যুক্ত করার ফর্ম</h4>
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 text-xs">বন্ধ করুন</button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Bangla Title */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 font-display">ফলের নাম (বাংলা) *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: হাড়িভাঙ্গা আম"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      value={newFruit.nameBn}
                      onChange={(e) => setNewFruit(prev => ({ ...prev, nameBn: e.target.value }))}
                    />
                  </div>
                  {/* English Title */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 font-display">ইংরেজি নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: Haribhanga Mango"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      value={newFruit.nameEn}
                      onChange={(e) => setNewFruit(prev => ({ ...prev, nameEn: e.target.value }))}
                    />
                  </div>
                  {/* Photo CDN */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 font-display">ছবি লিংক (Unsplash/Web) *</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo..."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      value={newFruit.image}
                      onChange={(e) => setNewFruit(prev => ({ ...prev, image: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 font-display">মূল্য (৳) *</label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      value={newFruit.price}
                      onChange={(e) => setNewFruit(prev => ({ ...prev, price: Number(e.target.value) }))}
                    />
                  </div>
                  {/* Unit */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 font-display">পরিমাপ ইউনিট (যেমন: কেজি, পিস)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      value={newFruit.unitBn}
                      onChange={(e) => setNewFruit(prev => ({ ...prev, unitBn: e.target.value }))}
                    />
                  </div>
                  {/* Stock */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 font-display">স্টক পরিমাণ</label>
                    <input
                      type="number"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      value={newFruit.stock}
                      onChange={(e) => setNewFruit(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    />
                  </div>
                  {/* Season */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 font-display">সিজন / কাল</label>
                    <select
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      value={newFruit.seasonEn}
                      onChange={(e) => {
                        const val = e.target.value;
                        let bn = 'গ্রীষ্মকাল';
                        if (val === 'Monsoon') bn = 'বর্ষাকাল';
                        if (val === 'Autumn') bn = 'শরৎ-হেমন';
                        if (val === 'Winter') bn = 'শীতকাল';
                        if (val === 'Year-round') bn = 'বারোমাসি';
                        setNewFruit(prev => ({ ...prev, seasonEn: val as any, seasonBn: bn as any }));
                      }}
                    >
                      <option value="Summer">গ্রীষ্মকাল (Summer)</option>
                      <option value="Monsoon">বর্ষাকাল (Monsoon)</option>
                      <option value="Autumn">শরৎ (Autumn)</option>
                      <option value="Winter">শীতকাল (Winter)</option>
                      <option value="Year-round">বারোমাসি (Year-round)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1 font-display">ফলের বৈশিষ্ট্য সূচক বিবরণ (বাংলা)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    placeholder="যেমন: অসাধারণ পুষ্টিগুণ ও তীব্র রসাল স্বাদে ভরপুর এই ফল..."
                    value={newFruit.descriptionBn}
                    onChange={(e) => setNewFruit(prev => ({ ...prev, descriptionBn: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg"
                  >
                    বাতিল করুন
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow hover:bg-emerald-700"
                  >
                    গুদামে আপলোড দিন
                  </button>
                </div>
              </motion.form>
            )}

            {/* List and Stock table controls */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
              <div className="grid md:grid-cols-2 gap-4">
                {fruits.map((fruit) => (
                  <div key={fruit.id} className="p-4 border border-slate-100 rounded-xl flex items-center gap-4 hover:shadow-xs transition-shadow">
                    <img
                      src={fruit.image}
                      alt={fruit.nameBn}
                      className="w-16 h-16 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm truncate font-display">{fruit.nameBn}</h4>
                        <span className="text-[9px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-500 font-display">{fruit.seasonBn}</span>
                      </div>

                      {/* Interactive Stock counting controller */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400 font-display">স্টক:</span>
                          <span className={`text-xs font-extrabold font-display ${fruit.stock < 50 ? 'text-rose-500' : 'text-slate-700'}`}>
                            {fruit.stock} {fruit.unitBn}
                          </span>
                          {fruit.stock < 50 && (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                          )}
                        </div>

                        {/* Controls widget panel button */}
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(fruit.id, -10)}
                            className="p-1 px-1.5 bg-slate-50 border hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded transition-colors text-[9px] font-extrabold"
                          >
                            -১০
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(fruit.id, 10)}
                            className="p-1 px-1.5 bg-slate-50 border hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded transition-colors text-[9px] font-extrabold"
                          >
                            +১০
                          </button>
                        </div>
                      </div>

                      {/* Immediate Price controls field toggling */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-50/50">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-display">৳/কেজি:</span>
                          <input
                            type="number"
                            className="w-14 px-1.5 py-0.5 bg-slate-50 border border-slate-200 focus:bg-white text-xs font-bold text-emerald-600 text-center rounded"
                            value={fruit.price}
                            onChange={(e) => handlePriceChange(fruit.id, Number(e.target.value))}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleAvailability(fruit.id)}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all ${
                            fruit.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {fruit.isAvailable ? 'সবুজ (সচল)' : 'বন্ধ করা'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: CUSTOMER MESSAGES */}
        {activeSubTab === 'messages' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 font-display text-sm">পাবনা গ্রাহকদের থেকে বার্তা ও অর্ডার চাহিদা</h3>
              <span className="text-xs text-slate-400 font-display">অপঠিত মেসেজ: {messages.filter(m => !m.isRead).length}টি</span>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xs text-slate-400">কোনো ইনকোয়ারি মেসেজ নেই।</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between gap-4 transition-all ${
                    msg.isRead ? 'bg-white border-slate-100 hover:border-slate-200' : 'bg-emerald-50/20 border-emerald-100/70 shadow-xs'
                  }`}>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-800 text-sm font-display">{msg.name}</h4>
                        <span className="p-1 px-1.5 bg-slate-100 text-[9px] text-slate-400 rounded-full font-display">
                          {new Date(msg.date).toLocaleDateString('bn-BD')}
                        </span>
                        {!msg.isRead && (
                          <span className="text-[9px] font-extrabold bg-rose-150 text-rose-800 px-1.5 py-0.2 rounded font-display uppercase tracking-wider animate-pulse">NEW</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-sans font-medium">
                        <span className="flex items-center gap-1 hover:text-emerald-600"><Phone className="w-3.5 h-3.5" /> {msg.phone}</span>
                        {msg.email && <span className="text-[11px] text-slate-400">| {msg.email}</span>}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-display bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/40">
                        {msg.message}
                      </p>
                    </div>

                    {/* Trigger controls */}
                    <div className="flex items-end md:items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleMessageRead(msg.id)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                          msg.isRead ? 'bg-white text-slate-500 hover:bg-slate-100 border-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600'
                        }`}
                      >
                        {msg.isRead ? 'অপঠিত চিহ্নিত করুন' : 'পঠিত চিহ্নিত করুন'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMessage(msg.id)}
                        className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl border border-rose-200 hover:text-rose-600 transition-colors"
                        title="বার্তা ডিলিট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
