import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  Award, Gift, Share2, Sparkles, ShoppingBag, 
  LogOut, Users, Eye, ShieldCheck, Flame, 
  X, Plus, Minus, Send, Compass, Globe, Moon, Sun, ChevronRight, ChevronLeft, RefreshCw
} from 'lucide-react';

const STORE_WHATSAPP_NUMBER = "201110192901";

// قاعدة بيانات العطور الكاملة مع الصور والخصائص لمستكشف العطور
const PERFUMES = [
  // رجالي وفخم
  {
    id: 1,
    name: "Imperial Valley - Gissah",
    nameAr: "إمبريال فالي - قصة",
    category: "men",
    family: "leather_oriental",
    occasion: "luxury",
    season: "all",
    price: 850,
    pointsReward: 85,
    tag: "Signature",
    tagAr: "ملكي فاخر",
    notes: "Davana, Italian Bergamot, Pink Pepper, Amber, Oud",
    notesAr: "دافانا، برغموت إيطالي، فلفل وردي، عنبر، عود أبيض",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Bleu de Chanel",
    nameAr: "بلو دي شانيل",
    category: "men",
    family: "fresh_woody",
    occasion: "daily_office",
    season: "summer",
    price: 750,
    pointsReward: 75,
    tag: "Best Seller",
    tagAr: "الأكثر مبيعاً",
    notes: "Grapefruit, Lemon, Mint, Cedar, Sandalwood",
    notesAr: "جريب فروت، ليمون، نعناع، خشب الأرز، صندل",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Prada Luna Rossa Black",
    nameAr: "برادا بلاك",
    category: "men",
    family: "amber_powdery",
    occasion: "evening",
    season: "winter",
    price: 720,
    pointsReward: 72,
    tag: "Mysterious",
    tagAr: "غامض وجذاب",
    notes: "Bergamot, Angelica, Patchouli, Amber, Coumarin",
    notesAr: "برغموت، أنجليكا، باتشولي، عنبر، كومارين دافئ",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Creed Aventus",
    nameAr: "كريد أفينتوس",
    category: "men",
    family: "fruity_smoky",
    occasion: "luxury",
    season: "all",
    price: 950,
    pointsReward: 95,
    tag: "King of Scents",
    tagAr: "عطر الملوك",
    notes: "Pineapple, Birch, Black Currant, Musk, Oakmoss",
    notesAr: "أناناس، بتولا مدخنة، كشمش أسود، مسك، طحلب البلوط",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Sauvage Elixir - Dior",
    nameAr: "سوفاج إلكسير",
    category: "men",
    family: "spicy_deep",
    occasion: "evening",
    season: "winter",
    price: 880,
    pointsReward: 88,
    tag: "Intense Beast",
    tagAr: "فوحان أسطوري",
    notes: "Nutmeg, Cinnamon, Cardamom, Lavender, Licorice",
    notesAr: "جوزة الطيب، قرفة، هيل، لافندر نقي، عرق سوس",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Oud Wood - Tom Ford",
    nameAr: "توم فورد عود وود",
    category: "unisex",
    family: "leather_oriental",
    occasion: "luxury",
    season: "winter",
    price: 920,
    pointsReward: 92,
    tag: "Classy Oud",
    tagAr: "عود راقي",
    notes: "Agarwood, Brazilian Rosewood, Cardamom, Tonka Bean",
    notesAr: "خشب العود، خشب الورد، هيل، حبوب التونكا، نجيل الهند",
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Azzaro The Most Wanted",
    nameAr: "أزارو ذا موست وانتد",
    category: "men",
    family: "gourmand_sweet",
    occasion: "dating",
    season: "winter",
    price: 680,
    pointsReward: 68,
    tag: "Date Night",
    tagAr: "سلاح الجاذبية",
    notes: "Cardamom, Toffee, Amberwood, Bourbon Vanilla",
    notesAr: "حب الهال، كراميل التوفي، خشب العنبر، فانيليا البوربون",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Baccarat Rouge 540",
    nameAr: "باكارات روج 540",
    category: "unisex",
    family: "sweet_amber",
    occasion: "luxury",
    season: "all",
    price: 950,
    pointsReward: 95,
    tag: "Pure Glamour",
    tagAr: "الفخامة المطلقة",
    notes: "Jasmine, Saffron, Amberwood, Ambergris, Cedar",
    notesAr: "ياسمين، زعفران أحمر، خشب العنبر، كتل العنبر، أرز",
    image: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "9 PM - Afnan",
    nameAr: "ناين بي إم - أفنان",
    category: "men",
    family: "gourmand_sweet",
    occasion: "evening",
    season: "winter",
    price: 550,
    pointsReward: 55,
    tag: "Party Monster",
    tagAr: "أقوى بديل للألترا ميل",
    notes: "Apple, Cinnamon, Wild Lavender, Vanilla, Tonka",
    notesAr: "تفاح أحمر، قرفة دافئة، لافندر بري، فانيليا، تونكا",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Paco Rabanne Invictus",
    nameAr: "باكو رابان إنفكتوس",
    category: "men",
    family: "fresh_aquatic",
    occasion: "daily_office",
    season: "summer",
    price: 640,
    pointsReward: 64,
    tag: "Champion",
    tagAr: "انتعاش مائي بطولي",
    notes: "Sea Notes, Grapefruit, Bay Leaf, Jasmine, Guaiac Wood",
    notesAr: "نوتات بحرية، جريب فروت، ورق الغار، ياسمين، خشب الغاياك",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "Jean Paul Gaultier Ultra Male",
    nameAr: "ألترا ميل - جان بول غوتييه",
    category: "men",
    family: "gourmand_sweet",
    occasion: "dating",
    season: "winter",
    price: 740,
    pointsReward: 74,
    tag: "Club King",
    tagAr: "جاذبية لا تقاوم",
    notes: "Pear, Lavender, Mint, Black Vanilla, Cinnamon",
    notesAr: "كمثرى مقرمشة، لافندر، نعناع، فانيليا سوداء، قرفة",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    name: "Good Girl - Carolina Herrera",
    nameAr: "جود جيرل - كارولينا هيريرا",
    category: "women",
    family: "sweet_floral",
    occasion: "evening",
    season: "winter",
    price: 760,
    pointsReward: 76,
    tag: "Femme Fatale",
    tagAr: "أنثوي ساحر",
    notes: "Almond, Coffee, Tuberose, Jasmine Sambac, Cacao, Tonka",
    notesAr: "لوز، قهوة مركزة، مسك الروم، ياسمين، كاكاو، تونكا",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 13,
    name: "Scandal - Jean Paul Gaultier",
    nameAr: "سكاندال - فضيحة",
    category: "women",
    family: "gourmand_sweet",
    occasion: "dating",
    season: "winter",
    price: 750,
    pointsReward: 75,
    tag: "Honey Bomb",
    tagAr: "قنبلة العسل والكراميل",
    notes: "Blood Orange, Mandarin, Honey, Gardenia, Caramel, Patchouli",
    notesAr: "برتقال دموي، يوسفي، عسل نقي، غاردينيا، كراميل، باتشولي",
    image: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 14,
    name: "Yara Candy - Lattafa",
    nameAr: "يارا كاندي - لطافة",
    category: "women",
    family: "fruity_sweet",
    occasion: "daily_office",
    season: "all",
    price: 520,
    pointsReward: 52,
    tag: "Trending Pink",
    tagAr: "تريند الأنوثة والحلويات",
    notes: "Green Tangerine, Blackcurrant, Strawberry Fizz, Vanilla",
    notesAr: "يوسفي أخضر، كشمش، حلاوة الفراولة، فانيليا سكرية",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 15,
    name: "Jimmy Choo EDP",
    nameAr: "جيمي شو النسائي",
    category: "women",
    family: "sweet_floral",
    occasion: "daily_office",
    season: "all",
    price: 660,
    pointsReward: 66,
    tag: "Modern Chic",
    tagAr: "أناقة عصرية",
    notes: "Pear, Mandarin, Orchid, Toffee, Indonesian Patchouli",
    notesAr: "كمثرى، ماندارين، أوركيد ساحر، توفي دافئ، باتشولي",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 16,
    name: "Khamrah - Lattafa",
    nameAr: "خمرة - لطافة",
    category: "unisex",
    family: "spicy_gourmand",
    occasion: "evening",
    season: "winter",
    price: 580,
    pointsReward: 58,
    tag: "Apple Pie",
    tagAr: "فخامة القرفة والتمر",
    notes: "Cinnamon, Nutmeg, Dates, Praline, Vanilla, Tonka",
    notesAr: "قرفة فاخرة، جوزة الطيب، تمور، برالين، فانيليا دافئة",
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 17,
    name: "Khamrah Qahwa",
    nameAr: "خمرة قهوة - لطافة",
    category: "unisex",
    family: "spicy_gourmand",
    occasion: "evening",
    season: "winter",
    price: 620,
    pointsReward: 62,
    tag: "Coffee Twist",
    tagAr: "لمسة القهوة العربية الفاخرة",
    notes: "Ginger, Cardamom, Coffee, Candied Fruits, Vanilla",
    notesAr: "زنجبيل، هيل، قهوة محمصة، فواكه مسكرة، فانيليا",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 18,
    name: "Black XS for Men - Paco Rabanne",
    nameAr: "بلاك إكس إس رجالي",
    category: "men",
    family: "fruity_sweet",
    occasion: "dating",
    season: "winter",
    price: 640,
    pointsReward: 64,
    tag: "Rock & Roll",
    tagAr: "جرأة وحلاوة البرالين",
    notes: "Lemon, Tagetes, Praline, Cinnamon, Black Amber",
    notesAr: "ليمون، توت العليق، حلوى البرالين، قرفة، عنبر أسود",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 19,
    name: "Black XS for Her",
    nameAr: "بلاك إكس إس نسائي",
    category: "women",
    family: "fruity_sweet",
    occasion: "evening",
    season: "winter",
    price: 640,
    pointsReward: 64,
    tag: "Sensual Rock",
    tagAr: "أنثوي متمرد بالكاكاو",
    notes: "Cranberry, Pink Pepper, Black Violet, Cacao, Vanilla",
    notesAr: "توت بري، فلفل وردي، بنفسج أسود، كاكاو ناعم، فانيليا",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 20,
    name: "Bianco Latte - Giardini Di Toscana",
    nameAr: "بيانكو لاتي",
    category: "unisex",
    family: "gourmand_sweet",
    occasion: "daily_office",
    season: "winter",
    price: 920,
    pointsReward: 92,
    tag: "Viral Vanilla",
    tagAr: "حليب الكراميل والفانيليا الخالصة",
    notes: "Caramel, Honey, Coumarin, Vanilla, White Musk",
    notesAr: "كراميل دسم، عسل نقي، كومارين، فانيليا مركزة، مسك أبيض",
    image: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 21,
    name: "Stronger With You Intensely - Armani",
    nameAr: "سترونجر ويذ يو إنتنسلي",
    category: "men",
    family: "gourmand_sweet",
    occasion: "dating",
    season: "winter",
    price: 770,
    pointsReward: 77,
    tag: "Irresistible",
    tagAr: "عطر الشتاء الأول",
    notes: "Pink Pepper, Juniper, Toffee, Cinnamon, Suede, Vanilla",
    notesAr: "فلفل وردي، عرعر، توفي مكرمل، قرفة، جلد الغزال، فانيليا",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 22,
    name: "Midnight Rain - La Prairie",
    nameAr: "ميدنايت رين",
    category: "women",
    family: "fruity_sweet",
    occasion: "evening",
    season: "all",
    price: 890,
    pointsReward: 89,
    tag: "Rare Luxury",
    tagAr: "عطر المطر والغموض",
    notes: "Guava, Pomegranate, White Lily, Patchouli, Cashmere Wood",
    notesAr: "جوافة، رمان، زنبق أبيض، أوركيد، باتشولي، خشب الكشمير",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 23,
    name: "Sense by Georgina (Laverne)",
    nameAr: "سنس جورجينا - لافيرن",
    category: "women",
    family: "sweet_floral",
    occasion: "daily_office",
    season: "all",
    price: 690,
    pointsReward: 69,
    tag: "Celebrity Elegance",
    tagAr: "عطر جورجينا الأيقوني",
    notes: "Blackcurrant, Mandarin, Jasmine, Cashmeran, Amber",
    notesAr: "كشمش أسود، ماندارين، ياسمين فرنسي، كشميران، عنبر ناعم",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 24,
    name: "Burberry Her EDP",
    nameAr: "بربري هير",
    category: "women",
    family: "fruity_sweet",
    occasion: "daily_office",
    season: "summer",
    price: 740,
    pointsReward: 74,
    tag: "Berry Bliss",
    tagAr: "سلة التوت البريطاني",
    notes: "Strawberry, Raspberry, Blackberry, Jasmine, Musk, Amber",
    notesAr: "فراولة، توت العليق، توت أسود، ياسمين، مسك نظيف، عنبر",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 25,
    name: "Victoria's Secret Bombshell & Mist Collection",
    nameAr: "فيكتوريا سيكريت بومبشيل والمجموعات",
    category: "women",
    family: "fresh_aquatic",
    occasion: "daily_office",
    season: "summer",
    price: 540,
    pointsReward: 54,
    tag: "Fresh Seduction",
    tagAr: "انتعاش الفواكه الاستوائية",
    notes: "Passionfruit, Grapefruit, Pineapple, Peony, Vanilla Orchid",
    notesAr: "باشن فروت، جريب فروت، أناناس، زهور الفاوانيا، أوركيد",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80"
  }
];

