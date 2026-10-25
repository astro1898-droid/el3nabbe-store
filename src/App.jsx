import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  Award, Gift, Share2, Sparkles, ShoppingBag, 
  LogOut, Users, Eye, ShieldCheck, Flame, 
  X, Plus, Minus, Send, Compass
} from 'lucide-react';

const PERFUMES = [
  {
    id: 1,
    name: "العنابي الملكي (Royal El3nabbe)",
    notes: "عود كمبودي، عنبر ملكي، هيل فاخر",
    family: "woody",
    occasion: "evening",
    price: 650,
    pointsReward: 65,
    tag: "الأكثر طلباً",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "سحر الشرق (Velvet Seduction)",
    notes: "فانيليا مدخنة، حبوب القهوة، صندل",
    family: "sweet",
    occasion: "dating",
    price: 590,
    pointsReward: 59,
    tag: "شتوي دافئ",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "نسيم الصباح (Pure Freshness)",
    notes: "برغموت إيطالي، لافندر ناعم، مسك أبيض",
    family: "fresh",
    occasion: "daily",
    price: 520,
    pointsReward: 52,
    tag: "يومي منعش",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"
  }
];

// رقم واتساب البيزنس بالصيغة الدولية لمصر
const STORE_WHATSAPP_NUMBER = "201110192901";

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'rewards', 'quiz', 'admin'
  const [visitorCount, setVisitorCount] = useState(0);
  const [notification, setNotification] = useState('');
  
  // حالة سلة المشتريات
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [shippingDetails, setShippingDetails] = useState({ name: '', phone: '', address: '' });

  // حالة اختبار اختيار العطر
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({ family: '', occasion: '' });
  const [recommendedPerfume, setRecommendedPerfume] = useState(null);

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
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
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

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) showToast('خطأ: ' + error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast('تم تسجيل الخروج بنجاح');
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
    showToast(`تمت إضافة ${perfume.name} للسلة`);
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

  // الحسابات المالية
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const potentialPointsEarned = cart.reduce((acc, item) => acc + (item.pointsReward * item.qty), 0);
  const maxRedeemablePoints = profile ? Math.min(profile.points_balance, Math.floor(subtotal / 0.5)) : 0;
  const discountAmount = pointsToRedeem * 0.5; // كل نقطة = 0.5 جنيه
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // إتمام الطلب وتجهيز رسالة الواتساب النظيفة
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return showToast('السلة فارغة!');
    if (!shippingDetails.name || !shippingDetails.phone || !shippingDetails.address) {
      return showToast('يرجى كتابة الاسم ورقم الموبايل والعنوان');
    }

    // 1. تحديث رصيد النقاط في قاعدة البيانات
    if (pointsToRedeem > 0 && profile) {
      const updatedBalance = profile.points_balance - pointsToRedeem + potentialPointsEarned;
      await supabase.from('profiles').update({ points_balance: updatedBalance }).eq('id', profile.id);
      await supabase.from('points_ledger').insert([{
        user_id: profile.id,
        amount: -pointsToRedeem,
        description: `استبدال نقاط لطلب الشراء بقيمة خصم ${discountAmount} جنيه`
      }]);
      setProfile(prev => ({ ...prev, points_balance: updatedBalance }));
    } else if (profile) {
      const updatedBalance = profile.points_balance + potentialPointsEarned;
      await supabase.from('profiles').update({ points_balance: updatedBalance }).eq('id', profile.id);
      setProfile(prev => ({ ...prev, points_balance: updatedBalance }));
    }

    // 2. تسجيل الطلب في Supabase
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

    // 3. صياغة رسالة الواتساب بدون رموز غير متوافقة
    const itemsList = cart.map(i => `- ${i.name} (الكمية: ${i.qty}) = ${i.price * i.qty} ج.م`).join('\n');
    const msg = `*طلب جديد من متجر العنابي للعطور*\n\n` +
      `*بيانات العميل:*\n` +
      `الاسم: ${shippingDetails.name}\n` +
      `الموبايل: ${shippingDetails.phone}\n` +
      `العنوان: ${shippingDetails.address}\n\n` +
      `*تفاصيل الطلب:*\n${itemsList}\n\n` +
      `الإجمالي قبل الخصم: ${subtotal} ج.م\n` +
      (discountAmount > 0 ? `خصم النقاط: ${discountAmount} ج.م (${pointsToRedeem} نقطة)\n` : '') +
      `*المطلوب للدفع عند الاستلام: ${finalTotal} ج.م*\n` +
      `النقاط المكتسبة من الطلب: +${potentialPointsEarned} نقطة`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${STORE_WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');

    setCart([]);
    setIsCartOpen(false);
    setPointsToRedeem(0);
    showToast('تم تأكيد الطلب بنجاح وفتح محادثة الواتساب');
  };

  const handleQuizChoice = (key, value) => {
    const nextAnswers = { ...quizAnswers, [key]: value };
    setQuizAnswers(nextAnswers);

    if (quizStep === 0) {
      setQuizStep(1);
    } else {
      const match = PERFUMES.find(p => p.family === nextAnswers.family) || PERFUMES[0];
      setRecommendedPerfume(match);
      setQuizStep(2);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#09090b] text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-stone-950 px-6 py-2.5 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-amber-300">
          <Sparkles className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* الشريط العلوي */}
      <header className="border-b border-stone-800 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('shop')}>
              العنابي <span className="text-amber-500 text-xs font-semibold px-2 py-0.5 rounded border border-amber-500/30">PERFUMES</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('shop')}
              className={`px-3 md:px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'shop' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'}`}
            >
              المتجر
            </button>
            <button 
              onClick={() => { setActiveTab('quiz'); setQuizStep(0); setRecommendedPerfume(null); }}
              className={`px-3 md:px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1 ${activeTab === 'quiz' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'}`}
            >
              <Compass className="w-4 h-4" />
              <span>مستكشف العطور</span>
            </button>
            <button 
              onClick={() => setActiveTab('rewards')}
              className={`px-3 md:px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${activeTab === 'rewards' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'}`}
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">نقاطي</span>
              {profile ? ` (${profile.points_balance})` : ''}
            </button>

            {profile?.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1 ${activeTab === 'admin' ? 'bg-red-600 text-white' : 'text-red-400 hover:bg-stone-900'}`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">الإدارة</span>
              </button>
            )}

            {/* سلة الشراء */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-400 hover:border-amber-500 transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 text-xs w-5 h-5 rounded-full font-bold flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>

            {/* تسجيل الدخول بـ Google أو الخروج */}
            {session ? (
              <button onClick={handleLogout} className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-red-400 transition" title="خروج">
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleGoogleLogin} className="px-3.5 py-2 rounded-xl bg-white text-stone-900 font-bold hover:bg-stone-200 transition text-xs flex items-center gap-1.5">
                <span>دخول بـ Google</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* سلة الشراء الجانبية */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e0e11] border-r border-stone-800 h-full flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b border-stone-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-lg text-white">سلة الطلبات</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-white p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-stone-500 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                  <p>سلتك فارغة حالياً</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-stone-950 p-3.5 rounded-2xl border border-stone-800/80">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-stone-800" />
                        <div>
                          <h4 className="font-bold text-sm text-white">{item.name}</h4>
                          <span className="text-xs text-amber-400 font-semibold">{item.price} ج.م</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-sm text-white px-1">{item.qty}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* شريط خصم النقاط */}
                  {profile && profile.points_balance > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-amber-300 font-semibold">استبدال نقاطك لخصم فوري:</span>
                        <span className="text-amber-400 font-bold">{pointsToRedeem} نقطة = {discountAmount} ج.م</span>
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
                      <span className="text-[11px] text-stone-400 block">رصيدك المتاح: {profile.points_balance} نقطة</span>
                    </div>
                  )}

                  {/* ملخص الحساب */}
                  <div className="border-t border-stone-800 pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-400">
                      <span>الإجمالي قبل الخصم:</span>
                      <span>{subtotal} ج.م</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>خصم النقاط:</span>
                        <span>-{discountAmount} ج.م</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-400">
                      <span>النقاط المكتسبة من الطلب:</span>
                      <span className="text-amber-400 font-bold">+{potentialPointsEarned} نقطة</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-stone-800">
                      <span>المطلوب للدفع عند الاستلام:</span>
                      <span className="text-amber-400">{finalTotal} ج.م</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* تفاصيل العميل وإرسال الواتساب */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="border-t border-stone-800 pt-4 space-y-3">
                <input 
                  type="text" 
                  placeholder="الاسم بالكامل *" 
                  required
                  value={shippingDetails.name}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 outline-none"
                />
                <input 
                  type="tel" 
                  placeholder="رقم الموبايل *" 
                  required
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm focus:border-amber-500 outline-none"
                />
                <textarea 
                  placeholder="العنوان بالتفصيل *" 
                  required
                  rows="2"
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-sm focus:border-amber-500 outline-none resize-none"
                />
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>تأكيد الطلب عبر WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* صفحة المتجر */}
        {activeTab === 'shop' && (
          <div className="space-y-10">
            <div className="rounded-3xl border border-stone-800 bg-gradient-to-r from-stone-900 via-[#181113] to-stone-900 p-8 md:p-12 relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs px-3 py-1 rounded-full font-bold mb-4">
                  ✦ سجّل حسابك واكسب 50 نقطة فورية في محفظتك
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                  عطور فاخرة تترك انطباعك أينما حللت
                </h1>
                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                  اطلب الآن بالدفع عند الاستلام مع خصومات مباشرة من رصيد نقاطك وسرعة شحن لجميع المحافظات.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => { setActiveTab('quiz'); setQuizStep(0); }} className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold px-6 py-3 rounded-2xl transition flex items-center gap-2 text-sm">
                    <Compass className="w-4 h-4" /> اختبر ذوقك العطري
                  </button>
                </div>
              </div>
            </div>

            {/* بطاقات العطور */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PERFUMES.map((perfume) => (
                <div key={perfume.id} className="bg-stone-900/60 rounded-3xl border border-stone-800/80 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img src={perfume.image} alt={perfume.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    <span className="absolute top-4 right-4 bg-stone-950/80 backdrop-blur-md text-amber-400 text-xs px-3 py-1 rounded-xl border border-stone-700">
                      {perfume.tag}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white mb-1">{perfume.name}</h3>
                      <p className="text-stone-400 text-xs mb-4">النوتات: {perfume.notes}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between border-t border-stone-800 pt-4 mb-4">
                        <div>
                          <span className="text-2xl font-black text-white">{perfume.price}</span>
                          <span className="text-xs text-stone-400 mr-1">جنيه</span>
                        </div>
                        <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-bold">
                          +{perfume.pointsReward} نقطة
                        </span>
                      </div>
                      <button 
                        onClick={() => addToCart(perfume)}
                        className="w-full bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-white font-bold py-3 rounded-2xl transition flex items-center justify-center gap-2 text-sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        أضف إلى السلة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* مستكشف العطور */}
        {activeTab === 'quiz' && (
          <div className="max-w-xl mx-auto bg-stone-900/80 border border-stone-800 p-8 rounded-3xl text-center space-y-6">
            {quizStep === 0 && (
              <div className="space-y-4">
                <Compass className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-xl font-bold text-white">ما هو الطابع العطري الأقرب لذوقك؟</h3>
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button onClick={() => handleQuizChoice('family', 'woody')} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500 text-right transition">
                    🌲 <b>أخشاب وعنبر:</b> فخم وله هيبة وحضور قوي
                  </button>
                  <button onClick={() => handleQuizChoice('family', 'sweet')} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500 text-right transition">
                    ☕ <b>فانيليا وقهوة:</b> دافئ ورومانسي
                  </button>
                  <button onClick={() => handleQuizChoice('family', 'fresh')} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500 text-right transition">
                    🍋 <b>حمضيات ولافندر:</b> منعش ونظيف للاستخدام اليومي
                  </button>
                </div>
              </div>
            )}

            {quizStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">ما هي المناسبة الأساسية التي تبحث عن عطر لها؟</h3>
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button onClick={() => handleQuizChoice('occasion', 'evening')} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500 text-right transition">
                    🌙 خروجات ومناسبات مسائية هامة
                  </button>
                  <button onClick={() => handleQuizChoice('occasion', 'daily')} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500 text-right transition">
                    ☀️ عمل واستخدام يومي متكرر
                  </button>
                </div>
              </div>
            )}

            {quizStep === 2 && recommendedPerfume && (
              <div className="space-y-4">
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
                <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">العطر الأنسب لاختياراتك</span>
                <h3 className="text-2xl font-black text-white">{recommendedPerfume.name}</h3>
                <img src={recommendedPerfume.image} alt={recommendedPerfume.name} className="w-48 h-48 object-cover rounded-2xl mx-auto border border-amber-500/40" />
                <p className="text-stone-400 text-xs">{recommendedPerfume.notes}</p>
                <button 
                  onClick={() => addToCart(recommendedPerfume)}
                  className="w-full bg-amber-500 text-stone-950 font-bold py-3.5 rounded-2xl hover:bg-amber-400 transition"
                >
                  أضف العطر الموصى به للسلة ({recommendedPerfume.price} ج.م)
                </button>
              </div>
            )}
          </div>
        )}

        {/* صفحة النقاط */}
        {activeTab === 'rewards' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {!session ? (
              <div className="bg-stone-900/70 p-8 rounded-3xl border border-stone-800 text-center space-y-4">
                <Award className="w-12 h-12 text-amber-400 mx-auto" />
                <h2 className="text-2xl font-bold text-white">نادي مكافآت العنابي</h2>
                <p className="text-stone-400 text-sm">سجل دخولك الآن بحساب Google لتفعيل محفظتك وتجميع النقاط مع كل طلبية.</p>
                <button onClick={handleGoogleLogin} className="bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-2xl hover:bg-amber-400 transition">
                  الدخول بحساب Google
                </button>
              </div>
            ) : (
              <div className="bg-stone-900/70 p-8 rounded-3xl border border-stone-800 space-y-6">
                <div className="flex justify-between items-center border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    {profile?.avatar_url && (
                      <img src={profile.avatar_url} alt="Profile" className="w-12 h-12 rounded-full border border-amber-500" />
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-white">{profile?.full_name}</h2>
                      <span className="text-xs text-stone-400">{profile?.email}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-xl font-bold">
                    عضوية {profile?.tier}ة
                  </span>
                </div>
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-stone-400">رصيدك من النقاط</span>
                    <div className="text-4xl font-black text-amber-400 mt-1">{profile?.points_balance || 0}</div>
                    <span className="text-xs text-stone-500 mt-1 block">تساوي خصم {((profile?.points_balance || 0) * 0.5)} ج.م</span>
                  </div>
                  <button onClick={() => setIsCartOpen(true)} className="bg-stone-800 text-stone-200 text-xs px-4 py-2.5 rounded-xl font-bold hover:bg-stone-700">
                    استخدمها عند الدفع
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* لوحة تحكم المشرف (Admin) */}
        {activeTab === 'admin' && profile?.role === 'admin' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
              <ShieldCheck className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-white">إحصائيات الإدارة المباشرة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-900/80 p-6 rounded-3xl border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" /> إجمالي عدد الزوار الفعليين للمتجر
                  </span>
                  <div className="text-4xl font-black text-white mt-2">{visitorCount}</div>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  <Eye className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <div className="bg-stone-900/80 p-6 rounded-3xl border border-stone-800">
                <span className="text-stone-400 text-sm">الحساب المشرف</span>
                <div className="text-lg font-bold text-white mt-2">{profile?.email}</div>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded mt-2 inline-block">صلاحية أدمن نشطة</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
