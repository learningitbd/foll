import React from 'react';
import { FruitItem } from '../types';
import { X, Calendar, Award, ThumbsUp, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FruitDetailsModalProps {
  fruit: FruitItem | null;
  onClose: () => void;
  onAddToCart: (fruit: FruitItem) => void;
}

export const FruitDetailsModal: React.FC<FruitDetailsModalProps> = ({
  fruit,
  onClose,
  onAddToCart,
}) => {
  if (!fruit) return null;

  return (
    <AnimatePresence>
      <div id="fruit-details-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          id="fruit-details-modal-content"
          className="relative w-full max-w-2xl overflow-hidden bg-white rounded-2xl shadow-2xl md:grid md:grid-cols-12 max-h-[90vh] md:max-h-none overflow-y-auto"
        >
          {/* Close button */}
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-500 transition-colors bg-white/80 backdrop-blur-md rounded-full hover:bg-white hover:text-gray-800 shadow"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image & Season */}
          <div className="relative md:col-span-5 h-64 md:h-full min-h-[250px] bg-emerald-50">
            <img
              src={fruit.image}
              alt={fruit.nameBn}
              className="object-cover w-full h-full"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent md:hidden" />
            
            {/* Season Badge on Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 rounded-full shadow-md">
                <Calendar className="w-3.5 h-3.5" />
                {fruit.seasonBn} ({fruit.seasonEn})
              </span>
              {fruit.isSeasonalPick && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-amber-500 rounded-full shadow-md">
                  <Award className="w-3.5 h-3.5" />
                  সেরা পছন্দ
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white md:hidden">
              <h2 className="text-2xl font-bold font-display">{fruit.nameBn}</h2>
              <p className="text-xs text-slate-200">{fruit.nameEn}</p>
            </div>
          </div>

          {/* Right Column: Information & Add to Cart */}
          <div className="p-6 md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Desktop Title Header */}
              <div className="hidden md:block mb-4">
                <h2 className="text-2xl font-extrabold text-slate-900 font-display">{fruit.nameBn}</h2>
                <p className="text-sm font-semibold text-slate-400 font-display uppercase tracking-wider">{fruit.nameEn}</p>
              </div>

              {/* Price & Rating */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-emerald-600 font-display">৳{fruit.price}</span>
                  <span className="text-sm text-slate-500">/ {fruit.unitBn}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg">
                  <span className="text-amber-500 font-bold">★ {fruit.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({fruit.reviewsCount}+ রিভিউ)</span>
                </div>
              </div>

              {/* Description */}
              <div className="my-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">ফলের বৈশিষ্ট্য</h3>
                <p className="text-slate-600 text-sm leading-relaxed leading-6">{fruit.descriptionBn}</p>
              </div>

              {/* Nutritional Benefits */}
              <div className="my-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 font-display">স্বাস্থ্য উপকারিতা ও পুষ্টিগুণ</h3>
                <ul className="flex flex-col gap-2">
                  {fruit.benefitsBn.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-600 mt-0.5 flex-shrink-0">
                        <Heart className="w-3 h-3 fill-emerald-500" />
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">স্টক অবস্থা</span>
                {fruit.stock > 0 ? (
                  <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded mt-0.5">
                    মজুদ আছে: {fruit.stock} {fruit.unitBn}
                  </span>
                ) : (
                  <span className="text-rose-500 text-xs font-semibold bg-rose-50 px-2 py-0.5 rounded mt-0.5">
                    স্টক ফুরিয়ে গেছে
                  </span>
                )}
              </div>

              <button
                id="modal-add-to-cart-btn"
                disabled={fruit.stock === 0}
                onClick={() => {
                  onAddToCart(fruit);
                  onClose();
                }}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all ${
                  fruit.stock > 0 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200/50 hover:shadow-lg active:scale-95' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {fruit.stock > 0 ? 'কার্টে যুক্ত করুন (৳' + fruit.price + ')' : 'স্টক শেষ'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