// نصوص الواجهة بكلتا اللغتين
const DICTIONARY = {
  ar: {
    brandSubtitle: "للعطور الفاخرة",
    shop: "المتجر",
    quiz: "مستكشف العطور",
    myPoints: "نقاطي",
    admin: "لوحة الإدارة",
    cart: "سلة الطلبات",
    emptyCart: "سلتك فارغة حالياً",
    subtotal: "الإجمالي قبل الخصم:",
    pointsDiscount: "خصم النقاط المستبدلة:",
    earnedPoints: "النقاط المكتسبة من الطلب:",
    finalDue: "المطلوب للدفع عند الاستلام:",
    redeemSliderLabel: "استبدال نقاطك لخصم فوري:",
    availableBalance: "رصيدك المتاح:",
    points: "نقطة",
    currency: "ج.م",
    fullName: "الاسم بالكامل *",
    phone: "رقم الموبايل (واتساب) *",
    address: "المحافظة والعنوان بالتفصيل *",
    whatsappCheckout: "تأكيد الطلب عبر WhatsApp",
    addToCart: "أضف إلى السلة",
    heroBadge: "✦ سجّل حسابك واكسب 50 نقطة فورية في محفظتك",
    heroTitle: "أرقى التوليفات العالمية وأيقونات الثبات والفوحان",
    heroDesc: "استمتع بتشكيلة فاخرة مستوحاة من أشهر دور العطور في العالم، مع نظام نقاط يخصم لك من كل طلبية ودفع عند الاستلام لكافة المحافظات.",
    exploreQuizBtn: "ابدأ مستكشف العطور لاكتشاف توقيعك",
    menSection: "تشكيلة الرجال (الهيبة والفوحان)",
    womenSection: "تشكيلة النساء (الأنوثة والجاذبية)",
    allPerfumes: "المجموعة الكاملة",
    quizTitle: "مستكشف العطور الذكي",
    quizSubtitle: "أجب عن 4 أسئلة وسنرشح لك العطر المصنوع خصيصاً لذوقك",
    q1: "1. لمن تبحث عن العطر؟",
    q1_opt1: "رجالي فخم وجريء",
    q1_opt2: "نسائي ناعم وساحر",
    q1_opt3: "يونيسكس (للجنسين)",
    q2: "2. ما هي المناسبة الأكثر أهمية بالنسبة لك؟",
    q2_opt1: "خروجات ومناسبات مسائية فخمة",
    q2_opt2: "سهرات خاصة ومواعيد رومانسية",
    q2_opt3: "عمل واستخدام يومي متكرر",
    q3: "3. ما هو الطابع العطري الذي يأسرك؟",
    q3_opt1: "أخشاب وعود وجلود دافئة",
    q3_opt2: "حلويات وفانيليا وكراميل دسم (Gourmand)",
    q3_opt3: "حمضيات وانتعاش مائي وزهور هادئة",
    q4: "4. في أي وقت أو فصل تفضل ارتدائه؟",
    q4_opt1: "أجواء شتوية وباردة (يحتاج ثبات ثقيل)",
    q4_opt2: "أجواء صيفية ومعتدلة (يحتاج انتعاش خفيف)",
    q4_opt3: "عطر جوكر صالح لكل الفصول",
    matchFound: "تطابق ممتاز بنسبة 100%!",
    altMatch: "عطر بديل قد يناسبك أيضاً:",
    tryAgain: "إعادة الاختبار",
    loginWithGoogle: "دخول بـ Google",
    logout: "خروج",
    welcomePointsMsg: "رصيدك الحالي من النقاط:",
    orderSuccessMsg: "تم تجهيز الأوردر وفتح محادثة الواتساب!",
    totalVisitors: "إجمالي الزوار الحقيقيين للمتجر"
  },
  en: {
    brandSubtitle: "LUXURY PERFUMES",
    shop: "Boutique",
    quiz: "Scent Finder",
    myPoints: "My Rewards",
    admin: "Admin",
    cart: "Shopping Bag",
    emptyCart: "Your bag is currently empty",
    subtotal: "Subtotal:",
    pointsDiscount: "Loyalty Discount:",
    earnedPoints: "Points Earned On Order:",
    finalDue: "Total Payable On Delivery:",
    redeemSliderLabel: "Redeem Points for Instant Discount:",
    availableBalance: "Your Balance:",
    points: "Pts",
    currency: "EGP",
    fullName: "Full Name *",
    phone: "WhatsApp Mobile *",
    address: "City & Detailed Address *",
    whatsappCheckout: "Confirm Order via WhatsApp",
    addToCart: "Add to Bag",
    heroBadge: "✦ Create your account and get 50 instant welcome points",
    heroTitle: "World-Class Signatures, Uncompromising Sillage",
    heroDesc: "Discover rare blends inspired by the world's most prestigious perfume houses. Earn loyalty points on every bottle with Cash on Delivery nationwide.",
    exploreQuizBtn: "Launch Scent Finder Quiz",
    menSection: "Gentlemen's Edit (Bold & Magnetic)",
    womenSection: "Ladies' Collection (Glamour & Radiance)",
    allPerfumes: "Full Master Collection",
    quizTitle: "Intelligent Scent Finder",
    quizSubtitle: "Answer 4 quick questions to discover your ultimate signature match",
    q1: "1. Who is this fragrance for?",
    q1_opt1: "Gentlemen (Masculine & Bold)",
    q1_opt2: "Ladies (Sensual & Chic)",
    q1_opt3: "Unisex (Gender-Neutral Masterpiece)",
    q2: "2. Primary Occasion?",
    q2_opt1: "Formal Evening & Gala Occasions",
    q2_opt2: "Romantic Evenings & Date Nights",
    q2_opt3: "Daily Signature & Office Wear",
    q3: "3. What fragrance profile calls to you?",
    q3_opt1: "Woods, Rich Oud & Leather",
    q3_opt2: "Sweet Gourmand, Vanilla & Caramel",
    q3_opt3: "Fresh Aquatics, Crisp Citrus & Florals",
    q4: "4. Preferred Season?",
    q4_opt1: "Winter & Cold Evenings (Rich & Dense)",
    q4_opt2: "Summer & Warm Sunny Days (Fresh)",
    q4_opt3: "All-Year Signature Versatility",
    matchFound: "100% Signature Match Found!",
    altMatch: "Alternative recommendation you might adore:",
    tryAgain: "Restart Quiz",
    loginWithGoogle: "Sign in with Google",
    logout: "Logout",
    welcomePointsMsg: "Your current loyalty points balance:",
    orderSuccessMsg: "Order prepared! Opening WhatsApp conversation...",
    totalVisitors: "Total Unique Visitors"
  }
};

