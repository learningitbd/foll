import { Order, CustomerMessage } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'SF-94821',
    customerName: 'মোঃ সাজ্জাদ হোসেন',
    phone: '01712-345678',
    email: 'sajjad.pabna@gmail.com',
    address: 'বাড়ি নং ৪৫/এ, শালগাড়ীয়া (পাবনা স্টেডিয়াম সংলগ্ন)',
    upazila: 'পাবনা সদর',
    district: 'পাবনা',
    totalAmount: 650,
    deliveryCharge: 40,
    grandTotal: 690,
    paymentMethod: 'bkash',
    paymentNumber: '01712345678',
    transactionId: 'BK82H6Z9D1',
    status: 'delivered',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    items: [
      {
        fruitId: 'himsagar-mango',
        nameBn: 'প্রিমিয়াম হিমসাগর আম',
        nameEn: 'Premium Himsagar Mango',
        quantity: 5,
        price: 130,
        unitBn: 'কেজি',
        unitEn: 'kg'
      }
    ],
    trackingUpdates: [
      {
        status: 'pending',
        titleBn: 'অর্ডার গৃহীত হয়েছে',
        titleEn: 'Order Received',
        time: new Date(Date.now() - 2.1 * 24 * 60 * 60 * 1000).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(Date.now() - 2.1 * 24 * 60 * 60 * 1000).toLocaleDateString('bn-BD'),
        noteBn: 'আপনার অর্ডারটি সিজনাল ফল পোর্টালে যুক্ত হয়েছে।',
        noteEn: 'Your order was successfully submitted.'
      },
      {
        status: 'packed',
        titleBn: 'প্যাকিং সম্পন্ন',
        titleEn: 'Packed',
        time: new Date(Date.now() - 1.9 * 24 * 60 * 60 * 1000).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(Date.now() - 1.9 * 24 * 60 * 60 * 1000).toLocaleDateString('bn-BD'),
        noteBn: 'বাগান থেকে তাজা ফল সংগ্রহ করে সতেজ অবস্থায় প্যাকিং করা হয়েছে।',
        noteEn: 'Fresh fruits harvested and carefully packed.'
      },
      {
        status: 'shipped',
        titleBn: 'ডেলিভারি হাবে প্রেরিত',
        titleEn: 'Shipped',
        time: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toLocaleDateString('bn-BD'),
        noteBn: 'পাবনার হাব থেকে ডেলিভারি রাইডারের নিকট হস্তান্তর করা হয়েছে।',
        noteEn: 'Dispatched from Pabna local fulfillment hub.'
      },
      {
        status: 'delivered',
        titleBn: 'সফলভাবেdelivered',
        titleEn: 'Delivered',
        time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('bn-BD'),
        noteBn: 'আপনার ঠিকানায় পণ্যটি সফলভাবে হস্তান্তর করা হয়েছে। ধন্যবাদ সিজনাল ফল-এর সাথে থাকার জন্য!',
        noteEn: 'Items safely hand-delivered. Thank you for choosing Seasonal Fruits!'
      }
    ],
    notes: 'বিকেলে ডেলিভারি দিলে ভালো হয়।'
  },
  {
    id: 'SF-58301',
    customerName: 'ড. ফারহানা ইয়াসমিন',
    phone: '01823-998877',
    email: 'farhana.y@gmail.com',
    address: 'মহিলা কলেজ রোড, দক্ষিণ রাঘবপুর',
    upazila: 'পাবনা সদর',
    district: 'পাবনা',
    totalAmount: 1180,
    deliveryCharge: 40,
    grandTotal: 1220,
    paymentMethod: 'cod',
    status: 'shipped',
    date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    items: [
      {
        fruitId: 'rajshahi-litchi',
        nameBn: 'রসালো বোম্বাই লিচু',
        nameEn: 'Juicy Bombay Litchi',
        quantity: 2,
        price: 450,
        unitBn: '১০০ পিস',
        unitEn: '100 pcs'
      },
      {
        fruitId: 'pabna-jackfruit',
        nameBn: 'মিষ্টি পাবনা কাঁঠাল',
        nameEn: 'Sweet Pabna Jackfruit',
        quantity: 1,
        price: 180,
        unitBn: 'পিস',
        unitEn: 'pc'
      },
      {
        fruitId: 'green-coconut',
        nameBn: 'কচি ডাব (পাবনা বিশেষ)',
        nameEn: 'Tender Green Coconut',
        quantity: 1,
        price: 110,
        unitBn: 'পিস',
        unitEn: 'pc'
      }
    ],
    trackingUpdates: [
      {
        status: 'pending',
        titleBn: 'অর্ডার গৃহীত হয়েছে',
        titleEn: 'Order Received',
        time: new Date(Date.now() - 18 * 60 * 60 * 1000).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(Date.now() - 18 * 60 * 60 * 1000).toLocaleDateString('bn-BD'),
        noteBn: 'আপনার অর্ডারটি সিজনাল ফল পোর্টালে যুক্ত হয়েছে। ক্যাশ অন ডেলিভারিতে অর্থ পরিশোধ করা হবে।',
        noteEn: 'Your cash-on-delivery order was successfully submitted.'
      },
      {
        status: 'packed',
        titleBn: 'প্যাকিং সম্পন্ন',
        titleEn: 'Packed',
        time: new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleDateString('bn-BD'),
        noteBn: 'তাজা সতেজ ফল যত্ন সহকারে ঝুড়িতে প্যাকিং করা হয়েছে।',
        noteEn: 'Items packed in eco-friendly baskets.'
      },
      {
        status: 'shipped',
        titleBn: 'রাইডার পণ্যসহ রওনা হয়েছেন',
        titleEn: 'Out for Delivery / Shipped',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleDateString('bn-BD'),
        noteBn: 'ডেলিভারি রাইডার মো: হাবিবুর রহমান (০১৭৮৯-১১২২৩৪) আপনার ঠিকানার উদ্দেশ্যে রওনা হয়েছেন।',
        noteEn: 'Rider Md. Habibur Rahman (01789-112234) is delivering your order shortly.'
      }
    ]
  },
  {
    id: 'SF-10492',
    customerName: 'তাহমিদুল আলম',
    phone: '01511-223344',
    address: 'গ্রাম: কাচারীপাড়া, জিপিও ৬৬০০',
    upazila: 'পাবনা সদর',
    district: 'পাবনা',
    totalAmount: 110,
    deliveryCharge: 40,
    grandTotal: 150,
    paymentMethod: 'nagad',
    paymentNumber: '01511223344',
    transactionId: 'NG91K3B8W',
    status: 'pending',
    date: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 mins ago
    items: [
      {
        fruitId: 'green-coconut',
        nameBn: 'কচি ডাব (পাবনা বিশেষ)',
        nameEn: 'Tender Green Coconut',
        quantity: 1,
        price: 110,
        unitBn: 'পিস',
        unitEn: 'pc'
      }
    ],
    trackingUpdates: [
      {
        status: 'pending',
        titleBn: 'অর্ডার জমা হয়েছে',
        titleEn: 'Order Submitted',
        time: new Date(Date.now() - 3 * 60 * 1000).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(Date.now() - 3 * 60 * 1000).toLocaleDateString('bn-BD'),
        noteBn: 'আপনার অর্ডারটি এবং নাগাদ পেমেন্ট যাচাইকরণের জন্য অপেক্ষাধীন রয়েছে।',
        noteEn: 'Your order was submitted and payment verification is pending.'
      }
    ]
  }
];

export const INITIAL_MESSAGES: CustomerMessage[] = [
  {
    id: 'msg-1',
    name: 'আশরাফুল ইসলাম',
    phone: '01711-121212',
    email: 'ashraf@gmail.com',
    message: 'আপনাদের এখানে কি আমের বড় পাইকারি লট পাওয়া যাবে? আমি পাবনা থেকে ঢাকার জন্য প্রায় ৫০০ কেজি আম নিতে চাচ্ছি। দরদাম নিয়ে কথা বলা যাবে কি?',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false
  },
  {
    id: 'msg-2',
    name: 'রওশন আরা সীমা',
    phone: '01988-776655',
    message: 'লিচুগুলো কি কেমিক্যালমুক্ত? আমার ১ বছরের বাচ্চার জন্য নেব। আশা করি পুরোপুরি তাজা জিনিসটিই পাব। আজ অর্ডার দিলে কাল সকালের মধ্যে শালগাড়ীয়াতে পাব কি?',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: true
  }
];
