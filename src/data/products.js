export const categories = [
  {
    id: 'fresh',
    name: 'Fresh Market',
    tagline: 'Farm-Fresh Daily',
    desc: 'Handpicked crisp vegetables, fresh regional fruits, organic greens and dairy directly from local farms every morning at 5 AM.',
    color: '#10b981',
    accent: '#059669',
    icon: 'leaf',
    items: ['Malabar Bananas', 'Hydroponic Lettuce', 'Organic Avocados', 'Fresh Farm Milk', 'Free Range Eggs', 'Vellayani Cucumbers']
  },
  {
    id: 'bakery',
    name: 'Artisan Bakery',
    tagline: 'Baked Fresh Every Hour',
    desc: 'Oven-warm sourdough, golden buttery croissants, Malabar tea cakes, and handcrafted European artisan breads.',
    color: '#f59e0b',
    accent: '#d97706',
    icon: 'croissant',
    items: ['Sourdough Country Loaf', 'Butter Croissants', 'Cardamom Tea Cake', 'Garlic Herb Baguettes', 'Multigrain Rolls']
  },
  {
    id: 'grocery',
    name: 'Everyday Essentials',
    tagline: 'Your Complete Pantry',
    desc: 'Premium Matta & Basmati rice, cold-pressed oils, pure Wayanad spices, pulses, gourmet sauces and international delicacies.',
    color: '#3b82f6',
    accent: '#2563eb',
    icon: 'shopping-basket',
    items: ['Palakkadan Matta Rice', 'Wayanad Cardamom & Pepper', 'Cold Pressed Coconut Oil', 'Imported Olive Oil', 'Whole Grain Oats']
  },
  {
    id: 'meat-seafood',
    name: 'Meat & Seafood',
    tagline: 'Freshness You Can See',
    desc: 'Daily Arabian Sea catch, certified fresh halal cuts, cleaned and temperature-controlled for peak flavour and safety.',
    color: '#ef4444',
    accent: '#dc2626',
    icon: 'fish',
    items: ['Fresh Kingfish (Neymeen)', 'Tiger Prawns', 'Farm-Fresh Tender Chicken', 'Prime Mutton Cuts', 'Fresh Salmon Fillet']
  },
  {
    id: 'home',
    name: 'Home & Living',
    tagline: 'Make Home Feel Extra',
    desc: 'Modern kitchenware, smart storage systems, premium cast iron cookware, aromatic diffusers and eco-friendly cleaning solutions.',
    color: '#8b5cf6',
    accent: '#7c3aed',
    icon: 'home',
    items: ['Tri-Ply Stainless Cookware', 'Airtight Glass Canisters', 'Cast Iron Skillets', 'Organic Room Sprays', 'Smart Microfiber Mops']
  },
  {
    id: 'family',
    name: 'Family Zone',
    tagline: 'Delight For Everyone',
    desc: 'Educational toys, premium school stationery, baby care essentials, party novelties, and wholesome snacks.',
    color: '#ec4899',
    accent: '#db2777',
    icon: 'smile',
    items: ['STEM Learning Kits', 'Eco Wooden Toys', 'Premium Art Supplies', 'Gentle Baby Care', 'Family Board Games']
  }
];

