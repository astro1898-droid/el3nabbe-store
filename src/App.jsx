import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  Award, Gift, Share2, Sparkles, ShoppingBag, 
  LogOut, Users, Eye, ShieldCheck, Flame, 
  X, Plus, Minus, Send, Compass, Globe, Moon, Sun, 
  RefreshCw, Clock, CheckCircle2, ChevronDown, Package
} from 'lucide-react';

const STORE_WHATSAPP_NUMBER = "201110192901";

// قائمة العطور الاحترافية مع صور زجاجات عطور نقية (بدون أشخاص أو كريمات)
const PERFUMES = [
  // قسم الرجال
  {
    id: 1,
    name: "Imperial Valley",
    nameAr: "إمبريال فالي",
    brand: "Gissah",
    category: "men",
    family: "leather_oriental",
    occasion: "luxury",
    season: "all",
    tagAr: "ملكي فاخر",
    tagEn: "Royal Signature",
    notesAr: "دافانا، برغموت إيطالي، فلفل وردي، عنبر، عود أبيض",
    notesEn: "Davana, Italian Bergamot, Pink Pepper, Amber, White Oud",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 450, "50ml": 680, "100ml": 980, "tester": 250 }
  },
  {
    id: 2,
    name: "Bleu de Chanel",
    nameAr: "بلو دي شانيل",
    brand: "Chanel",
    category: "men",
    family: "fresh_woody",
    occasion: "daily_office",
    season: "summer",
    tagAr: "الأكثر مبيعاً",
    tagEn: "Iconic Fresh",
    notesAr: "جريب فروت، ليمون، نعناع، خشب الأرز، صندل",
    notesEn: "Grapefruit, Lemon, Mint, Cedarwood, Sandalwood",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 420, "50ml": 620, "100ml": 890, "tester": 220 }
  },
  {
    id: 3,
    name: "Prada Luna Rossa Black",
    nameAr: "برادا بلاك",
    brand: "Prada",
    category: "men",
    family: "amber_powdery",
    occasion: "evening",
    season: "winter",
    tagAr: "غامض ودافئ",
    tagEn: "Dark & Warm",
    notesAr: "برغموت، أنجليكا، باتشولي، عنبر، كومارين",
    notesEn: "Bergamot, Angelica, Patchouli, Amber, Coumarin",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 400, "50ml": 600, "100ml": 850, "tester": 200 }
  },
  {
    id: 4,
    name: "Creed Aventus",
    nameAr: "كريد أفينتوس",
    brand: "Creed",
    category: "men",
    family: "fruity_smoky",
    occasion: "luxury",
    season: "all",
    tagAr: "عطر الملوك",
    tagEn: "Legendary",
    notesAr: "أناناس، بتولا مدخنة، كشمش أسود، مسك نقي",
    notesEn: "Pineapple, Smoky Birch, Blackcurrant, Rich Musk",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 550, "50ml": 790, "100ml": 1150, "tester": 280 }
  },
  {
    id: 5,
    name: "Sauvage Elixir",
    nameAr: "سوفاج إلكسير",
    brand: "Dior",
    category: "men",
    family: "spicy_deep",
    occasion: "evening",
    season: "winter",
    tagAr: "ثبات وفوحان جبار",
    tagEn: "Beast Mode",
    notesAr: "جوزة الطيب، قرفة، هيل، لافندر فرنسي، عرق سوس",
    notesEn: "Nutmeg, Cinnamon, Cardamom, French Lavender, Licorice",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 500, "50ml": 750, "100ml": 1050, "tester": 260 }
  },
  {
    id: 6,
    name: "Oud Wood",
    nameAr: "عود وود",
    brand: "Tom Ford",
    category: "men",
    family: "leather_oriental",
    occasion: "luxury",
    season: "winter",
    tagAr: "عود مدخن فاخر",
    tagEn: "Smoky Oud",
    notesAr: "خشب العود النادر، خشب الورد، هيل، حبوب التونكا",
    notesEn: "Rare Agarwood, Rosewood, Cardamom, Tonka Bean",
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 520, "50ml": 780, "100ml": 1100, "tester": 270 }
  },
  {
    id: 7,
    name: "The Most Wanted",
    nameAr: "ذا موست وانتد",
    brand: "Azzaro",
    category: "men",
    family: "gourmand_sweet",
    occasion: "dating",
    season: "winter",
    tagAr: "سلاح المواعيد",
    tagEn: "Date Weapon",
    notesAr: "حب الهال، توفي مكرمل، فانيليا البوربون",
    notesEn: "Cardamom, Caramel Toffee, Bourbon Vanilla",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 390, "50ml": 580, "100ml": 820, "tester": 200 }
  },
  {
    id: 8,
    name: "9 PM",
    nameAr: "ناين بي إم",
    brand: "Afnan",
    category: "men",
    family: "gourmand_sweet",
    occasion: "evening",
    season: "winter",
    tagAr: "جاذبية السهرات",
    tagEn: "Night Magnet",
    notesAr: "تفاح أحمر، قرفة دافئة، لافندر بري، فانيليا ناعمة",
    notesEn: "Red Apple, Warm Cinnamon, Wild Lavender, Vanilla",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 320, "50ml": 480, "100ml": 680, "tester": 160 }
  },
  {
    id: 9,
    name: "Invictus",
    nameAr: "إنفكتوس",
    brand: "Paco Rabanne",
    category: "men",
    family: "fresh_aquatic",
    occasion: "daily_office",
    season: "summer",
    tagAr: "انتعاش البطولة",
    tagEn: "Victory Fresh",
    notesAr: "نوتات بحرية، جريب فروت، ورق الغار، خشب الغاياك",
    notesEn: "Marine Accords, Grapefruit, Bay Leaf, Guaiac Wood",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 380, "50ml": 560, "100ml": 790, "tester": 190 }
  },
  {
    id: 10,
    name: "Ultra Male",
    nameAr: "ألترا ميل",
    brand: "Jean Paul Gaultier",
    category: "men",
    family: "gourmand_sweet",
    occasion: "dating",
    season: "winter",
    tagAr: "سيد السهرات",
    tagEn: "Party King",
    notesAr: "كمثرى مقرمشة، لافندر، نعناع، فانيليا سوداء",
    notesEn: "Crisp Pear, Lavender, Mint, Black Vanilla",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 420, "50ml": 630, "100ml": 880, "tester": 220 }
  },
  {
    id: 11,
    name: "Stronger With You Intensely",
    nameAr: "سترونجر ويذ يو إنتنسلي",
    brand: "Armani",
    category: "men",
    family: "gourmand_sweet",
    occasion: "dating",
    season: "winter",
    tagAr: "دفء الشتاء الأول",
    tagEn: "Winter Warmth",
    notesAr: "فلفل وردي، توفي دسم، قرفة، جلد الغزال، فانيليا",
    notesEn: "Pink Pepper, Toffee, Cinnamon, Suede, Rich Vanilla",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 450, "50ml": 660, "100ml": 920, "tester": 240 }
  },
  {
    id: 12,
    name: "Black XS For Men",
    nameAr: "بلاك إكس إس رجالي",
    brand: "Paco Rabanne",
    category: "men",
    family: "fruity_sweet",
    occasion: "dating",
    season: "winter",
    tagAr: "روك أند رول",
    tagEn: "Rebel Charm",
    notesAr: "ليمون كالابريا، حلوى البرالين، قرفة، عنبر أسود",
    notesEn: "Calabrian Lemon, Praline, Cinnamon, Black Amber",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 380, "50ml": 550, "100ml": 780, "tester": 190 }
  },

  // قسم النساء
  {
    id: 13,
    name: "Good Girl",
    nameAr: "جود جيرل",
    brand: "Carolina Herrera",
    category: "women",
    family: "sweet_floral",
    occasion: "evening",
    season: "winter",
    tagAr: "أنثوي ساحر",
    tagEn: "Sensual Chic",
    notesAr: "لوز، قهوة محمصة، مسك الروم، ياسمين، كاكاو",
    notesEn: "Almond, Roasted Coffee, Tuberose, Jasmine, Cocoa",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 430, "50ml": 640, "100ml": 890, "tester": 230 }
  },
  {
    id: 14,
    name: "Scandal",
    nameAr: "سكاندال",
    brand: "Jean Paul Gaultier",
    category: "women",
    family: "gourmand_sweet",
    occasion: "dating",
    season: "winter",
    tagAr: "عسل وكراميل مركز",
    tagEn: "Honey Bomb",
    notesAr: "برتقال دموي، عسل طبيعي نقي، غاردينيا، باتشولي",
    notesEn: "Blood Orange, Pure Honey, Gardenia, Warm Patchouli",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 440, "50ml": 650, "100ml": 910, "tester": 230 }
  },
  {
    id: 15,
    name: "Baccarat Rouge 540",
    nameAr: "باكارات روج 540",
    brand: "Maison Francis Kurkdjian",
    category: "women",
    family: "sweet_amber",
    occasion: "luxury",
    season: "all",
    tagAr: "قمة الفخامة",
    tagEn: "Supreme Luxe",
    notesAr: "زعفران أحمر، ياسمين مصري، خشب العنبر، كتل العنبر",
    notesEn: "Red Saffron, Egyptian Jasmine, Amberwood, Ambergris",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 580, "50ml": 820, "100ml": 1190, "tester": 290 }
  },
  {
    id: 16,
    name: "Yara Candy",
    nameAr: "يارا كاندي",
    brand: "Lattafa",
    category: "women",
    family: "fruity_sweet",
    occasion: "daily_office",
    season: "all",
    tagAr: "كاندي وفراولة",
    tagEn: "Sweet Candy",
    notesAr: "يوسفي، كشمش أحمر، فوار الفراولة، فانيليا سكرية",
    notesEn: "Mandarin, Redcurrant, Strawberry Fizz, Sugar Vanilla",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 310, "50ml": 460, "100ml": 640, "tester": 150 }
  },
  {
    id: 17,
    name: "Jimmy Choo EDP",
    nameAr: "جيمي شو النسائي",
    brand: "Jimmy Choo",
    category: "women",
    family: "sweet_floral",
    occasion: "daily_office",
    season: "all",
    tagAr: "أناقة ناعمة",
    tagEn: "Modern Grace",
    notesAr: "كمثرى، ماندارين حلو، زهرة الأوركيد، توفي دافئ",
    notesEn: "Pear, Sweet Mandarin, Tiger Orchid, Warm Toffee",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 390, "50ml": 570, "100ml": 790, "tester": 200 }
  },
  {
    id: 18,
    name: "Khamrah",
    nameAr: "خمرة",
    brand: "Lattafa",
    category: "women",
    family: "spicy_gourmand",
    occasion: "evening",
    season: "winter",
    tagAr: "فخامة التمر والقرفة",
    tagEn: "Warm Dates",
    notesAr: "قرفة فاخرة، جوزة الطيب، تمور، حلوى البرالين، فانيليا",
    notesEn: "Cinnamon, Nutmeg, Dates Accord, Praline, Vanilla",
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 350, "50ml": 510, "100ml": 720, "tester": 180 }
  },
  {
    id: 19,
    name: "Khamrah Qahwa",
    nameAr: "خمرة قهوة",
    brand: "Lattafa",
    category: "women",
    family: "spicy_gourmand",
    occasion: "evening",
    season: "winter",
    tagAr: "قهوة عربية دافئة",
    tagEn: "Arabic Coffee",
    notesAr: "زنجبيل، هيل، حبوب القهوة المحمصة، فواكه مجففة",
    notesEn: "Ginger, Cardamom, Roasted Coffee Beans, Candied Fruits",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 370, "50ml": 540, "100ml": 760, "tester": 190 }
  },
  {
    id: 20,
    name: "Black XS For Her",
    nameAr: "بلاك إكس إس نسائي",
    brand: "Paco Rabanne",
    category: "women",
    family: "fruity_sweet",
    occasion: "evening",
    season: "winter",
    tagAr: "أنوثة متمردة",
    tagEn: "Sensual Rock",
    notesAr: "توت بري، فلفل وردي، بنفسج أسود، كاكاو، فانيليا",
    notesEn: "Cranberry, Pink Pepper, Black Violet, Cacao, Vanilla",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 390, "50ml": 580, "100ml": 810, "tester": 200 }
  },
  {
    id: 21,
    name: "Bianco Latte",
    nameAr: "بيانكو لاتي",
    brand: "Giardini Di Toscana",
    category: "women",
    family: "gourmand_sweet",
    occasion: "daily_office",
    season: "winter",
    tagAr: "حليب الكراميل الفاخر",
    tagEn: "Creamy Caramel",
    notesAr: "كراميل دسم، عسل نقي، فانيليا مركزة، مسك أبيض",
    notesEn: "Caramel, Pure Honey, Dense Vanilla, White Musk",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 520, "50ml": 760, "100ml": 1090, "tester": 270 }
  },
  {
    id: 22,
    name: "Midnight Rain",
    nameAr: "ميدنايت رين",
    brand: "La Prairie",
    category: "women",
    family: "fruity_sweet",
    occasion: "evening",
    season: "all",
    tagAr: "عطر المطر والغموض",
    tagEn: "Mystic Rain",
    notesAr: "جوافة، رمان، زنبق أبيض، أوركيد، باتشولي، كشمير",
    notesEn: "Guava, Pomegranate, White Lily, Orchid, Cashmere Wood",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 510, "50ml": 740, "100ml": 1050, "tester": 260 }
  },
  {
    id: 23,
    name: "Sense by Georgina",
    nameAr: "سنس جورجينا",
    brand: "Laverne",
    category: "women",
    family: "sweet_floral",
    occasion: "daily_office",
    season: "all",
    tagAr: "عطر جورجينا الأنيق",
    tagEn: "Celebrity Touch",
    notesAr: "كشمش أسود، ماندارين، ياسمين فرنسي، كشميران، عنبر",
    notesEn: "Blackcurrant, Mandarin, French Jasmine, Cashmeran, Amber",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 420, "50ml": 620, "100ml": 860, "tester": 210 }
  },
  {
    id: 24,
    name: "Burberry Her EDP",
    nameAr: "بربري هير",
    brand: "Burberry",
    category: "women",
    family: "fruity_sweet",
    occasion: "daily_office",
    season: "summer",
    tagAr: "سلة التوت البري",
    tagEn: "British Berries",
    notesAr: "فراولة، توت العليق، كشمش أسود، ياسمين، مسك",
    notesEn: "Strawberry, Raspberry, Blackberry, Jasmine, Clean Musk",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 440, "50ml": 650, "100ml": 910, "tester": 220 }
  },
  {
    id: 25,
    name: "Victoria's Secret Bombshell",
    nameAr: "فيكتوريا سيكريت بومبشيل",
    brand: "Victoria's Secret",
    category: "women",
    family: "fresh_aquatic",
    occasion: "daily_office",
    season: "summer",
    tagAr: "انتعاش الزهور والفواكه",
    tagEn: "Fruity Breeze",
    notesAr: "باشن فروت، جريب فروت، أناناس، زهور الفاوانيا",
    notesEn: "Passionfruit, Grapefruit, Pineapple, Peony, Orchid",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    prices: { "30ml": 320, "50ml": 480, "100ml": 690, "tester": 160 }
  }
];

