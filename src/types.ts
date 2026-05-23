export interface FruitItem {
  id: string;
  nameBn: string;
  nameEn: string;
  price: number; // in BDT
  unitBn: string; // e.g., "কেজি", "পিস", "১০০টি"
  unitEn: string; // e.g., "kg", "pc", "100 pcs"
  stock: number;
  image: string;
  isAvailable: boolean;
  isSeasonalPick: boolean;
  seasonEn: 'Summer' | 'Monsoon' | 'Autumn' | 'Winter' | 'Year-round';
  seasonBn: 'গ্রীষ্মকাল' | 'বর্ষাকাল' | 'শরৎ-হেমন' | 'শীতকাল' | 'বারোমাসি';
  descriptionBn: string;
  benefitsBn: string[];
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  fruit: FruitItem;
  quantity: number;
}

export type OrderStatus = 'pending' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface TrackingUpdate {
  status: OrderStatus;
  titleBn: string;
  titleEn: string;
  time: string;
  noteBn: string;
  noteEn: string;
}

export interface OrderItem {
  fruitId: string;
  nameBn: string;
  nameEn: string;
  quantity: number;
  price: number;
  unitBn: string;
  unitEn: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  upazila: string;
  district: string;
  totalAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'cod';
  paymentNumber?: string;
  transactionId?: string;
  status: OrderStatus;
  date: string; // ISO string
  items: OrderItem[];
  trackingUpdates: TrackingUpdate[];
  notes?: string;
}

export interface CustomerMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  date: string;
  isRead: boolean;
}
