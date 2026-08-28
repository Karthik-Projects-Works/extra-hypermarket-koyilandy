export const categories = [
  {
    id: 'essential-food',
    name: 'Essential Food',
    tagline: 'Quality Pantry Staples',
    desc: 'Founded on an unwavering commitment to true health for everyone. Your purchase directly supports small family farmers and indigenous communities around the world. Fair labor practices and quality processing at the source.',
    color: '#10b981',
    accent: '#059669',
    icon: 'leaf',
    items: ['Palakkadan Matta Rice', 'Cold Pressed Coconut Oil', 'Wayanad Cardamom & Pepper', 'Whole Grain Oats', 'Imported Olive Oil']
  },
  {
    id: 'household',
    name: 'Household Items',
    tagline: 'Everything For Your Home',
    desc: 'Tangible personal property for every room — from living rooms to kitchens, bedrooms to bathrooms. Air conditioners, cooking utensils, cleaning essentials, bedding, fans, refrigerators, and hundreds of daily home necessities.',
    color: '#3b82f6',
    accent: '#2563eb',
    icon: 'home',
    items: ['Cookware Sets', 'Storage Containers', 'Cleaning Supplies', 'Bedding & Linens', 'Kitchen Appliances']
  },
  {
    id: 'gifts',
    name: 'Gift Items',
    tagline: 'Personalized Gifting',
    desc: 'Ready to give personalized gifts for your friends and family. Unique artwork, designs and photos on a huge assortment of products for every occasion and celebration.',
    color: '#ec4899',
    accent: '#db2777',
    icon: 'gift',
    items: ['Custom Gift Items', 'Festive Hampers', 'Photo Gifts', 'Party Novelties', 'Occasion Wrapping']
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    tagline: 'Glow With Confidence',
    desc: 'Get glowing skin, gorgeous hair, and more with expert beauty tips and tricks. The best anti-aging creams, workout gear, hair care and wellness essentials from trusted global and Indian brands.',
    color: '#06b6d4',
    accent: '#0891b2',
    icon: 'sparkles',
    items: ['L\'Oréal Grooming', 'Nivea Skin Care', 'Dove Haircare', 'Colgate Oral Care', 'Wellness Essentials']
  },
  {
    id: 'electronics',
    name: 'Electronics',
    tagline: 'Best Prices on Tech',
    desc: 'The best shop for electronics, photos, electronic accessories and more at low prices. Top branded mixer grinders, induction stoves, kettles, steam irons, blenders, and daily electronics with manufacturer warranties.',
    color: '#8b5cf6',
    accent: '#7c3aed',
    icon: 'zap',
    items: ['Mixer Grinders', 'Induction Stoves', 'Electric Kettles', 'Steam Irons', 'Brand Warranties']
  },
  {
    id: 'sports',
    name: 'Sports Items',
    tagline: 'Gear Up & Play',
    desc: 'Wide range of Sports & Fitness from top brands. Explore now — equipment, activewear, and fitness accessories for every age and level.',
    color: '#f97316',
    accent: '#ea580c',
    icon: 'trophy',
    items: ['Fitness Equipment', 'Cricket Gear', 'Badminton Rackets', 'Yoga Mats', 'Sports Accessories']
  },
  {
    id: 'school',
    name: 'School Items',
    tagline: 'Smart Back-to-School',
    desc: 'The back-to-school shopping season made simple. Smart ways to save money while providing your child with the experience and excitement of getting ready for school. Lists, planning, and budgeting made easy.',
    color: '#eab308',
    accent: '#ca8a04',
    icon: 'book-open',
    items: ['Classmate Notebooks', 'Camlin Art Supplies', 'Papermate Pens', 'Maped School Gear', 'Office Essentials']
  },
  {
    id: 'baby-care-toys',
    name: 'Baby Care & Toys',
    tagline: 'Largest Kids Store',
    desc: 'Largest shopping store for kids and baby products. Buy baby care products, toys, educational kits, and essentials for your little ones — all under one roof.',
    color: '#ef4444',
    accent: '#dc2626',
    icon: 'baby',
    items: ['Pampers Baby Care', 'STEM Learning Kits', 'Eco Wooden Toys', 'Baby Nutrition', 'Family Board Games']
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
