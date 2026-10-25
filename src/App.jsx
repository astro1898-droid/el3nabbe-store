import React, { useState } from 'react';
import { Award, Gift, Share2, Sparkles, ShoppingBag, User, Check, Flame } from 'lucide-react';

const PERFUMES = [
  {
    id: 1,
    name: "العنابي الملكي (Royal El3nabbe)",
    notes: "عود كمبودي، عنبر ملكي، هيل",
    price: 650,
    pointsReward: 65,
    tag: "الأكثر طلباً",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "سحر الشرق (Velvet Seduction)",
    notes: "فانيليا مدخنة، قهوة، خشب الصندل",
    price: 590,
    pointsReward: 59,
    tag: "شتوي فاخر",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "نسيم الصباح (Pure Freshness)",
    notes: "برغموت إيطالي، لافندر، مسك أبيض",
    price: 520,
    pointsReward: 52,
    tag: "يومي منعش",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('shop'); // shop or rewards
  const [userPoints, setUserPoints] = useState(150); // رصيد افتراضي للتجربة
  const [cartCount, setCartCount] = useState(0);
  const [notification, setNotification] = useState('');

  const triggerAlert = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const buyPerfume = (perfume) => {
    setCartCount(prev => prev + 1);
    setUserPoints(prev => prev + perfume.pointsReward);
    triggerAlert(`تم طلب ${perfume.name}! وكسبت ${perfume.pointsReward} نقطة جديدة.`);
  };

  const redeemPoints = () => {
    if (userPoints >= 100) {
      setUserPoints(prev => prev - 100);
      triggerAlert('مبروك! تم استبدال 100 نقطة بخصم 50 جنيه على مشترياتك القادمة.');
    } else {
      triggerAlert('عفواً، رصيدك أقل من 100 نقطة للاستبدال.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-stone-100 selection:bg-amber-500 selection:text-black">
      {/* إشعار عائم */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-stone-950 px-5 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* الشريط العلوي */}
      <nav className="border-b border-stone-800 bg-[#0d0d0f]/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
              العنابي <span className="text-amber-500 text-sm font-light">PERFUMES</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('shop')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === 'shop' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'}`}
            >
              العطور
            </button>
            <button 
              onClick={() => setActiveTab('rewards')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${activeTab === 'rewards' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'}`}
            >
              <Award className="w-4 h-4" />
              <span>نقاطي ({userPoints})</span>
            </button>
          </div>
        </div>
      </nav>

      {/* المحتوى */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'shop' ? (
          <div>
            {/* Banner ترحيبي ونظام النقط */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-gradient-to-r from-stone-900 to-[#191113] p-6 md:p-10 mb-10">
              <div className="max-w-xl">
                <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-3 py-1 rounded-full font-semibold mb-3">
                  عضويتك الذهبية تبدأ من أول رشة ✨
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                  تركيبات عطرية فاخرة بثبات يدوم وحضور يسبقك
                </h1>
                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                  كل عطر تطلبه بيضيف لرصيدك نقط فورية في محفظتك. استخدم نقطك في خصومات مباشرة وهدايا على طلباتك القادمة.
                </p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveTab('rewards')} className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl transition">
                    افتح حساب المكافآت
                  </button>
                </div>
              </div>
            </div>

            {/* قائمة العطور */}
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              المجموعة الملكية المختارة
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PERFUMES.map((item) => (
                <div key={item.id} className="bg-stone-900/60 rounded-2xl border border-stone-800/80 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    <span className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md text-amber-400 text-xs px-2.5 py-1 rounded-lg border border-stone-700">
                      {item.tag}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white mb-1">{item.name}</h3>
                      <p className="text-stone-400 text-xs mb-3">النوتات: {item.notes}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between border-t border-stone-800/80 pt-3 mb-4">
                        <div>
                          <span className="text-xl font-extrabold text-white">{item.price}</span>
                          <span className="text-xs text-stone-400 mr-1">جنيه</span>
                        </div>
                        <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          +{item.pointsReward} نقطة
                        </span>
                      </div>

                      <button 
                        onClick={() => buyPerfume(item)}
                        className="w-full bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        اطلب واكسب النقط
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* واجهة نادي المكافآت والنقاط */
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-stone-900/70 p-6 rounded-2xl border border-stone-800">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">محفظة العميل</h2>
                  <p className="text-stone-400 text-xs">أهلاً بك في نادي مكافآت العنابي</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-xl text-sm font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> عضوية ذهبية
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <span className="text-xs text-stone-400">رصيدك الحالي</span>
                  <div className="text-3xl font-black text-amber-400 mt-1">{userPoints} <span className="text-sm font-normal text-stone-400">نقطة</span></div>
                  <span className="text-xs text-stone-500">تساوي خصم {userPoints * 0.5} جنيه</span>
                </div>
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col justify-center">
                  <span className="text-xs text-stone-400 mb-1">التقدم للمستوى البلاتيني</span>
                  <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${Math.min(100, (userPoints / 300) * 100)}%` }}></div>
                  </div>
                  <span className="text-xs text-stone-500 mt-2">باقي {Math.max(0, 300 - userPoints)} نقطة للحصول على شحن مجاني دائم.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={redeemPoints}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                >
                  <Gift className="w-4 h-4" /> استبدال 100 نقطة بكوبون خصم 50 جنيه
                </button>
                <button 
                  onClick={() => triggerAlert('تم نسخ رابط الإحالة الخاص بك! شاركه مع صحابك واكسب 50 نقطة.')}
                  className="bg-stone-800 hover:bg-stone-700 text-white font-medium px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                >
                  <Share2 className="w-4 h-4" /> شارك كود الدعوة
                </button>
              </div>
            </div>

            {/* كيفية عمل النظام */}
            <div className="bg-stone-900/40 p-6 rounded-2xl border border-stone-800/60">
              <h3 className="font-bold text-sm text-stone-300 mb-4">إزاي بتجمع نقط وتستفيد؟</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-400">
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/40">
                  <div className="text-amber-400 font-bold mb-1">1. اطلب عطرك</div>
                  كل 10 جنيه بتدفعها في أي أوردر بتتحول لـ 1 نقطة فورية في حسابك.
                </div>
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/40">
                  <div className="text-amber-400 font-bold mb-1">2. قيّم تجربتك</div>
                  اكتب رأيك الصريح في العطر بعد استلامه واكسب 30 نقطة إضافية.
                </div>
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/40">
                  <div className="text-amber-400 font-bold mb-1">3. وفّر على طلباتك</div>
                  حوّل نقطك لكوبونات خصم أو اطلب بيها زجاجات عطور مجانية.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
