"use client";
import { useState, useRef, useEffect } from "react";

const categories = [
  {
    id: 1,
    name: "صيانة المنزل",
    icon: "🏠",
    available: true,
    services: [
      { name: "سباك", icon: "🔧", price: "من 1500 دج", desc: "إصلاح تسربات وتمديدات المياه" },
      { name: "كهربائي", icon: "⚡", price: "من 2000 دج", desc: "إصلاح أعطال كهربائية وتركيب" },
      { name: "نجار", icon: "🪚", price: "من 1500 دج", desc: "إصلاح أثاث وتركيب أبواب" },
      { name: "دهان", icon: "🎨", price: "من 3000 دج", desc: "دهان جدران وديكور" },
      { name: "تكييف", icon: "❄️", price: "من 2500 دج", desc: "تركيب وصيانة المكيفات" },
      { name: "غاز", icon: "🔥", price: "من 1500 دج", desc: "تمديدات وإصلاح الغاز" },
    ],
  },
  { id: 2, name: "توصيل", icon: "🚚", available: false, services: [] },
  { id: 3, name: "دروس خصوصية", icon: "📚", available: false, services: [] },
  { id: 4, name: "صحة", icon: "🏥", available: false, services: [] },
  { id: 5, name: "أكل منزلي", icon: "🍲", available: false, services: [] },
  { id: 6, name: "تنظيف", icon: "🧹", available: false, services: [] },
];

const stats = [
  { value: "500+", label: "مستخدم" },
  { value: "50+", label: "مقدم خدمة" },
  { value: "1000+", label: "طلب منجز" },
  { value: "4.8★", label: "تقييم متوسط" },
];

