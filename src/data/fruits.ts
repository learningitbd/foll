import { FruitItem } from '../types';

export const INITIAL_FRUITS: FruitItem[] = [
  {
    id: 'himsagar-mango',
    nameBn: 'প্রিমিয়াম হিমসাগর আম',
    nameEn: 'Premium Himsagar Mango',
    price: 130,
    unitBn: 'কেজি',
    unitEn: 'kg',
    stock: 250,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
    isSeasonalPick: true,
    seasonEn: 'Summer',
    seasonBn: 'গ্রীষ্মকাল',
    descriptionBn: 'রাজশাহীর বিখ্যাত এবং অত্যন্ত সুস্বাদু আঁশহীন হিমসাগর আম। মিষ্টি ও দারুণ সুবাসে ভরপুর একদম গাছপাকা ও প্রাকৃতিকভাবে সংগ্রহিত।',
    benefitsBn: [
      'প্রচুর পরিমাণে ভিটামিন-এ এবং সি রয়েছে যা রোগ প্রতিরোধ ক্ষমতা বাড়ায়।',
      'আঁশযুক্ত হওয়ায় হজম প্রক্রিয়াকে উন্নত করতে সাহায্য করে।',
      'ত্বকের উজ্জ্বলতা বাড়াতে এবং চোখের জ্যোতি সতেজ রাখতে অত্যন্ত কার্যকরী।'
    ],
    rating: 4.9,
    reviewsCount: 145
  },
  {
    id: 'rajshahi-litchi',
    nameBn: 'রসালো বোম্বাই লিচু',
    nameEn: 'Juicy Bombay Litchi',
    price: 450,
    unitBn: '১০০ পিস',
    unitEn: '100 pcs',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
    isSeasonalPick: true,
    seasonEn: 'Summer',
    seasonBn: 'গ্রীষ্মকাল',
    descriptionBn: 'টকটকে লাল রঙের পাকা মিষ্টি এবং রসালো বোম্বাই লিচু। পাবনা ও ঈশ্বরদীর বাগান থেকে সরাসরি অর্ডার পাওয়ার পর পেড়ে সরবরাহ করা হয়।',
    benefitsBn: [
      'ভিটামিন সি এবং বি-কমপ্লেক্সের দারুণ উৎসব যা শরীরে এনার্জি যোগায়।',
      'পটাশিয়াম ও কপার সমৃদ্ধ যা হৃদযন্ত্র ভালো রাখতে সাহায্য করে।',
      'শরীরে পানিশূন্যতা দূর করে নিমেষেই ক্লান্তি ভাব কমায়।'
    ],
    rating: 4.8,
    reviewsCount: 98
  },
  {
    id: 'pabna-jackfruit',
    nameBn: 'মিষ্টি পাবনা কাঁঠাল',
    nameEn: 'Sweet Pabna Jackfruit',
    price: 180,
    unitBn: 'পিস',
    unitEn: 'pc',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1590005354167-6da97870c913?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
    isSeasonalPick: false,
    seasonEn: 'Summer',
    seasonBn: 'গ্রীষ্মকাল',
    descriptionBn: 'আমাদের জাতীয় ফল কাঁঠাল, পুষ্টিকর আর রসালো কোষে ভরা। পাবনার গ্রামীণ বাগান থেকে আনা সম্পূর্ণ কেমিক্যালমুক্ত মিষ্টি কাঁঠাল।',
    benefitsBn: [
      'প্রোটিন, ক্যালসিয়াম এবং আয়রনের চমৎকার উৎস।',
      'আঁশযুক্ত হওয়ায় কোষ্ঠকাঠিন্য দূর করতে দারুণ ভূমিকা রাখে।',
      'হাড় মজবুত করে এবং রোগ প্রতিরোধে সাহায্য করে।'
    ],
    rating: 4.6,
    reviewsCount: 52
  },
  {
    id: 'organic-guava',
    nameBn: 'তাজা থাই পেয়ারা',
    nameEn: 'Fresh Thai Guava',
    price: 90,
    unitBn: 'কেজি',
    unitEn: 'kg',
    stock: 180,
    image: 'https://images.unsplash.com/photo-1534080391025-a7db4952085f?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
    isSeasonalPick: true,
    seasonEn: 'Monsoon',
    seasonBn: 'বর্ষাকাল',
    descriptionBn: 'কুড়কুড়ে ও দারুণ মিষ্টি থাই পেয়ারা। সম্পূর্ণ প্রাকৃতিক উপায়ে চাষ করা এবং স্বাস্থ্যের জন্য অত্যন্ত উপকারী।',
    benefitsBn: [
      'কমলার চেয়েও ৪ গুণ বেশি ভিটামিন-সি সমৃদ্ধ যা ত্বককে সতেজ রাখে।',
      'রক্তে শর্করার মাত্রা নিয়ন্ত্রণে সাহায্য করে, তাই ডায়াবেটিস রোগীদের জন্য চমৎকার।',
      'চোখের স্বাস্থ্য উন্নত করে এবং হজমশক্তি বাড়ায়।'
    ],
    rating: 4.7,
    reviewsCount: 84
  },
  {
    id: 'sweet-watermelon',
    nameBn: 'রসালো লাল তরমুজ',
    nameEn: 'Sweet Red Watermelon',
    price: 280,
    unitBn: 'পিস',
    unitEn: 'pc',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
    isSeasonalPick: true,
    seasonEn: 'Summer',
    seasonBn: 'গ্রীষ্মকাল',
    descriptionBn: 'প্রচণ্ড গরমে শরীরে প্রশান্তি এনে দিতে লাল টকটকে মিষ্টি তরমুজে জুড়ি মেলা ভার। তরতাজা পিস প্রতি ওজনে বেশ বড় সাইজের তরমুজ।',
    benefitsBn: [
      '৯২% পানি সমৃদ্ধ হওয়ায় প্রচণ্ড গরমে ডিহাইড্রেশন প্রতিরোধ করে।',
      'লাইকোপেন নামক শক্তিশালী অ্যান্টিঅক্সিডেন্ট রয়েছে যা হার্ট ও ত্বকের সুরক্ষায় জরুরি।',
      'শরীরের পেশী ব্যথা কমাতে এবং ক্লান্তি দূর করতে দারুণ উপকারী।'
    ],
    rating: 4.9,
    reviewsCount: 112
  },
  {
    id: 'green-coconut',
    nameBn: 'কচি ডাব (পাবনা বিশেষ)',
    nameEn: 'Tender Green Coconut',
    price: 110,
    unitBn: 'পিস',
    unitEn: 'pc',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1525385794028-ac0d691befb3?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
    isSeasonalPick: false,
    seasonEn: 'Year-round',
    seasonBn: 'বারোমাসি',
    descriptionBn: 'পাবনার তাজা গাছের কচি ডাব। প্রচুর মিষ্টি পানি এবং নরম কচি শাঁস সমৃদ্ধ যা তাৎক্ষণিক শক্তি ও পুষ্টি যোগায়।',
    benefitsBn: [
      'প্রাকৃতিক ইলেক্ট্রোলাইট সমৃদ্ধ যা তাৎক্ষণিকভাবে শরীরে পানির ভারসাম্য ফিরিয়ে আনে।',
      'কিডনির কার্যকারিতা সচল রাখতে দারুণ সাহায্য করে।',
      'শরীর ঠাণ্ডা রাখে এবং হজমশক্তি বাড়াতে সহায়তা করে।'
    ],
    rating: 4.9,
    reviewsCount: 230
  },
  {
    id: 'madhupur-pineapple',
    nameBn: 'হানিকুইন আনারস',
    nameEn: 'Honeyqueen Pineapple',
    price: 55,
    unitBn: 'পিস',
    unitEn: 'pc',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
    isSeasonalPick: false,
    seasonEn: 'Monsoon',
    seasonBn: 'বর্ষাকাল',
    descriptionBn: 'মধুপুরের বিখ্যাত মিষ্টি জাতের হানিকুইন আনারস। সুগন্ধি ও রসে টইটম্বুর, কোনো ধরনের কৃত্রিম হরমোন ছাড়া পাকার কারণে এর স্বাদ অতুলনীয়।',
    benefitsBn: [
      'ব্রোমেলিন নামক পাচক এনজাইম রয়েছে যা খাবার দ্রুত হজমে দারুণ সাহায্য করে।',
      'প্রচুর ভিটামিন-সি ও খনিজ উপাদান যা সর্দি-কাশি প্রতিরোধী।',
      'হাড়ের গঠনে অত্যন্ত কার্যকরী ভূমিকা পালন করে।'
    ],
    rating: 4.5,
    reviewsCount: 41
  },
  {
    id: 'sweet-banana',
    nameBn: 'সবরি কলা (অর্গানিক)',
    nameEn: 'Organic Sabri Banana',
    price: 90,
    unitBn: 'ডজন',
    unitEn: 'dozen',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
    isSeasonalPick: false,
    seasonEn: 'Year-round',
    seasonBn: 'বারোমাসি',
    descriptionBn: 'সুস্বাধু ও নরম সুগন্ধি সবরি কলা। সম্পূর্ণ কেমিক্যালমুক্ত কলার ছড়া থেকে প্রতিদিন সকালে সংগৃহীত একদম প্রাকৃতিক ফল।',
    benefitsBn: [
      'পটাশিয়াম সমৃদ্ধ যা উচ্চ রক্তচাপ নিয়ন্ত্রণে ভীষণ উপযোগী।',
      'তাৎক্ষণিকভাবে শরীরে শক্তি যোগাতে এর জুড়ি মেলা ভার।',
      'মলাশয়ের স্বাস্থ্য ভালো রাখে এবং কোষ্ঠকাঠিন্যে উপশম দেয়।'
    ],
    rating: 4.8,
    reviewsCount: 167
  },
  {
    id: 'papaya-fresh',
    nameBn: 'পাকা পেঁপে (অর্গানিক)',
    nameEn: 'Ripe Honey Papaya',
    price: 110,
    unitBn: 'কেজি',
    unitEn: 'kg',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1610832958506-ee5633619144?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
    isSeasonalPick: false,
    seasonEn: 'Year-round',
    seasonBn: 'বারোমাসি',
    descriptionBn: 'গাছপাকা অসম্ভব মিষ্টি দেশি পাকা পেঁপে। পেটের পীড়া বা কোষ্ঠকাঠিন্যের জন্য পরম উপকারী এক প্রাকৃতিক মহাঔষধ।',
    benefitsBn: [
      'প্যাপাইন এনজাইম সমৃদ্ধ যা হজম ক্ষমতা বহুগুণ ভালো করে ও পেট পরিষ্কার রাখে।',
      'এন্টিঅক্সিডেন্ট ও বিটা-ক্যারোটিন সমৃদ্ধ যা ত্বকে বার্ধক্যের ছাপ রোধ করে।',
      'রক্তের কোলেস্টেরল কমায় ও হৃদযন্ত্রের যত্ন নেয়।'
    ],
    rating: 4.7,
    reviewsCount: 79
  },
  {
    id: 'sour-starfruit',
    nameBn: 'মিষ্টি-টক কামরাঙা',
    nameEn: 'Sweet-Sour Starfruit',
    price: 80,
    unitBn: 'কেজি',
    unitEn: 'kg',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=600&auto=format&fit=crop',
    isAvailable: false,
    isSeasonalPick: false,
    seasonEn: 'Autumn',
    seasonBn: 'শরৎ-হেমন',
    descriptionBn: 'ভিটামিন এবং পুষ্টিগুণে ভরপুর টক-মিষ্টি স্বাদের তাজা কামরাঙা। সম্পূর্ণ কেমিক্যাল ছাড়াই লাল মাটি ও পাবনার প্রাকৃতিক বাগানে চাষকৃত।',
    benefitsBn: [
      'ভিটামিন সি এর দারুণ ভাণ্ডার যা দাঁতের মাড়িকে সুস্থ রাখে।',
      'শরীরের মেটাবলিজম বাড়িয়ে চর্বি নিয়ন্ত্রণে সহায়তা করে।',
      'ঠাণ্ডা লাগা এবং জ্বর উপশমে সাহায্য করে।'
    ],
    rating: 4.4,
    reviewsCount: 23
  }
];