export const deals = [
  {
    id: 'd1',
    category: 'Fresh Produce',
    name: 'Alphonso Mangoes (Farm Select 1kg)',
    originalPrice: 380,
    dealPrice: 289,
    discount: '24% OFF',
    tag: 'MEGA DEAL',
    image: '🥭',
    badgeColor: '#10b981',
    stockLeft: 18
  },
  {
    id: 'd2',
    category: 'Artisan Bakery',
    name: 'French Butter Croissant (Pack of 4)',
    originalPrice: 280,
    dealPrice: 199,
    discount: '29% OFF',
    tag: 'BAKED TODAY',
    image: '🥐',
    badgeColor: '#f59e0b',
    stockLeft: 12
  },
  {
    id: 'd3',
    category: 'Kerala Staples',
    name: 'Palakkadan Matta Rice (5kg Premium)',
    originalPrice: 395,
    dealPrice: 319,
    discount: '20% OFF',
    tag: 'WEEKEND EXTRA',
    image: '🌾',
    badgeColor: '#3b82f6',
    stockLeft: 45
  },
  {
    id: 'd4',
    category: 'Pantry Essential',
    name: 'Pure Virgin Coconut Oil (1 Litre)',
    originalPrice: 420,
    dealPrice: 325,
    discount: '23% OFF',
    tag: 'SUPER VALUE',
    image: '🥥',
    badgeColor: '#06b6d4',
    stockLeft: 29
  },
  {
    id: 'd5',
    category: 'Meat & Seafood',
    name: 'Fresh Arabian Sea Tiger Prawns (500g)',
    originalPrice: 550,
    dealPrice: 410,
    discount: '25% OFF',
    tag: 'CATCH OF THE DAY',
    image: '🦐',
    badgeColor: '#ef4444',
    stockLeft: 8
  },
  {
    id: 'd6',
    category: 'Home & Kitchen',
    name: 'Tri-Ply Stainless Steel Kadai (2.5L)',
    originalPrice: 1850,
    dealPrice: 1299,
    discount: '30% OFF',
    tag: 'EXTRA EXCLUSIVE',
    image: '🍳',
    badgeColor: '#8b5cf6',
    stockLeft: 15
  },
  {
    id: 'd7',
    category: 'Dairy & Breakfast',
    name: 'Amul Artisanal Cheese Board Set',
    originalPrice: 450,
    dealPrice: 340,
    discount: '24% OFF',
    tag: 'CHILLED DEALS',
    image: '🧀',
    badgeColor: '#f97316',
    stockLeft: 22
  },
  {
    id: 'd8',
    category: 'Beverages',
    name: 'Wayanad Premium Roast Arabica (500g)',
    originalPrice: 490,
    dealPrice: 369,
    discount: '25% OFF',
    tag: 'FRESH ROAST',
    image: '☕',
    badgeColor: '#a855f7',
    stockLeft: 30
  }
];

export const saleOffers = [
  {
    tier: 'FRESH PRODUCE BONANZA',
    desc: 'Flat 20% to 40% OFF on all organic vegetables and seasonal fruits',
    code: 'EXTRAFRESH',
    bannerColor: 'from-emerald-600 to-teal-800'
  },
  {
    tier: 'MONTH-END PANTRY HAUL',
    desc: 'Buy 2 Get 1 Free on all whole spices, pulses and specialty rices',
    code: 'PANTRY3X',
    bannerColor: 'from-amber-600 to-orange-800'
  },
  {
    tier: 'HOME & KITCHEN FESTIVAL',
    desc: 'Up to 50% OFF on appliances, cast iron cookware and storage glassware',
    code: 'HOME50',
    bannerColor: 'from-purple-600 to-indigo-900'
  }
];

export const instagramPosts = [
  {
    id: 1,
    title: '5 AM Fresh Produce Arrival 🥦',
    tag: '@extrakoyilandy',
    likes: '1.4k',
    caption: 'Crisp, dewy veggies straight from Nilgiris & Wayanad farms just landed on our shelves!',
    color: '#064e3b',
    icon: '🥦'
  },
  {
    id: 2,
    title: 'Hot Batch Sourdough & Croissants 🥐',
    tag: '@extrakoyilandy',
    likes: '2.1k',
    caption: 'That golden crust crunch! Our bakery ovens run fresh batches every 60 minutes.',
    color: '#78350f',
    icon: '🥐'
  },
  {
    id: 3,
    title: 'Weekend Mega Festival ✨',
    tag: '@extrakoyilandy',
    likes: '3.8k',
    caption: 'Koyilandy shoppers enjoying live food tasting stalls and unmatched hypermarket deals.',
    color: '#1e1b4b',
    icon: '🎉'
  },
  {
    id: 4,
    title: 'Catch of the Day: Neymeen & Prawns 🐟',
    tag: '@extrakoyilandy',
    likes: '1.9k',
    caption: 'Fresh harbour catch cleaned, temperature controlled, and ready for your Malabar curry.',
    color: '#1e3a8a',
    icon: '🦐'
  },
  {
    id: 5,
    title: 'Home Makeover Collection 🛋️',
    tag: '#ExtraHome',
    likes: '2.5k',
    caption: 'Aesthetic glassware, bamboo organizers, and premium cookware at everyday low prices.',
    color: '#581c87',
    icon: '✨'
  },
  {
    id: 6,
    title: 'Kids Fun & Gaming Corner 🎮',
    tag: '#FamilyExtra',
    likes: '1.7k',
    caption: 'Big smiles at our Family Zone! Interactive toy demos and weekend prize giveaways.',
    color: '#831843',
    icon: '🧸'
  }
];