export default function Home() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<typeof categories[0] | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-green-600">Tasky DZ</h1>

        <nav className="flex items-center gap-6" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => { setShowDropdown(!showDropdown); setActiveCategory(null); }}
              className="flex items-center gap-1 text-gray-700 font-bold text-sm hover:text-green-600 transition-all"
            >
              الخدمات
              <span className={`transition-transform duration-300 inline-block ${showDropdown ? "rotate-180" : ""}`}>▼</span>
            </button>

            {showDropdown && (
              <div className="absolute top-10 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 w-68 overflow-hidden z-50 animate-slide-down" style={{width: "260px"}}>
                {!activeCategory ? (
                  <div className="p-2">
                    <p className="text-xs text-gray-400 font-bold px-3 py-2 border-b border-gray-50 mb-1">اختر صنف الخدمة</p>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => cat.available && setActiveCategory(cat)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-right transition-all ${
                          cat.available ? "hover:bg-green-50 cursor-pointer" : "opacity-40 cursor-not-allowed"
                        }`}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="flex-1 font-bold text-gray-700 text-sm">{cat.name}</span>
                        {!cat.available
                          ? <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">قريباً</span>
                          : <span className="text-gray-300 text-sm">←</span>
                        }
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-2 animate-fade-in">
                    <button onClick={() => setActiveCategory(null)} className="flex items-center gap-2 px-3 py-2 text-green-600 font-bold text-sm mb-1 hover:bg-green-50 rounded-xl w-full">
                      ← رجوع للأصناف
                    </button>
                    <p className="text-xs text-gray-400 font-bold px-3 py-1 border-b border-gray-50 mb-1">{activeCategory.icon} {activeCategory.name}</p>
                    {activeCategory.services.map((service) => (
                      <a
                        key={service.name}
                        href={`/request?service=${encodeURIComponent(service.name)}&icon=${encodeURIComponent(service.icon)}`}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-green-50 transition-all group"
                      >
                        <span className="text-2xl">{service.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-gray-700 text-sm group-hover:text-green-700">{service.name}</p>
                          <p className="text-green-600 text-xs">{service.price}</p>
                        </div>
                        <span className="text-gray-300 text-sm group-hover:text-green-500">←</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <a href="#how" className="text-gray-600 text-sm hover:text-green-600 font-medium transition-colors">كيف يعمل؟</a>
          <a href="/register" className="text-gray-600 text-sm hover:text-green-600 font-medium transition-colors">انضم كمقدم خدمة</a>
        </nav>

        <div className="flex gap-2">
          <a href="/login" className="text-green-600 border border-green-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-50 transition-all">دخول</a>
          <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-all animate-pulse-green">تسجيل</a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 py-20 px-6 text-center overflow-hidden">
        <div className="animate-fade-in-up">
          <span className="bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full inline-block mb-6">🇩🇿 منصة جزائرية 100%</span>
          <h2 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">كل خدماتك<br/><span className="text-green-600">في مكان واحد</span></h2>
          <p className="text-gray-500 text-xl mb-10">اطلب أي خدمة منزلية في دقائق — بدون تعب</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#services" className="bg-green-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 hover:shadow-xl">
              اطلب الآن
            </a>
            <a href="#how" className="bg-white text-green-600 border-2 border-green-200 px-8 py-4 rounded-xl text-lg font-bold hover:border-green-400 transition-all">
              كيف يعمل؟
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6 bg-white border-y border-gray-100">
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {stats.map((s, i) => (
            <div key={i} className={`text-center animate-fade-in-up delay-${i + 1}`}>
              <p className="text-3xl font-bold text-green-600">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-14 px-6">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-2">الخدمات المتاحة</h3>
        <p className="text-center text-gray-400 mb-10">اضغط على الصنف لعرض الخدمات</p>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              onClick={() => { if (cat.available) { setActiveCategory(cat); setShowDropdown(true); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
              className={`animate-fade-in-up delay-${i + 1} relative rounded-2xl p-5 text-center border-2 transition-all ${
                cat.available
                  ? "bg-white border-gray-100 hover:border-green-400 shadow-sm hover:shadow-lg cursor-pointer hover:-translate-y-1"
                  : "bg-gray-50 border-transparent opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="text-sm font-bold text-gray-700">{cat.name}</p>
              {!cat.available && (
                <span className="absolute top-2 left-2 bg-gray-200 text-gray-500 text-xs px-1.5 py-0.5 rounded-full">قريباً</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-gradient-to-b from-gray-50 to-white py-14 px-6">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">كيف يعمل؟</h3>
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {[
            { n: "1", t: "اختر الخدمة التي تحتاجها", icon: "🔍" },
            { n: "2", t: "حدد موقعك واشرح المشكلة", icon: "📍" },
            { n: "3", t: "انتظر قبول مقدم الخدمة", icon: "⏳" },
            { n: "4", t: "قيّم الخدمة بعد الانتهاء", icon: "⭐" },
          ].map((step, i) => (
            <div key={step.n} className={`animate-fade-in-up delay-${i + 1} flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:border-green-200 transition-all`}>
              <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 text-lg">{step.n}</div>
              <p className="text-gray-700 font-medium flex-1">{step.t}</p>
              <span className="text-2xl">{step.icon}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Provider */}
      <section className="py-14 px-6 text-center bg-gradient-to-r from-green-600 to-green-700">
        <h3 className="text-3xl font-bold text-white mb-3">أنت مقدم خدمة؟</h3>
        <p className="text-green-100 text-lg mb-8">انضم إلينا وابدأ استقبال الطلبات اليوم — مجاناً</p>
        <a href="/register" className="bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg inline-block hover:bg-green-50 transition-all shadow-lg">
          سجل كمقدم خدمة ←
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-lg mx-auto text-center" dir="rtl">
          <p className="text-2xl font-bold text-green-400 mb-2">Tasky DZ 🇩🇿</p>
          <p className="text-gray-400 mb-6">كل خدماتك في مكان واحد</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <a href="/login" className="hover:text-green-400 transition-colors">دخول</a>
            <a href="/register" className="hover:text-green-400 transition-colors">تسجيل</a>
            <a href="#how" className="hover:text-green-400 transition-colors">كيف يعمل؟</a>
          </div>
          <p className="text-gray-600 text-xs mt-6">© 2026 Tasky DZ — جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </main>
  );
}
