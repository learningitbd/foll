import React, { useState } from 'react';
import { CartItem, Order, FruitItem, OrderItem, OrderStatus, TrackingUpdate } from '../types';
import { X, Plus, Minus, Trash2, ShieldCheck, MapPin, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutModalProps {
  cart: CartItem[];
  onUpdateQty: (fruitId: string, quantity: number) => void;
  onRemoveItem: (fruitId: string) => void;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
  fruits: FruitItem[];
  onUpdateFruitStocks: (updatedFruits: FruitItem[]) => void;
}

const UPASILAS_PABNA = [
  'পাবনা সদর',
  'ঈশ্বরদী',
  'আটঘরিয়া',
  'সাঁথিয়া',
  'চাটমোহর',
  'ফরিদপুর',
  'বেড়া',
  'সুজানগর',
  'ভাঙ্গুড়া'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cart,
  onUpdateQty,
  onRemoveItem,
  onClose,
  onOrderPlaced,
  fruits,
  onUpdateFruitStocks,
}) => {
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  
  // Shipping Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [upazila, setUpazila] = useState('পাবনা সদর');
  const [district, setDistrict] = useState('পাবনা');
  const [deliveryArea, setDeliveryArea] = useState<'municipality' | 'upazila' | 'outside'>('municipality');
  const [notes, setNotes] = useState('');

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'cod'>('cod');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  // Placed Order Reference
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  
  // Errors
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Calculation
  const subtotal = cart.reduce((sum, item) => sum + (item.fruit.price * item.quantity), 0);
  
  const deliveryCharge = () => {
    if (deliveryArea === 'municipality') return 40;
    if (deliveryArea === 'upazila') return 80;
    return 150;
  };

  const grandTotal = subtotal + deliveryCharge();

  // Validate Shipping Info
  const validateShipping = () => {
    const errors: { [key: string]: string } = {};
    if (!customerName.trim()) errors.customerName = 'আপনার নাম লিখুন';
    
    // Bangladesh mobile pattern
    const phoneRegex = /^(01)[3-9]\d{8}$/;
    const digitOnlyPhone = phone.replace(/[-\s]/g, '');
    if (!digitOnlyPhone) {
      errors.phone = 'মোবাইল নম্বর লিখুন';
    } else if (!phoneRegex.test(digitOnlyPhone)) {
      errors.phone = 'সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন (যেমন: 01786803899)';
    }

    if (!address.trim()) errors.address = 'ডেলিভারি ঠিকানা লিখুন';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Payment Info
  const validatePayment = () => {
    const errors: { [key: string]: string } = {};
    
    if (paymentMethod !== 'cod') {
      const phoneRegex = /^(01)[3-9]\d{8}$/;
      const digitOnlyPhone = paymentNumber.replace(/[-\s]/g, '');
      if (!digitOnlyPhone) {
        errors.paymentNumber = 'পাঠানো মোবাইল নম্বর লিখুন';
      } else if (!phoneRegex.test(digitOnlyPhone)) {
        errors.paymentNumber = 'সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন';
      }

      if (!transactionId.trim()) {
        errors.transactionId = 'Transaction ID (TxnID) দিন';
      } else if (transactionId.trim().length < 6) {
        errors.transactionId = 'সঠিক ট্রানজেকশন আইডি দিন';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Switch Area and auto-set district/Upazila
  const handleAreaChange = (area: 'municipality' | 'upazila' | 'outside') => {
    setDeliveryArea(area);
    if (area === 'outside') {
      setDistrict('');
      setUpazila('');
    } else {
      setDistrict('পাবনা');
      setUpazila('পাবনা সদর');
    }
  };

  // Place Order Action
  const handlePlaceOrder = () => {
    if (paymentMethod !== 'cod' && !validatePayment()) return;

    // Check stock availability before completing
    const isUnderstocked = cart.some(item => {
      const matchingFruit = fruits.find(f => f.id === item.fruit.id);
      return matchingFruit && matchingFruit.stock < item.quantity;
    });

    if (isUnderstocked) {
      alert('দুঃখিত, কিছু ফলের স্টক আপনার চাহিদার চেয়ে কম আছে! অনুগ্রহ করে কার্ট পরীক্ষা করুন।');
      return;
    }

    // Deduct stock levels in parent state
    const updatedFruits = fruits.map(f => {
      const cartItem = cart.find(item => item.fruit.id === f.id);
      if (cartItem) {
        return {
          ...f,
          stock: Math.max(0, f.stock - cartItem.quantity)
        };
      }
      return f;
    });
    onUpdateFruitStocks(updatedFruits);

    // Create unique Order ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `SF-${randomSuffix}`;

    const itemsOrdered: OrderItem[] = cart.map(item => ({
      fruitId: item.fruit.id,
      nameBn: item.fruit.nameBn,
      nameEn: item.fruit.nameEn,
      quantity: item.quantity,
      price: item.fruit.price,
      unitBn: item.fruit.unitBn,
      unitEn: item.fruit.unitEn,
    }));

    const now = new Date();
    const timeBn = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' ' + now.toLocaleDateString('bn-BD');

    const trackingUpdates: TrackingUpdate[] = [
      {
        status: 'pending',
        titleBn: 'অর্ডার জমা হয়েছে',
        titleEn: 'Order Submitted',
        time: timeBn,
        noteBn: paymentMethod === 'cod' 
          ? 'আপনার অর্ডারটি নিরাপদে জমা হয়েছে। ক্যাশ অন ডেলিভারিতে ডেলিভারি দেয়া হবে।'
          : `আপনার অর্ডার এবং ${paymentMethod.toUpperCase()} পেমেন্ট (TxnID: ${transactionId}) সফলভাবে জমা হয়েছে। যাচাই করা হচ্ছে।`,
        noteEn: 'Order submitted. Pending merchant review.'
      }
    ];

    const finalOrder: Order = {
      id: orderId,
      customerName,
      phone: phone.replace(/[-\s]/g, ''),
      email,
      address,
      upazila: deliveryArea === 'outside' ? 'N/A' : upazila,
      district,
      totalAmount: subtotal,
      deliveryCharge: deliveryCharge(),
      grandTotal,
      paymentMethod,
      paymentNumber: paymentMethod !== 'cod' ? paymentNumber : undefined,
      transactionId: paymentMethod !== 'cod' ? transactionId : undefined,
      status: 'pending',
      date: now.toISOString(),
      items: itemsOrdered,
      trackingUpdates,
      notes: notes.trim() ? notes : undefined
    };

    setPlacedOrder(finalOrder);
    onOrderPlaced(finalOrder);
    setStep('success');
  };

  return (
    <AnimatePresence>
      <div id="checkout-modal-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          id="checkout-drawer-container"
          className="relative w-full max-w-lg h-full bg-slate-50 shadow-2xl flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-800 font-display">অর্ডার প্লেসমেন্ট</h3>
                <p className="text-xs text-slate-400">নিরাপদ ডাবল-এনক্রিপ্টেড পেমেন্ট</p>
              </div>
            </div>
            <button
              id="close-checkout"
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar (only if not on success page) */}
          {step !== 'success' && (
            <div className="bg-white px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
              <div className={`flex items-center gap-1.5 ${step === 'cart' ? 'text-emerald-600' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${step === 'cart' ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>১</span>
                <span>কার্ট তালিকা</span>
              </div>
              <div className="h-[1px] bg-slate-200 flex-1 mx-3" />
              <div className={`flex items-center gap-1.5 ${step === 'shipping' ? 'text-emerald-600' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${step === 'shipping' ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>২</span>
                <span>ঠিকানা</span>
              </div>
              <div className="h-[1px] bg-slate-200 flex-1 mx-3" />
              <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-emerald-600' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${step === 'payment' ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>৩</span>
                <span>পেমেন্ট</span>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {step === 'cart' && (
              <div className="space-y-3">
                {cart.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <span className="p-4 rounded-full bg-slate-100 text-slate-400 mb-3 block animate-bounce">🛒</span>
                    <h5 className="font-bold text-slate-700 font-display">আপনার ঝুড়ি খালি!</h5>
                    <p className="text-xs text-slate-400 mt-1">দোকান পাতা থেকে তাজা ফল যোগ করুন।</p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      ফল কিনতে যান
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest font-display">কার্টের পণ্য তালিকা</h4>
                    {cart.map((item) => (
                      <div key={item.fruit.id} className="p-3 bg-white hover:border-emerald-100 border border-slate-100 rounded-xl flex gap-3 items-center shadow-xs transition-all">
                        <img
                          src={item.fruit.image}
                          alt={item.fruit.nameBn}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-slate-800 text-sm truncate font-display">{item.fruit.nameBn}</h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-emerald-600 font-extrabold text-xs font-display">৳{item.fruit.price}</span>
                            <span className="text-[10px] text-slate-400">/ {item.fruit.unitBn}</span>
                          </div>
                        </div>

                        {/* Qty controller */}
                        <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQty(item.fruit.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-white text-slate-500 hover:text-emerald-600 rounded transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 font-bold font-display text-xs text-slate-700">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.fruit.id, Math.min(item.fruit.stock, item.quantity + 1))}
                            className="p-1 hover:bg-white text-slate-500 hover:text-emerald-600 rounded transition-colors"
                            disabled={item.quantity >= item.fruit.stock}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Delete btn */}
                        <button
                          onClick={() => onRemoveItem(item.fruit.id)}
                          className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors border border-slate-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {step === 'shipping' && (
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest font-display">ডেলিভারি ঠিকানা ও বিবরণ</h4>
                
                {/* Delivery Area Picker */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAreaChange('municipality')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center ${
                      deliveryArea === 'municipality'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-600/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-bold font-display">পাবনা পৌরসভা</span>
                    <span className="text-[10px] text-emerald-600 font-extrabold mt-1 font-display">৳৪০ ফি</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAreaChange('upazila')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center ${
                      deliveryArea === 'upazila'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-600/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-bold font-display">পাবনা অন্যান্য উপজেলা</span>
                    <span className="text-[10px] text-emerald-600 font-extrabold mt-1 font-display">৳৮০ ফি</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAreaChange('outside')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center ${
                      deliveryArea === 'outside'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-600/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-bold font-display">অন্যান্য জেলা</span>
                    <span className="text-[10px] text-emerald-600 font-extrabold mt-1 font-display">৳১৫০ ফি</span>
                  </button>
                </div>

                <div className="p-4 bg-white border border-slate-100 rounded-xl space-y-3.5 shadow-xs">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 font-display">গ্রাহকের নাম *</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${formErrors.customerName ? 'border-rose-400' : 'border-slate-200'}`}
                      placeholder="যেমন: মোঃ সাজ্জাদ হোসেন"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (e.target.value.trim()) setFormErrors(prev => ({ ...prev, customerName: '' }));
                      }}
                    />
                    {formErrors.customerName && <p className="text-xs text-rose-500 mt-1 font-semibold">{formErrors.customerName}</p>}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 font-display">১১-ডিজিটের মোবাইল নম্বর *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-sans font-semibold border-r border-slate-200 pr-2">+৮৮০</span>
                      <input
                        type="text"
                        className={`w-full pl-16 pr-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${formErrors.phone ? 'border-rose-400' : 'border-slate-200'}`}
                        placeholder="১৭৮৬৮০৩৮৯৯"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (e.target.value.trim()) setFormErrors(prev => ({ ...prev, phone: '' }));
                        }}
                      />
                    </div>
                    {formErrors.phone && <p className="text-xs text-rose-500 mt-1 font-semibold">{formErrors.phone}</p>}
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 font-display">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="customer@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Regional inputs based on Area picker */}
                  {deliveryArea !== 'outside' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1 font-display">উপজেলা / থানা</label>
                        <select
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                          value={upazila}
                          onChange={(e) => setUpazila(e.target.value)}
                        >
                          {UPASILAS_PABNA.map((u, i) => (
                            <option key={i} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1 font-display">জেলা</label>
                        <input
                          type="text"
                          disabled
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-500"
                          value="পাবনা"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1 font-display">উপজেলা / থানা</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 font-display"
                          placeholder="উপজেলার নাম দিন"
                          value={upazila}
                          onChange={(e) => setUpazila(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1 font-display">জেলা জেলা</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 font-display"
                          placeholder="জেলার নাম দিন"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Address Details */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 font-display">বিস্তারিত ডেলিভারি ঠিকানা *</label>
                    <textarea
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${formErrors.address ? 'border-rose-400' : 'border-slate-200'}`}
                      placeholder="যেমন: হাউজ নং ৪২, রোড ৩, শালগাড়ীয়া, পাবনা সদর"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (e.target.value.trim()) setFormErrors(prev => ({ ...prev, address: '' }));
                      }}
                    />
                    {formErrors.address && <p className="text-xs text-rose-500 mt-1 font-semibold">{formErrors.address}</p>}
                  </div>

                  {/* Delivery Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 font-display">ডেলিভারি নোট বা মেসেজ (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                      placeholder="যেমন: বিকেলে ৩টার পর ডেলিভারি করুন"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest font-display">পেমেন্ট মেথড ও নিশ্চিতকরণ</h4>
                
                {/* Method selector buttons */}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('bkash'); setFormErrors({}); }}
                    className={`p-2 py-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center ${
                      paymentMethod === 'bkash'
                        ? 'border-[#e2136e] bg-[#e2136e]/5 text-[#e2136e] ring-2 ring-[#e2136e]/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-extrabold text-sm mb-1">bKash</span>
                    <span className="text-[9px] font-semibold font-display">বিকাশ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('nagad'); setFormErrors({}); }}
                    className={`p-2 py-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center ${
                      paymentMethod === 'nagad'
                        ? 'border-[#f69220] bg-[#f69220]/5 text-[#f69220] ring-2 ring-[#f69220]/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-extrabold text-sm mb-1">Nagad</span>
                    <span className="text-[9px] font-semibold font-display">নগদ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('rocket'); setFormErrors({}); }}
                    className={`p-2 py-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center ${
                      paymentMethod === 'rocket'
                        ? 'border-[#8c3494] bg-[#8c3494]/5 text-[#8c3494] ring-2 ring-[#8c3494]/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-extrabold text-sm mb-1">Rocket</span>
                    <span className="text-[9px] font-semibold font-display">রকেট</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('cod'); setFormErrors({}); }}
                    className={`p-2 py-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-extrabold text-sm mb-1">C.O.D</span>
                    <span className="text-[9px] font-semibold font-display">ক্যাশ অন ডেল</span>
                  </button>
                </div>

                {/* Simulated Payment Gateway panel info */}
                {paymentMethod !== 'cod' ? (
                  <div className="p-4 bg-white border border-slate-100 rounded-xl space-y-4 shadow-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-emerald-500">
                      <p className="text-xs text-slate-600 font-display leading-5">
                        ১. আমাদের অফিসিয়াল পার্সোনাল নম্বরে মানি ট্রান্সফার করুন:<br/>
                        <span className="font-extrabold text-sm text-slate-800 font-sans tracking-wide">০১৭৮৬-৮০৩৮৯৯ (01786-803899)</span><br/>
                        ২. সেন্ড মানি (Send Money) করার পর নিচে বিস্তারিত লিখুন:
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Sender verification */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1 font-display">
                          {paymentMethod === 'bkash' ? 'বিকাশ নম্বর *' : paymentMethod === 'nagad' ? 'নগদ নম্বর *' : 'রকেট নম্বর *'}
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white transition-all ${formErrors.paymentNumber ? 'border-rose-400' : 'border-slate-200'}`}
                          placeholder="017xxxxxxxx"
                          value={paymentNumber}
                          onChange={(e) => {
                            setPaymentNumber(e.target.value);
                            if (e.target.value.trim()) setFormErrors(prev => ({ ...prev, paymentNumber: '' }));
                          }}
                        />
                        {formErrors.paymentNumber && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{formErrors.paymentNumber}</p>}
                      </div>

                      {/* Transaction reference */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1 font-display">ট্রানজেকশন আইডি (TxnID) *</label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white uppercase transition-all ${formErrors.transactionId ? 'border-rose-400' : 'border-slate-200'}`}
                          placeholder="e.g. BK82H6Z9"
                          value={transactionId}
                          onChange={(e) => {
                            setTransactionId(e.target.value);
                            if (e.target.value.trim()) setFormErrors(prev => ({ ...prev, transactionId: '' }));
                          }}
                        />
                        {formErrors.transactionId && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{formErrors.transactionId}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold bg-emerald-50 p-2 rounded">
                      <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                      <span>১২৮-বিট এসএসএল ট্রানজেকশন প্রসেসিং। পেমেন্ট যাচাইকরণের পর অর্ডার নিশ্চিত হবে।</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-white border border-slate-100 rounded-xl space-y-2 shadow-xs">
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs leading-5">
                      <p className="font-bold flex items-center gap-1 font-display">
                        <MapPin className="w-4 h-4" /> ক্যাশ অন ডেলিভারি (Cash On Delivery)
                      </p>
                      <p className="mt-1 font-display">
                        আপনার পণ্যটি আপনার হাতে পাওয়ার পর সতেজতা এবং ওজন মিলিয়ে রাইডারকে নগদ অর্থ পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'success' && placedOrder && (
              <div className="py-8 text-center space-y-5">
                <div className="relative inline-flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="p-5 bg-emerald-100 text-emerald-600 rounded-full"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 font-display">আপনার অর্ডার সম্পন্ন হয়েছে!</h3>
                  <p className="text-xs text-slate-400 mt-1 font-display">ইনভয়েস সফলভাবে প্রসেস করা হয়েছে</p>
                </div>

                {/* Receipt Board */}
                <div className="p-4 bg-white border border-dashed border-emerald-200 rounded-2xl text-left space-y-3 shadow-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">অর্ডার আইডি</span>
                    <span className="font-bold text-slate-800 font-mono tracking-wide">{placedOrder.id}</span>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-600 font-display">
                    <div className="flex justify-between">
                      <span>ক্রেতার নাম:</span>
                      <span className="font-bold text-slate-800">{placedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>মোবাইল নম্বর:</span>
                      <span className="font-semibold text-slate-800 font-sans">{placedOrder.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ঠিকানা:</span>
                      <span className="font-semibold text-slate-800 max-w-[200px] truncate">{placedOrder.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>পেমেন্ট মাধ্যম:</span>
                      <span className="font-bold text-emerald-600 uppercase">{placedOrder.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 font-display">সর্বমোট পরিশোধযোগ্য:</span>
                    <span className="text-lg font-extrabold text-emerald-600 font-display">৳{placedOrder.grandTotal}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-left text-xs leading-5">
                  <p className="font-semibold font-display">🔔 অর্ডার আইডি সংরক্ষণ করুন!</p>
                  <p className="font-display">অর্ডার আইডি (<span className="font-mono font-bold text-[11px]">{placedOrder.id}</span>) ব্যবহার করে আপনি যেকোনো সময় আপনার ডেলিভারি রাইডারের রিয়েল-টাইম লোকেশন ধাপে ধাপে ট্র্যাক করতে পারবেন।</p>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Summary & Action Footer */}
          <div className="p-5 border-t border-slate-100 bg-white">
            {step !== 'success' && (
              <div className="space-y-3 mb-4">
                <div className="space-y-1.5 text-slate-500 text-xs">
                  <div className="flex justify-between">
                    <span className="font-display">পণ্যের মোট মূল্য:</span>
                    <span className="font-bold font-display text-slate-700">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-display">ডেলিভারি চার্জ ({deliveryArea === 'municipality' ? 'পৌরসভা' : deliveryArea === 'upazila' ? 'উপজেলা' : 'অন্য জেলা'}):</span>
                    <span className="font-bold font-display text-slate-700">৳{deliveryCharge()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="font-extrabold text-slate-700 text-sm font-display">সর্বমোট পরিশোধযোগ্য মূল্য:</span>
                  <span className="text-xl font-extrabold text-emerald-600 font-display">৳{grandTotal}</span>
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            {step === 'cart' && (
              <button
                id="cart-next-btn"
                disabled={cart.length === 0}
                onClick={() => setStep('shipping')}
                className={`w-full py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition-all ${
                  cart.length > 0
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                ডেলিভারি তথ্য দিন <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'shipping' && (
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-xl transition-all"
                >
                  ফিরে যান
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateShipping()) setStep('payment');
                  }}
                  className="col-span-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  পেমেন্ট ধাপে যান <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-xl transition-all"
                >
                  ফিরে যান
                </button>
                <button
                  type="button"
                  id="checkout-finalize-btn"
                  onClick={handlePlaceOrder}
                  className="col-span-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  অর্ডার সম্পন্ন করুন <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 'success' && placedOrder && (
              <button
                id="success-track-btn"
                onClick={() => {
                  onOrderPlaced(placedOrder); // Tracks the order
                  onClose();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                রিয়েল-টাইম ডেলিভারি ট্র্যাক করুন <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