export default function App() {
  const [lang, setLang] = useState('ar');
  const [theme, setTheme] = useState('dark');
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'orders', 'quiz', 'rewards', 'admin'
  const [activeGenderSection, setActiveGenderSection] = useState('men'); // 'men' or 'women'
  const [visitorCount, setVisitorCount] = useState(0);
  const [notification, setNotification] = useState('');

  // سلة المشتريات
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({}); // { [perfumeId]: "50ml" }
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [shippingDetails, setShippingDetails] = useState({ name: '', phone: '', address: '' });

  // قائمة الطلبات المباشرة
  const [ordersList, setOrdersList] = useState([]);

  // مستكشف العطور
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
      if (session) {
        fetchProfile(session.user.id);
        fetchOrders(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchOrders(session.user.id);
      } else {
        setProfile(null);
        setOrdersList([]);
      }
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

  const fetchOrders = async (userId) => {
    const { data } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setOrdersList(data);
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

  // التحكم في حجم العطر المختار لكل كارت
  const handleSizeChange = (perfumeId, size) => {
    setSelectedSizes(prev => ({ ...prev, [perfumeId]: size }));
  };

  const getSelectedSize = (perfumeId) => selectedSizes[perfumeId] || "50ml";

  const addToCart = (perfume) => {
    const size = getSelectedSize(perfume.id);
    const price = perfume.prices[size];
    const pointsReward = Math.round(price * 0.1);
    const cartItemId = `${perfume.id}-${size}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item => item.cartItemId === cartItemId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...perfume, cartItemId, chosenSize: size, price, pointsReward, qty: 1 }];
    });
    setIsCartOpen(true);
    showToast(lang === 'ar' ? `تمت إضافة ${perfume.nameAr} (${size}) للسلة` : `Added ${perfume.name} (${size}) to bag`);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // الحسابات المالية للسلة
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const potentialPointsEarned = cart.reduce((acc, item) => acc + (item.pointsReward * item.qty), 0);
  const maxRedeemablePoints = profile ? Math.min(profile.points_balance, Math.floor(subtotal / 0.5)) : 0;
  const discountAmount = pointsToRedeem * 0.5;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // إتمام الطلب وتحديث الحالات (In Progress)
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return showToast(lang === 'ar' ? 'السلة فارغة' : 'Bag is empty');
    if (!shippingDetails.name || !shippingDetails.phone || !shippingDetails.address) {
      return showToast(lang === 'ar' ? 'يرجى إكمال الاسم والموبايل والعنوان' : 'Fill all shipping info');
    }

    // 1. تحديث رصيد النقاط
    if (pointsToRedeem > 0 && profile) {
      const updatedBalance = profile.points_balance - pointsToRedeem + potentialPointsEarned;
      await supabase.from('profiles').update({ points_balance: updatedBalance }).eq('id', profile.id);
      await supabase.from('points_ledger').insert([{
        user_id: profile.id,
        amount: -pointsToRedeem,
        description: `استبدال نقاط لطلب الشراء بقيمة ${discountAmount} ج.م`
      }]);
      setProfile(prev => ({ ...prev, points_balance: updatedBalance }));
    } else if (profile) {
      const updatedBalance = profile.points_balance + potentialPointsEarned;
      await supabase.from('profiles').update({ points_balance: updatedBalance }).eq('id', profile.id);
      setProfile(prev => ({ ...prev, points_balance: updatedBalance }));
    }

    // 2. إدخال الأوردر بحالة "قيد التنفيذ" (In Progress) في قاعدة البيانات
    const orderRecord = {
      user_id: profile?.id || null,
      customer_name: shippingDetails.name,
      customer_phone: shippingDetails.phone,
      shipping_address: shippingDetails.address,
      items: cart,
      subtotal: subtotal,
      discount: discountAmount,
      points_used: pointsToRedeem,
      total: finalTotal,
      status: 'قيد التنفيذ'
    };

    const { data: newOrder } = await supabase.from('orders').insert([orderRecord]).select();

    if (newOrder && newOrder[0]) {
      setOrdersList(prev => [newOrder[0], ...prev]);
    }

    // 3. تجهيز رسالة الواتساب
    const itemsList = cart.map(i => `- ${lang === 'ar' ? i.nameAr : i.name} [الحجم: ${i.chosenSize}] (العدد: ${i.qty}) = ${i.price * i.qty} ج.م`).join('\n');
    const msg = `*طلب جديد من متجر العنابي للعطور*\n\n` +
      `*بيانات العميل:*\n` +
      `الاسم: ${shippingDetails.name}\n` +
      `الموبايل: ${shippingDetails.phone}\n` +
      `العنوان: ${shippingDetails.address}\n\n` +
      `*تفاصيل الطلب:*\n${itemsList}\n\n` +
      `الإجمالي قبل الخصم: ${subtotal} ج.م\n` +
      (discountAmount > 0 ? `خصم النقاط: ${discountAmount} ج.م (${pointsToRedeem} نقطة)\n` : '') +
      `*المطلوب للدفع عند الاستلام: ${finalTotal} ج.م*\n` +
      `النقاط المكتسبة من الطلب: +${potentialPointsEarned} نقطة\n` +
      `*حالة الطلب: قيد التنفيذ والمتابعة*`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${STORE_WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');

    setCart([]);
    setIsCartOpen(false);
    setPointsToRedeem(0);
    showToast(lang === 'ar' ? 'تم تحويل الطلب للواتساب وتسجيله بنجاح!' : 'Order submitted & WhatsApp opened!');
  };

  // معالجة أسئلة مستكشف العطور
  const handleQuizAnswer = (key, value) => {
    const updatedAnswers = { ...quizAnswers, [key]: value };
    setQuizAnswers(updatedAnswers);

    if (quizStep < 3) {
      setQuizStep(prev => prev + 1);
    } else {
      let filtered = PERFUMES.filter(p => {
        if (updatedAnswers.gender === 'men') return p.category === 'men';
        if (updatedAnswers.gender === 'women') return p.category === 'women';
        return true;
      });

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
        isDark ? 'bg-[#09090b] text-stone-100 selection:bg-amber-500 selection:text-black' : 'bg-[#faf9f6] text-stone-900 selection:bg-amber-400 selection:text-black'
      }`}
    >
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-stone-950 px-6 py-2.5 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-amber-300">
          <Sparkles className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* الشريط العلوي المتجاوب للموبايل والكمبيوتر */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
        isDark ? 'border-stone-800 bg-[#09090b]/90' : 'border-stone-200 bg-white/90 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('shop')}>
            <span className="text-xl md:text-3xl font-black tracking-tight flex items-center gap-1.5">
              EL3NABBE <span className="text-amber-500 text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded border border-amber-500/30">PERFUMES</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3">
            <button 
              onClick={() => setActiveTab('shop')}
              className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition ${
                activeTab === 'shop' ? 'bg-amber-500 text-stone-950' : (isDark ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-black')
              }`}
            >
              {lang === 'ar' ? 'المتجر' : 'Shop'}
            </button>

            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-1 ${
                activeTab === 'orders' ? 'bg-amber-500 text-stone-950' : (isDark ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-black')
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'طلباتي' : 'Orders'}</span>
            </button>

            <button 
              onClick={() => { setActiveTab('quiz'); setQuizStep(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-1 ${
                activeTab === 'quiz' ? 'bg-amber-500 text-stone-950' : (isDark ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-black')
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'المستكشف' : 'Quiz'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('rewards')}
              className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-1 ${
                activeTab === 'rewards' ? 'bg-amber-500 text-stone-950' : (isDark ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-black')
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'النقاط' : 'Points'}</span>
              {profile ? ` (${profile.points_balance})` : ''}
            </button>

            {/* سلة الشراء */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 md:p-2.5 rounded-xl border transition ${
                isDark ? 'bg-stone-900 border-stone-800 text-amber-400 hover:border-amber-500' : 'bg-stone-100 border-stone-300 text-stone-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full font-bold flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>

            {/* تبديل الوضع الليلي / النهاري */}
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 md:p-2.5 rounded-xl border transition ${
                isDark ? 'bg-stone-900 border-stone-800 text-amber-400' : 'bg-stone-100 border-stone-300 text-stone-700'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* تبديل اللغة */}
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className={`px-2 md:px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-bold border transition ${
                isDark ? 'bg-stone-900 border-stone-800 text-stone-200' : 'bg-stone-100 border-stone-300 text-stone-800'
              }`}
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            {session ? (
              <button onClick={handleLogout} className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition">
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleGoogleLogin} 
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-stone-950 font-bold text-xs border border-stone-300 shadow"
              >
                <span>Google</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* سلة الشراء الجانبية */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md border-r h-full flex flex-col justify-between p-5 md:p-6 overflow-y-auto ${
            isDark ? 'bg-[#0f0f13] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-4 border-stone-700/50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-base md:text-lg">{lang === 'ar' ? 'سلة الطلبات' : 'Cart'}</h3>
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">
                    {lang === 'ar' ? 'معلق (Pending)' : 'Pending'}
                  </span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 hover:opacity-75">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 text-stone-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                  <p>{lang === 'ar' ? 'سلتك فارغة حالياً' : 'Your bag is empty'}</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                      isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-stone-50 border-stone-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-stone-800" />
                        <div>
                          <h4 className="font-bold text-sm">{isRtl ? item.nameAr : item.name}</h4>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-amber-500 font-bold">{item.price} ج.م</span>
                            <span className="text-stone-400 bg-stone-800 px-1.5 py-0.2 rounded text-[10px]">{item.chosenSize}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.cartItemId, -1)} className="p-1.5 rounded-lg bg-stone-800 text-white">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-sm px-1">{item.qty}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, 1)} className="p-1.5 rounded-lg bg-stone-800 text-white">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* شريط خصم النقاط */}
                  {profile && profile.points_balance > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-amber-500">{lang === 'ar' ? 'استبدال النقاط لخصم:' : 'Redeem Points:'}</span>
                        <span className="font-bold">{pointsToRedeem} نقطة = {discountAmount} ج.م</span>
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
                      <span className="text-[11px] text-stone-400 block">{lang === 'ar' ? 'رصيدك المتاح:' : 'Balance:'} {profile.points_balance} نقطة</span>
                    </div>
                  )}

                  {/* ملخص المبالغ */}
                  <div className="border-t border-stone-700/50 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-400">
                      <span>{lang === 'ar' ? 'الإجمالي قبل الخصم:' : 'Subtotal:'}</span>
                      <span>{subtotal} ج.م</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-500 font-semibold">
                        <span>{lang === 'ar' ? 'خصم النقاط:' : 'Discount:'}</span>
                        <span>-{discountAmount} ج.م</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-400">
                      <span>{lang === 'ar' ? 'النقاط المكتسبة:' : 'Points Earned:'}</span>
                      <span className="text-amber-500 font-bold">+{potentialPointsEarned} نقطة</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold pt-2 border-t border-stone-700/50">
                      <span>{lang === 'ar' ? 'المطلوب للدفع عند الاستلام:' : 'Total:'}</span>
                      <span className="text-amber-500">{finalTotal} ج.م</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* نموذج تفاصيل الشحن والتأكيد */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="border-t border-stone-700/50 pt-4 space-y-3">
                <input 
                  type="text" 
                  placeholder={lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                  required
                  value={shippingDetails.name}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 outline-none ${
                    isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-300'
                  }`}
                />
                <input 
                  type="tel" 
                  placeholder={lang === 'ar' ? 'رقم الموبايل (واتساب) *' : 'Phone *'}
                  required
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 outline-none ${
                    isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-300'
                  }`}
                />
                <textarea 
                  placeholder={lang === 'ar' ? 'المحافظة والعنوان بالتفصيل *' : 'Address *'}
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
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تأكيد الطلب وتفعيل المتابعة' : 'Submit & Track'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {activeTab === 'shop' && (
          <div className="space-y-8">
            {/* أزرار التبديل الرئيسية للأقسام: رجالي / حريمي (مناسبة جداً للموبايل) */}
            <div className="flex rounded-2xl p-1.5 max-w-md mx-auto border border-stone-800 bg-stone-900/60">
              <button 
                onClick={() => setActiveGenderSection('men')}
                className={`flex-1 py-3 rounded-xl font-black text-sm md:text-base flex items-center justify-center gap-2 transition ${
                  activeGenderSection === 'men' ? 'bg-amber-500 text-stone-950 shadow-lg' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>{lang === 'ar' ? 'قسم الرجال (Men)' : "Men's Section"}</span>
              </button>

              <button 
                onClick={() => setActiveGenderSection('women')}
                className={`flex-1 py-3 rounded-xl font-black text-sm md:text-base flex items-center justify-center gap-2 transition ${
                  activeGenderSection === 'women' ? 'bg-amber-500 text-stone-950 shadow-lg' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ar' ? 'قسم النساء (Women)' : "Women's Section"}</span>
              </button>
            </div>

            {/* شبكة العطور الخاصة بالقسم المختار متجاوبة 100% مع الموبايل */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {PERFUMES.filter(p => p.category === activeGenderSection).map((perfume) => {
                const currentSize = getSelectedSize(perfume.id);
                const currentPrice = perfume.prices[currentSize];
                const points = Math.round(currentPrice * 0.1);

                return (
                  <div 
                    key={perfume.id} 
                    className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-amber-500/60 ${
                      isDark ? 'bg-stone-900/70 border-stone-800' : 'bg-white border-stone-200 shadow-md'
                    }`}
                  >
                    {/* صورة الزجاجة النقية */}
                    <div className="relative h-64 md:h-60 overflow-hidden bg-stone-950">
                      <img 
                        src={perfume.image} 
                        alt={perfume.name} 
                        className="w-full h-full object-cover hover:scale-105 transition duration-500" 
                      />
                      <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-amber-400 text-[10px] px-2.5 py-1 rounded-lg border border-stone-700 font-bold">
                        {isRtl ? perfume.tagAr : perfume.tagEn}
                      </span>
                      <span className="absolute bottom-3 left-3 bg-stone-950/90 text-stone-300 text-[10px] px-2 py-0.5 rounded border border-stone-800">
                        {perfume.brand}
                      </span>
                    </div>

                    {/* بيانات وتفاصيل العطر */}
                    <div className="p-4 md:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-black text-base md:text-lg mb-1">{isRtl ? perfume.nameAr : perfume.name}</h3>
                        <p className="text-stone-400 text-xs line-clamp-2">{isRtl ? perfume.notesAr : perfume.notesEn}</p>
                      </div>

                      {/* اختيار الأحجام (30ML / 50ML / 100ML / Tester) */}
                      <div>
                        <span className="text-[11px] font-bold text-stone-400 block mb-1.5">
                          {lang === 'ar' ? 'اختر الحجم:' : 'Select Size:'}
                        </span>
                        <div className="grid grid-cols-4 gap-1 text-[11px] font-bold">
                          {["30ml", "50ml", "100ml", "tester"].map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSizeChange(perfume.id, sz)}
                              className={`py-1.5 rounded-lg border text-center transition ${
                                currentSize === sz 
                                  ? 'bg-amber-500 text-stone-950 border-amber-500' 
                                  : (isDark ? 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700' : 'bg-stone-100 border-stone-300 text-stone-700')
                              }`}
                            >
                              {sz === 'tester' ? (lang === 'ar' ? 'عينة' : 'Test') : sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* السعر والنقاط وزر الإضافة */}
                      <div className="border-t border-stone-700/40 pt-3">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-lg md:text-xl font-black text-amber-500">{currentPrice}</span>
                            <span className="text-xs text-stone-400 mr-1">ج.م</span>
                          </div>
                          <span className="text-[11px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded border border-amber-500/20">
                            +{points} نقطة
                          </span>
                        </div>

                        <button 
                          onClick={() => addToCart(perfume)}
                          className="w-full bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'أضف للسلة' : 'Add to Bag'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* صفحة تتبع الطلبات (Order Tracking & Status) */}
        {activeTab === 'orders' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-stone-700/40 pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-amber-500" />
                <h2 className="text-xl md:text-2xl font-black">{lang === 'ar' ? 'سجل متابعة الطلبات' : 'Order Tracking'}</h2>
              </div>
            </div>

            {/* حالة الطلبات المعلقة في السلة حالياً */}
            {cart.length > 0 && (
              <div className={`p-4 md:p-5 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <div>
                    <h4 className="font-bold text-sm">{lang === 'ar' ? 'طلبك الحالي في السلة' : 'Pending in Cart'}</h4>
                    <span className="text-xs text-stone-400">{cart.length} منتجات بانتظار الإرسال</span>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-amber-500 text-stone-950 rounded-full">
                  معلق (Pending)
                </span>
              </div>
            )}

            {/* قائمة الطلبات التي تم إرسالها (In Progress) */}
            {ordersList.length === 0 && cart.length === 0 ? (
              <div className="text-center py-16 text-stone-400 space-y-3">
                <Clock className="w-12 h-12 mx-auto stroke-1" />
                <p>{lang === 'ar' ? 'لا توجد طلبات سابقة مسجلة حتى الآن' : 'No past orders yet'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ordersList.map((order) => (
                  <div key={order.id} className={`p-5 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow'
                  }`}>
                    <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                      <div>
                        <span className="text-xs text-stone-400 block">{new Date(order.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                        <span className="text-sm font-bold text-amber-500">{order.total} ج.م</span>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{order.status || 'قيد التنفيذ (In Progress)'}</span>
                      </span>
                    </div>

                    <div className="text-xs text-stone-300 space-y-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>• {item.nameAr || item.name} ({item.chosenSize || '50ml'}) x {item.qty}</span>
                          <span className="text-stone-400">{item.price * item.qty} ج.م</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* مستكشف العطور الذكي متعدد المعايير مع البديل */}
        {activeTab === 'quiz' && (
          <div className={`max-w-xl mx-auto rounded-3xl border p-6 md:p-10 text-center space-y-6 ${
            isDark ? 'bg-stone-900/70 border-stone-800' : 'bg-white border-stone-200 shadow-xl'
          }`}>
            {quizStep < 4 && (
              <div>
                <Compass className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h2 className="text-xl md:text-2xl font-black">{lang === 'ar' ? 'مستكشف العطور الذكي' : 'Smart Scent Finder'}</h2>
                <p className="text-stone-400 text-xs mt-1">{lang === 'ar' ? 'أجب عن 4 أسئلة وسنرشح لك العطر الأنسب مع خيار بديل' : 'Answer 4 questions for primary & alternate matches'}</p>
              </div>
            )}

            {quizStep === 0 && (
              <div className="space-y-3 text-start">
                <h3 className="text-sm md:text-base font-bold text-center">{lang === 'ar' ? '1. تبحث عن عطر لمن؟' : '1. Who is it for?'}</h3>
                <button onClick={() => handleQuizAnswer('gender', 'men')} className="w-full p-3.5 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                  🎩 {lang === 'ar' ? 'رجالي (فخم وجريء)' : 'Gentlemen'}
                </button>
                <button onClick={() => handleQuizAnswer('gender', 'women')} className="w-full p-3.5 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                  👠 {lang === 'ar' ? 'نسائي (ناعم وساحر)' : 'Ladies'}
                </button>
              </div>
            )}

            {quizStep === 1 && (
              <div className="space-y-3 text-start">
                <h3 className="text-sm md:text-base font-bold text-center">{lang === 'ar' ? '2. المناسبة الأساسية؟' : '2. Primary Occasion?'}</h3>
                <button onClick={() => handleQuizAnswer('occasion', 'luxury')} className="w-full p-3.5 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                  ✨ {lang === 'ar' ? 'مناسبات رسمية وفخمة' : 'Formal Luxury'}
                </button>
                <button onClick={() => handleQuizAnswer('occasion', 'dating')} className="w-full p-3.5 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                  🕯️ {lang === 'ar' ? 'سهرات ومواعيد خاصة' : 'Date Nights'}
                </button>
                <button onClick={() => handleQuizAnswer('occasion', 'daily_office')} className="w-full p-3.5 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                  💼 {lang === 'ar' ? 'عمل واستخدام يومي متكرر' : 'Daily & Office'}
                </button>
              </div>
            )}

            {quizStep === 2 && (
              <div className="space-y-3 text-start">
                <h3 className="text-sm md:text-base font-bold text-center">{lang === 'ar' ? '3. الطابع العطري المفضل؟' : '3. Scent Family?'}</h3>
                <button onClick={() => handleQuizAnswer('profile', 'oriental')} className="w-full p-3.5 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                  🪵 {lang === 'ar' ? 'أخشاب وعود وجلود دافئة' : 'Woods & Oud'}
                </button>
                <button onClick={() => handleQuizAnswer('profile', 'sweet')} className="w-full p-3.5 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                  🍫 {lang === 'ar' ? 'حلويات وفانيليا وكراميل (Gourmand)' : 'Vanilla & Caramel'}
                </button>
                <button onClick={() => handleQuizAnswer('profile', 'fresh')} className="w-full p-3.5 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                  🍋 {lang === 'ar' ? 'حمضيات وانتعاش مائي وزهور هادئة' : 'Fresh Aquatics'}
                </button>
              </div>
            )}

            {quizStep === 3 && (
              <div className="space-y-3 text-start">
                <h3 className="text-sm md:text-base font-bold text-center">{lang === 'ar' ? '4. الفصل المفضل؟' : '4. Season?'}</h3>
                <button onClick={() => handleQuizAnswer('season', 'winter')} className="w-full p-3.5 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                  ❄️ {lang === 'ar' ? 'أجواء شتوية وباردة (يحتاج ثبات كثيف)' : 'Winter'}
                </button>
                <button onClick={() => handleQuizAnswer('season', 'summer')} className="w-full p-3.5 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                  ☀️ {lang === 'ar' ? 'أجواء صيفية ومعتدلة (يحتاج انتعاش خفيف)' : 'Summer'}
                </button>
                <button onClick={() => handleQuizAnswer('season', 'all')} className="w-full p-3.5 rounded-2xl border text-sm font-semibold hover:border-amber-500 transition bg-stone-950/40">
                  🌍 {lang === 'ar' ? 'عطر جوكر صالح لكل الفصول' : 'All Seasons'}
                </button>
              </div>
            )}

            {quizStep === 4 && matchedPerfumes.primary && (
              <div className="space-y-6">
                <div>
                  <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-1" />
                  <span className="text-[11px] uppercase tracking-widest text-amber-500 font-black">
                    {lang === 'ar' ? 'العطر الأنسب لذوقك 100%' : '100% Match'}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black mt-1">
                    {isRtl ? matchedPerfumes.primary.nameAr : matchedPerfumes.primary.name}
                  </h3>
                </div>

                <div className="relative max-w-xs mx-auto h-64 rounded-2xl overflow-hidden border border-amber-500/40 shadow-xl">
                  <img src={matchedPerfumes.primary.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <p className="text-xs text-stone-200">
                      {isRtl ? matchedPerfumes.primary.notesAr : matchedPerfumes.primary.notesEn}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => addToCart(matchedPerfumes.primary)}
                  className="w-full max-w-xs mx-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold py-3 rounded-2xl transition flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'أضف للسلة (50ml)' : 'Add to Bag (50ml)'}</span>
                </button>

                {matchedPerfumes.alternative && (
                  <div className="pt-4 border-t border-stone-800 space-y-3">
                    <h4 className="text-xs font-bold text-stone-400">{lang === 'ar' ? 'عطر بديل قد يعجبك أيضاً:' : 'Alternative option:'}</h4>
                    <div className="p-3 rounded-2xl border flex items-center justify-between max-w-xs mx-auto bg-stone-950 border-stone-800">
                      <div className="flex items-center gap-2 text-start">
                        <img src={matchedPerfumes.alternative.image} alt="" className="w-12 h-12 object-cover rounded-xl" />
                        <div>
                          <h5 className="font-bold text-xs">{isRtl ? matchedPerfumes.alternative.nameAr : matchedPerfumes.alternative.name}</h5>
                          <span className="text-[11px] text-amber-500 font-bold">{matchedPerfumes.alternative.prices["50ml"]} ج.م</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => addToCart(matchedPerfumes.alternative)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-[11px]"
                      >
                        {lang === 'ar' ? 'طلب' : 'Add'}
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setQuizStep(0)}
                  className="text-xs text-stone-400 hover:text-amber-500 flex items-center justify-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إعادة الاختبار' : 'Restart'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* صفحة النقاط */}
        {activeTab === 'rewards' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {!session ? (
              <div className="p-8 rounded-3xl border border-stone-800 bg-stone-900/60 text-center space-y-4">
                <Award className="w-10 h-10 text-amber-500 mx-auto" />
                <h2 className="text-xl font-bold">{lang === 'ar' ? 'نادي مكافآت العنابي' : 'Rewards Club'}</h2>
                <p className="text-stone-400 text-xs">سجّل دخولك الآن بـ Google واكسب 50 نقطة ترحيبية فورية تُخصم من طلباتك.</p>
                <button onClick={handleGoogleLogin} className="bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-2xl text-sm">
                  الدخول بحساب Google
                </button>
              </div>
            ) : (
              <div className="p-6 md:p-8 rounded-3xl border border-stone-800 bg-stone-900/60 space-y-6">
                <div className="flex justify-between items-center border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    {profile?.avatar_url && (
                      <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full border border-amber-500" />
                    )}
                    <div>
                      <h2 className="text-base font-bold">{profile?.full_name}</h2>
                      <span className="text-xs text-stone-400">{profile?.email}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-500/10 text-amber-500 px-3 py-1 rounded-xl font-bold border border-amber-500/30">
                    عضوية {profile?.tier || 'ذهبية'}
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-stone-400">رصيدك المتاح من النقاط:</span>
                    <div className="text-3xl font-black text-amber-500 mt-1">{profile?.points_balance || 0}</div>
                    <span className="text-xs text-stone-400 mt-1 block">تساوي خصم {((profile?.points_balance || 0) * 0.5)} ج.م</span>
                  </div>
                  <button onClick={() => setIsCartOpen(true)} className="bg-amber-500 text-stone-950 text-xs px-4 py-2 rounded-xl font-bold">
                    استخدمها في السلة
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