export default function App() {
  const [lang, setLang] = useState('ar'); // 'ar' or 'en'
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const t = DICTIONARY[lang];

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'quiz', 'rewards', 'admin'
  const [visitorCount, setVisitorCount] = useState(0);
  const [notification, setNotification] = useState('');

  // سلة المشتريات
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [shippingDetails, setShippingDetails] = useState({ name: '', phone: '', address: '' });

  // اختبار مستكشف العطور
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({ gender: '', occasion: '', profile: '', season: '' });
  const [matchedPerfumes, setMatchedPerfumes] = useState({ primary: null, alternative: null });

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setProfile(null);
    });

    trackVisit();
    return () => subscription.unsubscribe();
  }, []);

  const trackVisit = async () => {
    let visitorId = localStorage.getItem('el3nabbe_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('el3nabbe_visitor_id', visitorId);
      await supabase.from('site_visits').insert([{ visitor_id: visitorId }]);
    }
    const { count } = await supabase.from('site_visits').select('*', { count: 'exact', head: true });
    if (count !== null) setVisitorCount(count);
  };

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setProfile(data);
      if (!shippingDetails.name) {
        setShippingDetails(prev => ({ ...prev, name: data.full_name || '' }));
      }
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) showToast(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast(lang === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
  };

  const addToCart = (perfume) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === perfume.id);
      if (existing) {
        return prev.map(item => item.id === perfume.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...perfume, qty: 1 }];
    });
    setIsCartOpen(true);
    showToast(lang === 'ar' ? `تمت إضافة ${perfume.nameAr} إلى السلة` : `Added ${perfume.name} to bag`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // الحسابات
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const potentialPointsEarned = cart.reduce((acc, item) => acc + (item.pointsReward * item.qty), 0);
  const maxRedeemablePoints = profile ? Math.min(profile.points_balance, Math.floor(subtotal / 0.5)) : 0;
  const discountAmount = pointsToRedeem * 0.5;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return showToast(t.emptyCart);
    if (!shippingDetails.name || !shippingDetails.phone || !shippingDetails.address) {
      return showToast(lang === 'ar' ? 'يرجى كتابة الاسم ورقم الموبايل والعنوان' : 'Please provide name, phone and address');
    }

    if (pointsToRedeem > 0 && profile) {
      const updatedBalance = profile.points_balance - pointsToRedeem + potentialPointsEarned;
      await supabase.from('profiles').update({ points_balance: updatedBalance }).eq('id', profile.id);
      await supabase.from('points_ledger').insert([{
        user_id: profile.id,
        amount: -pointsToRedeem,
        description: `Loyalty points redeemed for discount of ${discountAmount} EGP`
      }]);
      setProfile(prev => ({ ...prev, points_balance: updatedBalance }));
    } else if (profile) {
      const updatedBalance = profile.points_balance + potentialPointsEarned;
      await supabase.from('profiles').update({ points_balance: updatedBalance }).eq('id', profile.id);
      setProfile(prev => ({ ...prev, points_balance: updatedBalance }));
    }

    await supabase.from('orders').insert([{
      user_id: profile?.id || null,
      customer_name: shippingDetails.name,
      customer_phone: shippingDetails.phone,
      shipping_address: shippingDetails.address,
      items: cart,
      subtotal: subtotal,
      discount: discountAmount,
      points_used: pointsToRedeem,
      total: finalTotal
    }]);

    const itemsList = cart.map(i => `- ${lang === 'ar' ? i.nameAr : i.name} (Qty: ${i.qty}) = ${i.price * i.qty} ${t.currency}`).join('\n');
    const msg = `*Order from EL3NABBE Perfumes | طلب جديد*\n\n` +
      `*Customer Info:*\n` +
      `Name: ${shippingDetails.name}\n` +
      `Phone: ${shippingDetails.phone}\n` +
      `Address: ${shippingDetails.address}\n\n` +
      `*Order Details:*\n${itemsList}\n\n` +
      `Subtotal: ${subtotal} ${t.currency}\n` +
      (discountAmount > 0 ? `Loyalty Discount: ${discountAmount} ${t.currency} (${pointsToRedeem} Pts)\n` : '') +
      `*Net Payable on Delivery: ${finalTotal} ${t.currency}*\n` +
      `Points Added to Account: +${potentialPointsEarned} Pts`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${STORE_WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');

    setCart([]);
    setIsCartOpen(false);
    setPointsToRedeem(0);
    showToast(t.orderSuccessMsg);
  };

  // معالجة خيارات مستكشف العطور وترشيح العطر الأساسي والبديل
  const handleQuizAnswer = (key, value) => {
    const updatedAnswers = { ...quizAnswers, [key]: value };
    setQuizAnswers(updatedAnswers);

    if (quizStep < 3) {
      setQuizStep(prev => prev + 1);
    } else {
      // إيجاد أفضل تطابقين بناءً على المعايير
      let filtered = PERFUMES.filter(p => {
        if (updatedAnswers.gender === 'men') return p.category === 'men' || p.category === 'unisex';
        if (updatedAnswers.gender === 'women') return p.category === 'women' || p.category === 'unisex';
        return true;
      });

      // رصد التشابه في الطابع والمناسبة
      let ranked = [...filtered].sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        if (a.family.includes(updatedAnswers.profile)) scoreA += 3;
        if (b.family.includes(updatedAnswers.profile)) scoreB += 3;
        if (a.occasion === updatedAnswers.occasion) scoreA += 2;
        if (b.occasion === updatedAnswers.occasion) scoreB += 2;
        if (a.season === updatedAnswers.season || a.season === 'all') scoreA += 1;
        if (b.season === updatedAnswers.season || b.season === 'all') scoreB += 1;
        return scoreB - scoreA;
      });

      setMatchedPerfumes({
        primary: ranked[0] || PERFUMES[0],
        alternative: ranked[1] || PERFUMES[1]
      });
      setQuizStep(4);
    }
  };

  const isRtl = lang === 'ar';
  const isDark = theme === 'dark';

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDark ? 'bg-[#0a0a0c] text-stone-100 selection:bg-amber-500 selection:text-black' : 'bg-[#faf9f6] text-stone-900 selection:bg-amber-400 selection:text-black'
      }`}
    >
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-stone-950 px-6 py-2.5 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* الشريط العلوي للتحكم والتبديل */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
        isDark ? 'border-stone-800 bg-[#0a0a0c]/85' : 'border-stone-200 bg-white/85 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* الشعار */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('shop')}>
            <span className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-1.5">
              EL3NABBE <span className="text-amber-500 text-xs font-semibold px-2 py-0.5 rounded border border-amber-500/30">{t.brandSubtitle}</span>
            </span>
          </div>

          {/* أزرار التبويبات والمظهر واللغة */}
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => setActiveTab('shop')}
              className={`px-3 md:px-4 py-2 rounded-xl text-sm font-bold transition ${
                activeTab === 'shop' 
                  ? 'bg-amber-500 text-stone-950 shadow-md' 
                  : (isDark ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-black')
              }`}
            >
              {t.shop}
            </button>
            <button 
              onClick={() => { setActiveTab('quiz'); setQuizStep(0); }}
              className={`px-3 md:px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'quiz' 
                  ? 'bg-amber-500 text-stone-950 shadow-md' 
                  : (isDark ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-black')
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">{t.quiz}</span>
            </button>
            <button 
              onClick={() => setActiveTab('rewards')}
              className={`px-3 md:px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'rewards' 
                  ? 'bg-amber-500 text-stone-950 shadow-md' 
                  : (isDark ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-black')
              }`}
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">{t.myPoints}</span>
              {profile ? ` (${profile.points_balance})` : ''}
            </button>

            {profile?.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1 ${
                  activeTab === 'admin' ? 'bg-red-600 text-white' : 'text-red-500 hover:bg-stone-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">{t.admin}</span>
              </button>
            )}

            {/* سلة الشراء */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2.5 rounded-xl border transition ${
                isDark ? 'bg-stone-900 border-stone-800 text-amber-400 hover:border-amber-500' : 'bg-stone-100 border-stone-300 text-stone-800 hover:border-stone-400'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 text-xs w-5 h-5 rounded-full font-bold flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>

            {/* تبديل الوضع الليلي / النهاري */}
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2.5 rounded-xl border transition ${
                isDark ? 'bg-stone-900 border-stone-800 text-amber-400' : 'bg-stone-100 border-stone-300 text-stone-700'
              }`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* تبديل اللغة */}
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                isDark ? 'bg-stone-900 border-stone-800 text-stone-200' : 'bg-stone-100 border-stone-300 text-stone-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Google Login / Logout */}
            {session ? (
              <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition">
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleGoogleLogin} 
                className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white text-stone-950 font-bold text-xs border border-stone-300 shadow hover:bg-stone-100 transition"
              >
                <span>{t.loginWithGoogle}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* سلة الشراء المنبثقة */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md border-r h-full flex flex-col justify-between p-6 overflow-y-auto transition-colors ${
            isDark ? 'bg-[#0f0f13] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900 shadow-2xl'
          }`}>
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-4 border-stone-700/50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-lg">{t.cart}</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 hover:opacity-75">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 text-stone-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                  <p>{t.emptyCart}</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                      isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-stone-50 border-stone-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-stone-800" />
                        <div>
                          <h4 className="font-bold text-sm">{isRtl ? item.nameAr : item.name}</h4>
                          <span className="text-xs text-amber-500 font-bold">{item.price} {t.currency}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 rounded-lg bg-stone-800 text-white hover:bg-stone-700">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-sm px-1">{item.qty}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 rounded-lg bg-stone-800 text-white hover:bg-stone-700">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* شريط خصم النقاط */}
                  {profile && profile.points_balance > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-amber-500">{t.redeemSliderLabel}</span>
                        <span className="font-bold">{pointsToRedeem} {t.points} = {discountAmount} {t.currency}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max={maxRedeemablePoints} 
                        step="10"
                        value={pointsToRedeem}
                        onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <span className="text-[11px] text-stone-400 block">{t.availableBalance} {profile.points_balance} {t.points}</span>
                    </div>
                  )}

                  {/* ملخص المبالغ */}
                  <div className="border-t border-stone-700/50 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-400">
                      <span>{t.subtotal}</span>
                      <span>{subtotal} {t.currency}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-500 font-semibold">
                        <span>{t.pointsDiscount}</span>
                        <span>-{discountAmount} {t.currency}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-400">
                      <span>{t.earnedPoints}</span>
                      <span className="text-amber-500 font-bold">+{potentialPointsEarned} {t.points}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold pt-2 border-t border-stone-700/50">
                      <span>{t.finalDue}</span>
                      <span className="text-amber-500">{finalTotal} {t.currency}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* تفاصيل العميل وزر الواتساب */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="border-t border-stone-700/50 pt-4 space-y-3">
                <input 
                  type="text" 
                  placeholder={t.fullName}
                  required
                  value={shippingDetails.name}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 outline-none ${
                    isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-300'
                  }`}
                />
                <input 
                  type="tel" 
                  placeholder={t.phone}
                  required
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 outline-none ${
                    isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-300'
                  }`}
                />
                <textarea 
                  placeholder={t.address}
                  required
                  rows="2"
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:border-amber-500 outline-none resize-none ${
                    isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-300'
                  }`}
                />
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.whatsappCheckout}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* صفحة المتجر وسلايدرات الرجال والنساء */}
        {activeTab === 'shop' && (
          <div className="space-y-12">
            {/* البانر الترحيبي الفخم */}
            <div className={`rounded-3xl border p-8 md:p-14 relative overflow-hidden ${
              isDark 
                ? 'border-stone-800 bg-gradient-to-r from-stone-900 via-[#181113] to-stone-900' 
                : 'border-stone-200 bg-gradient-to-r from-stone-100 via-amber-50 to-stone-100'
            }`}>
              <div className="max-w-2xl relative z-10">
                <span className="inline-block bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs px-3.5 py-1.5 rounded-full font-bold mb-4">
                  {t.heroBadge}
                </span>
                <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
                  {t.heroTitle}
                </h1>
                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                  {t.heroDesc}
                </p>
                <button 
                  onClick={() => { setActiveTab('quiz'); setQuizStep(0); }}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold px-6 py-3.5 rounded-2xl transition flex items-center gap-2 text-sm shadow-xl"
                >
                  <Compass className="w-4 h-4" />
                  <span>{t.exploreQuizBtn}</span>
                </button>
              </div>
            </div>

            {/* سلايدر قسم الرجال */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>{t.menSection}</span>
                </h2>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin snap-x">
                {PERFUMES.filter(p => p.category === 'men' || p.category === 'unisex').map(perfume => (
                  <div 
                    key={perfume.id} 
                    className={`min-w-[260px] md:min-w-[280px] snap-start rounded-3xl border overflow-hidden flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 ${
                      isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-md'
                    }`}
                  >
                    <div className="relative h-60 overflow-hidden">
                      <img src={perfume.image} alt={perfume.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-amber-400 text-[11px] px-2.5 py-1 rounded-lg border border-stone-700">
                        {isRtl ? perfume.tagAr : perfume.tag}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-base mb-1">{isRtl ? perfume.nameAr : perfume.name}</h3>
                        <p className="text-stone-400 text-xs mb-3 line-clamp-2">{isRtl ? perfume.notesAr : perfume.notes}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between border-t border-stone-700/40 pt-3 mb-3">
                          <span className="text-lg font-black text-amber-500">{perfume.price} {t.currency}</span>
                          <span className="text-xs bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded">+{perfume.pointsReward} {t.points}</span>
                        </div>
                        <button 
                          onClick={() => addToCart(perfume)}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{t.addToCart}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* سلايدر قسم النساء */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>{t.womenSection}</span>
                </h2>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin snap-x">
                {PERFUMES.filter(p => p.category === 'women' || p.category === 'unisex').map(perfume => (
                  <div 
                    key={perfume.id} 
                    className={`min-w-[260px] md:min-w-[280px] snap-start rounded-3xl border overflow-hidden flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 ${
                      isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-md'
                    }`}
                  >
                    <div className="relative h-60 overflow-hidden">
                      <img src={perfume.image} alt={perfume.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-pink-400 text-[11px] px-2.5 py-1 rounded-lg border border-stone-700">
                        {isRtl ? perfume.tagAr : perfume.tag}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-base mb-1">{isRtl ? perfume.nameAr : perfume.name}</h3>
                        <p className="text-stone-400 text-xs mb-3 line-clamp-2">{isRtl ? perfume.notesAr : perfume.notes}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between border-t border-stone-700/40 pt-3 mb-3">
                          <span className="text-lg font-black text-amber-500">{perfume.price} {t.currency}</span>
                          <span className="text-xs bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded">+{perfume.pointsReward} {t.points}</span>
                        </div>
                        <button 
                          onClick={() => addToCart(perfume)}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{t.addToCart}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* الكتالوج الكامل */}
            <div>
              <h2 className="text-xl md:text-2xl font-black mb-6">{t.allPerfumes}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {PERFUMES.map(perfume => (
                  <div 
                    key={perfume.id} 
                    className={`rounded-3xl border overflow-hidden flex flex-col justify-between ${
                      isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-md'
                    }`}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img src={perfume.image} alt={perfume.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-amber-400 text-[10px] px-2 py-0.5 rounded border border-stone-700">
                        {isRtl ? perfume.tagAr : perfume.tag}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm mb-1">{isRtl ? perfume.nameAr : perfume.name}</h3>
                        <p className="text-stone-400 text-[11px] mb-3">{isRtl ? perfume.notesAr : perfume.notes}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between border-t border-stone-700/30 pt-2 mb-3">
                          <span className="text-base font-black text-amber-500">{perfume.price} {t.currency}</span>
                          <span className="text-[11px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold">+{perfume.pointsReward} Pts</span>
                        </div>
                        <button 
                          onClick={() => addToCart(perfume)}
                          className="w-full bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-white font-bold py-2 rounded-xl transition text-xs flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{t.addToCart}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* مستكشف العطور متعدد المراحل مع إظهار الخيار البديل */}
        {activeTab === 'quiz' && (
          <div className={`max-w-2xl mx-auto rounded-3xl border p-8 md:p-12 text-center space-y-6 ${
            isDark ? 'bg-stone-900/70 border-stone-800' : 'bg-white border-stone-200 shadow-xl'
          }`}>
            {quizStep < 4 && (
              <div>
                <Compass className="w-12 h-12 text-amber-500 mx-auto mb-2 animate-spin-slow" />
                <h2 className="text-2xl font-black">{t.quizTitle}</h2>
                <p className="text-stone-400 text-xs mt-1">{t.quizSubtitle}</p>
              </div>
            )}

            {/* السؤال الأول: الجنس */}
            {quizStep === 0 && (
              <div className="space-y-4 text-start">
                <h3 className="text-lg font-bold text-center">{t.q1}</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => handleQuizAnswer('gender', 'men')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    🎩 {t.q1_opt1}
                  </button>
                  <button onClick={() => handleQuizAnswer('gender', 'women')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    👠 {t.q1_opt2}
                  </button>
                  <button onClick={() => handleQuizAnswer('gender', 'unisex')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    👑 {t.q1_opt3}
                  </button>
                </div>
              </div>
            )}

            {/* السؤال الثاني: المناسبة */}
            {quizStep === 1 && (
              <div className="space-y-4 text-start">
                <h3 className="text-lg font-bold text-center">{t.q2}</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => handleQuizAnswer('occasion', 'luxury')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    ✨ {t.q2_opt1}
                  </button>
                  <button onClick={() => handleQuizAnswer('occasion', 'dating')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    🕯️ {t.q2_opt2}
                  </button>
                  <button onClick={() => handleQuizAnswer('occasion', 'daily_office')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    💼 {t.q2_opt3}
                  </button>
                </div>
              </div>
            )}

            {/* السؤال الثالث: الطابع العطري */}
            {quizStep === 2 && (
              <div className="space-y-4 text-start">
                <h3 className="text-lg font-bold text-center">{t.q3}</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => handleQuizAnswer('profile', 'oriental')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    🪵 {t.q3_opt1}
                  </button>
                  <button onClick={() => handleQuizAnswer('profile', 'sweet')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    🍫 {t.q3_opt2}
                  </button>
                  <button onClick={() => handleQuizAnswer('profile', 'fresh')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    🍋 {t.q3_opt3}
                  </button>
                </div>
              </div>
            )}

            {/* السؤال الرابع: الفصل */}
            {quizStep === 3 && (
              <div className="space-y-4 text-start">
                <h3 className="text-lg font-bold text-center">{t.q4}</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => handleQuizAnswer('season', 'winter')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    ❄️ {t.q4_opt1}
                  </button>
                  <button onClick={() => handleQuizAnswer('season', 'summer')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    ☀️ {t.q4_opt2}
                  </button>
                  <button onClick={() => handleQuizAnswer('season', 'all')} className="p-4 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                    🌍 {t.q4_opt3}
                  </button>
                </div>
              </div>
            )}

            {/* النتيجة النهائية: العطر الأساسي والبديل */}
            {quizStep === 4 && matchedPerfumes.primary && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <span className="text-xs uppercase tracking-widest text-amber-500 font-black">{t.matchFound}</span>
                  <h3 className="text-2xl md:text-3xl font-black mt-1">
                    {isRtl ? matchedPerfumes.primary.nameAr : matchedPerfumes.primary.name}
                  </h3>
                </div>

                <div className="relative max-w-sm mx-auto h-72 rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl">
                  <img src={matchedPerfumes.primary.image} alt={matchedPerfumes.primary.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                    <p className="text-xs text-stone-200">
                      {isRtl ? matchedPerfumes.primary.notesAr : matchedPerfumes.primary.notes}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => addToCart(matchedPerfumes.primary)}
                  className="w-full max-w-sm mx-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t.addToCart} ({matchedPerfumes.primary.price} {t.currency})</span>
                </button>

                {/* الخيار البديل في حال لم يفضل العميل الأول */}
                {matchedPerfumes.alternative && (
                  <div className="pt-6 border-t border-stone-700/50 space-y-4">
                    <h4 className="text-sm font-bold text-stone-400">{t.altMatch}</h4>
                    <div className={`p-4 rounded-2xl border flex items-center justify-between max-w-md mx-auto ${
                      isDark ? 'bg-stone-950/60 border-stone-800' : 'bg-stone-50 border-stone-200'
                    }`}>
                      <div className="flex items-center gap-3 text-start">
                        <img src={matchedPerfumes.alternative.image} alt="" className="w-16 h-16 object-cover rounded-xl border border-stone-700" />
                        <div>
                          <h5 className="font-bold text-sm">{isRtl ? matchedPerfumes.alternative.nameAr : matchedPerfumes.alternative.name}</h5>
                          <span className="text-xs text-amber-500 font-bold">{matchedPerfumes.alternative.price} {t.currency}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => addToCart(matchedPerfumes.alternative)}
                        className="p-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition"
                      >
                        {t.addToCart}
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setQuizStep(0)}
                  className="text-xs text-stone-400 hover:text-amber-500 flex items-center justify-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.tryAgain}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* صفحة النقاط والمكافآت */}
        {activeTab === 'rewards' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {!session ? (
              <div className={`p-10 rounded-3xl border text-center space-y-4 ${
                isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-xl'
              }`}>
                <Award className="w-12 h-12 text-amber-500 mx-auto" />
                <h2 className="text-2xl font-bold">{t.myPoints}</h2>
                <p className="text-stone-400 text-sm">{t.heroBadge}</p>
                <button 
                  onClick={handleGoogleLogin}
                  className="bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-2xl hover:bg-amber-400 transition shadow-lg"
                >
                  {t.loginWithGoogle}
                </button>
              </div>
            ) : (
              <div className={`p-8 rounded-3xl border space-y-6 ${
                isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-xl'
              }`}>
                <div className="flex justify-between items-center border-b border-stone-700/40 pb-4">
                  <div className="flex items-center gap-3">
                    {profile?.avatar_url && (
                      <img src={profile.avatar_url} alt="Profile" className="w-12 h-12 rounded-full border border-amber-500" />
                    )}
                    <div>
                      <h2 className="text-lg font-bold">{profile?.full_name}</h2>
                      <span className="text-xs text-stone-400">{profile?.email}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-500 px-3 py-1 rounded-xl font-bold">
                    {profile?.tier || 'VIP'}
                  </span>
                </div>
                <div className={`p-5 rounded-2xl border flex justify-between items-center ${
                  isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  <div>
                    <span className="text-xs text-stone-400">{t.welcomePointsMsg}</span>
                    <div className="text-4xl font-black text-amber-500 mt-1">{profile?.points_balance || 0}</div>
                    <span className="text-xs text-stone-400 mt-1 block">
                      = {((profile?.points_balance || 0) * 0.5)} {t.currency}
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs px-4 py-2.5 rounded-xl font-bold transition shadow"
                  >
                    {t.cart}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* لوحة تحكم الإدارة */}
        {activeTab === 'admin' && profile?.role === 'admin' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
              <ShieldCheck className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold">{t.admin}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-3xl border flex items-center justify-between ${
                isDark ? 'bg-stone-900/80 border-stone-800' : 'bg-white border-stone-200 shadow'
              }`}>
                <div>
                  <span className="text-stone-400 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span>{t.totalVisitors}</span>
                  </span>
                  <div className="text-4xl font-black mt-2">{visitorCount}</div>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  <Eye className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <div className={`p-6 rounded-3xl border ${
                isDark ? 'bg-stone-900/80 border-stone-800' : 'bg-white border-stone-200 shadow'
              }`}>
                <span className="text-stone-400 text-sm">Superadmin</span>
                <div className="text-lg font-bold mt-2">{profile?.email}</div>
                <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded mt-2 inline-block font-semibold">Active</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
