import { Product } from '../types';

export interface CatalogPresetItem {
  name: string;
  barcode: string;
  category: Product['category'];
  pricePaise: number;
  stock: number;
  lowStockThreshold: number;
  imageUrl?: string;
  description?: string;
}

export interface CatalogPresetCategory {
  id: string;
  name: string;
  tagline: string;
  iconName: string;
  itemCountDescription: string;
  items: CatalogPresetItem[];
}

export const KIRANA_PRESET: CatalogPresetItem[] = [
  {
    name: 'Aashirvaad Superior MP Sharbati Atta 5kg',
    barcode: '8901030383847',
    category: 'Staples',
    pricePaise: 26000, // ₹260.00
    stock: 20,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80',
    description: '100% pure whole wheat stone ground flour',
  },
  {
    name: 'Fortune Sunlite Refined Sunflower Oil 1L',
    barcode: '8906007280014',
    category: 'Staples',
    pricePaise: 14500, // ₹145.00
    stock: 30,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80',
    description: 'Light, healthy enriched cooking oil',
  },
  {
    name: 'Tata Salt Vacuum Evaporated 1kg',
    barcode: '8901030383854',
    category: 'Staples',
    pricePaise: 2800, // ₹28.00
    stock: 50,
    lowStockThreshold: 15,
    imageUrl: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=300&auto=format&fit=crop&q=80',
    description: 'Desh Ka Namak with iodine assurance',
  },
  {
    name: 'India Gate Basmati Rice Rozzana 1kg',
    barcode: '8901725181214',
    category: 'Staples',
    pricePaise: 11000, // ₹110.00
    stock: 25,
    lowStockThreshold: 6,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80',
    description: 'Aromatic long grain daily basmati rice',
  },
  {
    name: 'Tata Tea Gold Leaf 500g',
    barcode: '8901030383861',
    category: 'Beverages',
    pricePaise: 29000, // ₹290.00
    stock: 18,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=300&auto=format&fit=crop&q=80',
    description: 'Rich aroma gently rolled long leaves blend',
  },
  {
    name: 'Maggi 2-Minute Masala Noodles 70g',
    barcode: '8901058852332',
    category: 'Instant Food',
    pricePaise: 1400, // ₹14.00
    stock: 40,
    lowStockThreshold: 10,
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=80',
    description: 'Iconic instant noodles with signature tastemaker',
  },
  {
    name: 'Amul Butter Pasteurised 100g',
    barcode: '8901262010107',
    category: 'Dairy',
    pricePaise: 5600, // ₹56.00
    stock: 24,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&auto=format&fit=crop&q=80',
    description: 'Utterly butterly delicious salted table butter',
  },
  {
    name: 'Amul Taaza Toned Milk 500ml',
    barcode: '8901262010053',
    category: 'Dairy',
    pricePaise: 2700, // ₹27.00
    stock: 35,
    lowStockThreshold: 10,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
    description: 'Fresh homogenized toned pasteurized milk',
  },
  {
    name: 'Parle-G Gold Biscuits 100g',
    barcode: '8901719101037',
    category: 'Snacks',
    pricePaise: 1000, // ₹10.00
    stock: 60,
    lowStockThreshold: 15,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&auto=format&fit=crop&q=80',
    description: 'Classic glucose biscuits made with milk and wheat',
  },
  {
    name: 'Dettol Original Bathing Soap 75g',
    barcode: '8901396001018',
    category: 'Personal Care',
    pricePaise: 4200, // ₹42.00
    stock: 30,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1607006311600-334714302b2d?w=300&auto=format&fit=crop&q=80',
    description: 'Antibacterial germ protection soap bar',
  },
  {
    name: 'Surf Excel Quick Wash Detergent 500g',
    barcode: '8901030383878',
    category: 'Household',
    pricePaise: 9800, // ₹98.00
    stock: 22,
    lowStockThreshold: 6,
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&auto=format&fit=crop&q=80',
    description: 'Quick stain removing washing powder',
  },
  {
    name: 'Everest Turmeric / Haldi Powder 100g',
    barcode: '8901786101010',
    category: 'Staples',
    pricePaise: 3600, // ₹36.00
    stock: 28,
    lowStockThreshold: 6,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&auto=format&fit=crop&q=80',
    description: 'Aromatic pure golden ground spice',
  },
];

