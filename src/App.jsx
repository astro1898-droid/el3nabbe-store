import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  Award, Gift, Share2, Sparkles, ShoppingBag, 
  LogOut, LogIn, Users, Eye, ShieldCheck, Flame, Check, Star 
} from 'lucide-react';

const PERFUMES = [
  {
    id: 1,
    name: "العنابي الملكي (Royal El3nabbe)",
    notes: "عود كمبودي، عنبر ملكي، هيل فاخر",
    price: 650,
    pointsReward: 65,
    tag: "الأكثر طلباً",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "سحر الشرق (Velvet Seduction)",
    notes: "فانيليا مدخنة، حبوب القهوة، صندل",
    price: 590,
    pointsReward: 59,
    tag: "شتوي فاخر",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "نسيم الصباح (Pure Freshness)",
    notes: "برغموت إيطالي، لافندر ناعم، مسك أبيض",
    price: 520,
    pointsReward: 52,
    tag: "يومي منعش",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"
  }
];

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'rewards', 'admin'
  const [visitorCount, setVisitorCount] = useState(0);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(true);

  // إشعار علوي عائم
  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // 1. مزامنة المصادقة والزوار عند تشغيل التطبيق
  useEffect(() => {
    // جلب الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      setLoading(false);
    });

    // الاستماع لتغييرات تسجيل الدخول والخروج
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    // تسجيل وحساب الزيارة
    trackVisit();

    return () => subscription.unsubscribe();
  }, []);

  // تتبع الزائر الحقيقي
  const trackVisit = async () => {
    let visitorId = localStorage.getItem('el3nabbe_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('el3nabbe_visitor_id', visitorId);
      // تسجيل الزيارة الجديدة فقط
      await supabase.from('site_visits').insert([{ visitor_id: visitorId }]);
    }

    // جلب إجمالي عدد الزيارات الفريدة
    const { count } = await supabase
      .from('site_visits')
      .select('*', { count: 'exact', head: true });
    
    if (count !== null) setVisitorCount(count);
  };

  // جلب الملف الشخصي للعميل
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  // تسجيل الدخول بحساب Google / Gmail
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) showToast('حدث خطأ أثناء محاولة الدخول بـ Google: ' + error.message);
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast('تم تسجيل الخروج بنجاح');
  };

  // شراء عطر وإضافة نقاط حقيقية لقاعدة البيانات
  const handlePurchase = async (perfume) => {
    if (!session || !profile) {
      showToast('يرجى تسجيل الدخول بحساب Google أولاً لكسب النقاط!');
      return;
    }

    const newBalance = profile.points_balance + perfume.pointsReward;

    // تحديث الرصيد في Supabase
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ points_balance: newBalance })
      .eq('id', profile.id);

    // إضافة حركة في الـ Ledger
    await supabase.from('points_ledger').insert([{
      user_id: profile.id,
      amount: perfume.pointsReward,
      description: `شراء عطر: ${perfume.name}`
    }]);

    if (!profileError) {
      setProfile({ ...profile, points_balance: newBalance });
      showToast(`ألف مبروك! طلبت ${perfume.name} وأضيف ${perfume.pointsReward} نقطة لمحفظتك.`);
    }
  };

  // استبدال 100 نقطة بخصم
  const handleRedeem = async () => {
    if (!profile || profile.points_balance < 100) {
      showToast('رصيدك أقل من 100 نقطة للاستبدال.');
      return;
    }

    const newBalance = profile.points_balance - 100;
    const { error } = await supabase
      .from('profiles')
      .update({ points_balance: newBalance })
      .eq('id', profile.id);

    await supabase.from('points_ledger').insert([{
      user_id: profile.id,
      amount: -100,
      description: 'استبدال 100 نقطة بكوبون خصم بقيمة 50 جنيه'
    }]);

    if (!error) {
      setProfile({ ...profile, points_balance: newBalance });
      showToast('تم استبدال 100 نقطة بخصم 50 جنيه بنجاح!');
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
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              العنابي <span className="text-amber-500 text-xs font-semibold px-2 py-0.5 rounded border border-amber-500/30">PERFUMES</span>
            </span>
          </div>

          {/* أزرار التنقل */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('shop')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'shop' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'}`}
            >
              المتجر
            </button>
            <button 
              onClick={() => setActiveTab('rewards')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${activeTab === 'rewards' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'}`}
            >
              <Award className="w-4 h-4" />
              <span>نقاطي {profile ? `(${profile.points_balance})` : ''}</span>
            </button>

            {/* زر لوحة تحكم الأدمن إذا كان الحساب مسؤول */}
            {profile?.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${activeTab === 'admin' ? 'bg-red-600 text-white' : 'text-red-400 hover:bg-stone-900'}`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>لوحة الإدارة</span>
              </button>
            )}

            {/* الدخول بـ Google أو الخروج */}
            {session ? (
              <button 
                onClick={handleLogout}
                className="mr-2 p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-red-400 transition"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleGoogleLogin}
                className="mr-2 px-4 py-2 rounded-xl bg-white text-stone-900 font-bold hover:bg-stone-200 transition text-sm flex items-center gap-2 shadow"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>دخول بـ Google</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* صفحة المتجر */}
        {activeTab === 'shop' && (
          <div className="space-y-10">
            {/* البانر الترحيبي */}
            <div className="rounded-3xl border border-stone-800 bg-gradient-to-r from-stone-900 via-[#181113] to-stone-900 p-8 md:p-12 relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs px-3 py-1 rounded-full font-bold mb-4">
                  ✦ افتح حسابك واكسب 50 نقطة ترحيبية فوراً
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                  عطور فاخرة تترك انطباعك أينما حللت
                </h1>
                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                  كل عملية شراء تضيف لرصيدك نقاط حقيقية تستبدلها بخصومات مباشرة. سجّل دخولك بنقرة واحدة عبر حسابك على Google.
                </p>
                {!session && (
                  <button 
                    onClick={handleGoogleLogin}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold px-6 py-3 rounded-2xl transition flex items-center gap-2"
                  >
                    <span>سجّل دخولك الآن بـ Gmail</span>
                  </button>
                )}
              </div>
            </div>

            {/* كتالوج العطور */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <Flame className="w-5 h-5 text-amber-500" />
                  مجموعة النخبة
                </h2>
              </div>

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
                          onClick={() => handlePurchase(perfume)}
                          className="w-full bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-white font-bold py-3 rounded-2xl transition flex items-center justify-center gap-2 text-sm"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          اطلب واكسب النقاط
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* صفحة نقاط ومحفظة العميل */}
        {activeTab === 'rewards' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {!session ? (
              <div className="bg-stone-900/70 p-8 rounded-3xl border border-stone-800 text-center space-y-4">
                <Award className="w-12 h-12 text-amber-400 mx-auto" />
                <h2 className="text-2xl font-bold text-white">نادي مكافآت العنابي</h2>
                <p className="text-stone-400 text-sm">سجل دخولك الآن بحساب Google لتفعيل محفظتك وتجميع النقاط مع كل طلبية.</p>
                <button 
                  onClick={handleGoogleLogin}
                  className="bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-2xl hover:bg-amber-400 transition"
                >
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
                      <h2 className="text-xl font-bold text-white">{profile?.full_name || 'عميل مميز'}</h2>
                      <span className="text-xs text-stone-400">{profile?.email}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-xl font-bold">
                    عضوية {profile?.tier}ة
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800">
                    <span className="text-xs text-stone-400">رصيد النقاط الفعلي</span>
                    <div className="text-3xl font-black text-amber-400 mt-1">{profile?.points_balance || 0}</div>
                    <span className="text-xs text-stone-500 mt-1 block">تساوي خصم {((profile?.points_balance || 0) * 0.5)} جنيه</span>
                  </div>

                  <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 flex flex-col justify-center">
                    <span className="text-xs text-stone-400 mb-2">الترقية للمستوى الذهبي</span>
                    <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${Math.min(100, ((profile?.points_balance || 0) / 300) * 100)}%` }} />
                    </div>
                    <span className="text-xs text-stone-500 mt-2">اجمع المزيد لفتح الشحن المجاني الدائم.</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleRedeem}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 rounded-2xl transition text-sm flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    استبدال 100 نقطة بكوبون خصم 50 جنيه
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin);
                      showToast('تم نسخ رابط المتجر لمشاركته مع أصدقائك!');
                    }}
                    className="bg-stone-800 hover:bg-stone-700 text-white font-bold px-5 py-3.5 rounded-2xl transition text-sm flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    دعوة صديق
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* لوحة تحكم الأدمن (عداد الزوار الحقيقيين) */}
        {activeTab === 'admin' && profile?.role === 'admin' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
              <ShieldCheck className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-white">لوحة تحكم إدارة المتجر</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* إحصائية الزيارات الحقيقية */}
              <div className="bg-stone-900/80 p-6 rounded-3xl border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" /> إجمالي عدد الزوار الفعليين للمتجر
                  </span>
                  <div className="text-4xl font-black text-white mt-2">{visitorCount}</div>
                  <span className="text-xs text-stone-500 mt-1 block">يتم التحديث تلقائياً مع كل زائر حقيقي جديد</span>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  <Eye className="w-8 h-8 text-amber-500" />
                </div>
              </div>

              {/* إحصائية الصلاحيات */}
              <div className="bg-stone-900/80 p-6 rounded-3xl border border-stone-800">
                <span className="text-stone-400 text-sm">حساب المشرف الحالي</span>
                <div className="text-lg font-bold text-white mt-2">{profile?.email}</div>
                <div className="text-xs text-green-400 bg-green-500/10 inline-block px-2.5 py-1 rounded-lg border border-green-500/20 mt-3 font-semibold">
                  صلاحيات إدارة كاملة (Active Superadmin)
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