export const SUPERMARKET_PRESET: CatalogPresetItem[] = [
  {
    name: "Lay's India's Magic Masala 50g",
    barcode: '8901491501019',
    category: 'Snacks',
    pricePaise: 2000, // ₹20.00
    stock: 35,
    lowStockThreshold: 12,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&auto=format&fit=crop&q=80',
    description: 'Crispy potato chips with spicy Indian masala',
  },
  {
    name: 'Kurkure Masala Munch 80g',
    barcode: '8901491361118',
    category: 'Snacks',
    pricePaise: 2000, // ₹20.00
    stock: 30,
    lowStockThreshold: 10,
    imageUrl: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=300&auto=format&fit=crop&q=80',
    description: 'Tedha hai par mera hai crispy puff snack',
  },
  {
    name: 'Pepsi 500ml Pet Bottle',
    barcode: '8901491101837',
    category: 'Beverages',
    pricePaise: 4000, // ₹40.00
    stock: 24,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&auto=format&fit=crop&q=80',
    description: 'Chilled refreshing cola drink',
  },
  {
    name: 'Coca-Cola 500ml Bottle',
    barcode: '8901764012234',
    category: 'Beverages',
    pricePaise: 4000, // ₹40.00
    stock: 26,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&auto=format&fit=crop&q=80',
    description: 'Original classic taste fizzy carbonated beverage',
  },
  {
    name: 'Cadbury Dairy Milk Silk 60g',
    barcode: '7622201736415',
    category: 'Confectionery',
    pricePaise: 8500, // ₹85.00
    stock: 25,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=300&auto=format&fit=crop&q=80',
    description: 'Silky smooth melt-in-mouth milk chocolate',
  },
  {
    name: 'Nestle KitKat 4 Finger 38g',
    barcode: '8901058859706',
    category: 'Confectionery',
    pricePaise: 3000, // ₹30.00
    stock: 35,
    lowStockThreshold: 10,
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=300&auto=format&fit=crop&q=80',
    description: 'Crisp wafer finger covered in milk chocolate',
  },
  {
    name: 'Red Bull Energy Drink 250ml',
    barcode: '8901030383830',
    category: 'Beverages',
    pricePaise: 12500, // ₹125.00
    stock: 20,
    lowStockThreshold: 6,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
    description: 'Vitalizes body and mind premium energy can',
  },
  {
    name: 'Real Fruit Power Mixed Fruit 1L',
    barcode: '8901207010018',
    category: 'Beverages',
    pricePaise: 12000, // ₹120.00
    stock: 18,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&auto=format&fit=crop&q=80',
    description: 'Delicious blend of 9 active fruit juices',
  },
  {
    name: 'Colgate MaxFresh Blue Gel 150g',
    barcode: '8901314010108',
    category: 'Personal Care',
    pricePaise: 11500, // ₹115.00
    stock: 22,
    lowStockThreshold: 6,
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&auto=format&fit=crop&q=80',
    description: 'Cooling crystals breath freshening toothpaste',
  },
  {
    name: 'Haldiram Nagpur Aloo Bhujia 150g',
    barcode: '8904004400109',
    category: 'Snacks',
    pricePaise: 5500, // ₹55.00
    stock: 30,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
    description: 'Crispy spicy spiced potato sev savoury snack',
  },
  {
    name: 'Britannia Good Day Butter 120g',
    barcode: '8901063012721',
    category: 'Snacks',
    pricePaise: 2500, // ₹25.00
    stock: 40,
    lowStockThreshold: 10,
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&auto=format&fit=crop&q=80',
    description: 'Rich buttery cookies with cashew hints',
  },
  {
    name: 'Thums Up Charged 500ml',
    barcode: '8901030018541',
    category: 'Beverages',
    pricePaise: 4000, // ₹40.00
    stock: 24,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&auto=format&fit=crop&q=80',
    description: 'Bold spicy strong Indian cola',
  },
];

export const CONVENIENCE_PRESET: CatalogPresetItem[] = [
  {
    name: 'Red Bull Energy Drink 250ml',
    barcode: '8901030383830',
    category: 'Beverages',
    pricePaise: 12500,
    stock: 15,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
    description: 'Chilled energy drink can',
  },
  {
    name: 'Pepsi 500ml Pet Bottle',
    barcode: '8901491101837',
    category: 'Beverages',
    pricePaise: 4000,
    stock: 20,
    lowStockThreshold: 6,
    imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&auto=format&fit=crop&q=80',
    description: '500ml chilled carbonated cola',
  },
  {
    name: "Lay's India's Magic Masala 50g",
    barcode: '8901491501019',
    category: 'Snacks',
    pricePaise: 2000,
    stock: 25,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&auto=format&fit=crop&q=80',
    description: 'Grab and go potato chips pack',
  },
  {
    name: 'Nestle KitKat 4 Finger 38g',
    barcode: '8901058859706',
    category: 'Confectionery',
    pricePaise: 3000,
    stock: 30,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=300&auto=format&fit=crop&q=80',
    description: 'Quick break crispy chocolate wafer',
  },
  {
    name: 'Kinley Packaged Water 1L',
    barcode: '8901764021014',
    category: 'Beverages',
    pricePaise: 2000,
    stock: 40,
    lowStockThreshold: 10,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=300&auto=format&fit=crop&q=80',
    description: 'Pure purified mineral water bottle',
  },
  {
    name: 'Maggi Cuppa Masala 70g',
    barcode: '8901058852998',
    category: 'Instant Food',
    pricePaise: 5000,
    stock: 18,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=80',
    description: 'Instant cuppa noodles just add hot water',
  },
  {
    name: 'Snickers Peanut Chocolate Bar 45g',
    barcode: '8901491103015',
    category: 'Confectionery',
    pricePaise: 4500,
    stock: 25,
    lowStockThreshold: 6,
    imageUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=300&auto=format&fit=crop&q=80',
    description: 'Caramel nougat peanut hunger bar',
  },
  {
    name: 'Orbit Spearmint Sugarfree Gum',
    barcode: '8901491102018',
    category: 'Confectionery',
    pricePaise: 1000,
    stock: 50,
    lowStockThreshold: 15,
    imageUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=300&auto=format&fit=crop&q=80',
    description: 'Long lasting fresh breath pocket pack',
  },
];

export const BAKERY_CAFE_PRESET: CatalogPresetItem[] = [
  {
    name: 'Fresh Artisan Sourdough Loaf 400g',
    barcode: '8906001010014',
    category: 'Bakery',
    pricePaise: 9500, // ₹95.00
    stock: 15,
    lowStockThreshold: 4,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
    description: 'Freshly baked naturally fermented crusty bread',
  },
  {
    name: 'Double Chocolate Chip Cookie',
    barcode: '8906001010021',
    category: 'Bakery',
    pricePaise: 4500, // ₹45.00
    stock: 25,
    lowStockThreshold: 6,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&auto=format&fit=crop&q=80',
    description: 'Chewy artisan cookie with Belgian chocolate chips',
  },
  {
    name: 'Blueberry Crumble Muffin',
    barcode: '8906001010038',
    category: 'Bakery',
    pricePaise: 6500, // ₹65.00
    stock: 20,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300&auto=format&fit=crop&q=80',
    description: 'Soft butter muffin loaded with real blueberries',
  },
  {
    name: 'Cold Brew Arabica Coffee 200ml',
    barcode: '8906001010045',
    category: 'Beverages',
    pricePaise: 11000, // ₹110.00
    stock: 18,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop&q=80',
    description: '18-hour steeped single-origin dark roast cold brew',
  },
  {
    name: 'Butter Croissant Traditional',
    barcode: '8906001010052',
    category: 'Bakery',
    pricePaise: 7500, // ₹75.00
    stock: 16,
    lowStockThreshold: 4,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80',
    description: 'Flaky golden layered French butter pastry',
  },
  {
    name: 'Sparkling Mineral Water 330ml',
    barcode: '8906001010083',
    category: 'Beverages',
    pricePaise: 6000, // ₹60.00
    stock: 30,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1559839914-ba2ac6e2c34d?w=300&auto=format&fit=crop&q=80',
    description: 'Zero calorie crisp refreshing effervescent water',
  },
];

export const CATALOG_PRESET_CATEGORIES: CatalogPresetCategory[] = [
  {
    id: 'kirana',
    name: 'Kirana & Grocery Starter Pack',
    tagline: 'Standard Indian household staples, grains, dairy & fast daily movers',
    iconName: 'Store',
    itemCountDescription: '12 Essential FMCG & Kirana Items',
    items: KIRANA_PRESET,
  },
  {
    id: 'supermarket',
    name: 'Supermarket & FMCG Pack',
    tagline: 'High-volume branded snacks, soft drinks, chocolates & personal care',
    iconName: 'ShoppingBag',
    itemCountDescription: '12 Popular Packaged Supermarket Items',
    items: SUPERMARKET_PRESET,
  },
  {
    id: 'convenience',
    name: 'Convenience / Quick Stop Pack',
    tagline: 'On-the-go beverages, instant foods, mints and quick impulse bites',
    iconName: 'Zap',
    itemCountDescription: '8 High-Impulse Convenience Products',
    items: CONVENIENCE_PRESET,
  },
  {
    id: 'bakery-cafe',
    name: 'Bakery, Cafe & Confectionery',
    tagline: 'Artisan bakery treats, fresh loaves, cold brew & premium drinks',
    iconName: 'Coffee',
    itemCountDescription: '6 Artisan Cafe & Pastry Items',
    items: BAKERY_CAFE_PRESET,
  },
];

export function getPresetForCategory(category: string): CatalogPresetItem[] {
  switch (category) {
    case 'kirana':
    case 'grocery':
      return KIRANA_PRESET;
    case 'supermarket':
    case 'general-store':
    case 'fmcg':
      return SUPERMARKET_PRESET;
    case 'convenience':
      return CONVENIENCE_PRESET;
    case 'bakery-cafe':
      return BAKERY_CAFE_PRESET;
    default:
      return KIRANA_PRESET;
  }
}
