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
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-green-600">Tasky DZ</h1>

        {/* Nav */}
        <nav className="flex items-center gap-6" ref={dropdownRef}>
          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowDropdown(!showDropdown); setActiveCategory(null); }}
              className="flex items-center gap-1 text-gray-700 font-bold text-sm hover:text-green-600 transition-all"
            >
              الخدمات
              <span className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-10 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 w-64 overflow-hidden z-50">
                {/* Categories */}
                {!activeCategory ? (
                  <div className="p-2">
                    <p className="text-xs text-gray-400 font-bold px-3 py-2">اختر صنف الخدمة</p>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => cat.available && setActiveCategory(cat)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-right transition-all ${
                          cat.available
                            ? "hover:bg-green-50 cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="flex-1 font-bold text-gray-700 text-sm">{cat.name}</span>
                        {!cat.available && (
                          <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">قريباً</span>
                        )}
                        {cat.available && <span className="text-gray-400 text-xs">←</span>}
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Sub Services */
                  <div className="p-2">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="flex items-center gap-2 px-3 py-2 text-green-600 font-bold text-sm mb-1"
                    >
                      → رجوع
                    </button>
                    <p className="text-xs text-gray-400 font-bold px-3 py-1">{activeCategory.name}</p>
                    {activeCategory.services.map((service) => (
                      <a
                        key={service.name}
                        href={`/request?service=${encodeURIComponent(service.name)}&icon=${encodeURIComponent(service.icon)}`}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-green-50 transition-all"
                      >
                        <span className="text-2xl">{service.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-gray-700 text-sm">{service.name}</p>
                          <p className="text-green-600 text-xs">{service.price}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <a href="#how" className="text-gray-600 text-sm hover:text-green-600 font-medium">كيف يعمل؟</a>
          <a href="/register" className="text-gray-600 text-sm hover:text-green-600 font-medium">انضم كمقدم خدمة</a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex gap-2">
          <a href="/login" className="text-green-600 border border-green-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-50">دخول</a>
          <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700">تسجيل</a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">كل خدماتك في مكان واحد</h2>
        <p className="text-gray-500 text-lg mb-8">اطلب أي خدمة منزلية في دقائق — بدون تعب</p>
        <a href="#services" className="bg-green-600 text-white px-10 py-4 rounded-xl text-lg font-bold inline-block hover:bg-green-700 transition-all">
          اكتشف الخدمات
        </a>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-12 px-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">الخدمات المتاحة</h3>
        <p className="text-center text-gray-400 text-sm mb-8">اضغط على الصنف لعرض الخدمات</p>
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`relative rounded-2xl p-4 text-center border-2 transition-all ${
                cat.available
                  ? "bg-white border-gray-100 hover:border-green-400 shadow-sm cursor-pointer"
                  : "bg-gray-50 border-transparent opacity-60 cursor-not-allowed"
              }`}
              onClick={() => {
                if (cat.available) {
                  setActiveCategory(cat);
                  setShowDropdown(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <div className="text-3xl mb-1">{cat.icon}</div>
              <p className="text-xs font-bold text-gray-700">{cat.name}</p>
              {!cat.available && (
                <span className="absolute top-1 left-1 bg-gray-200 text-gray-500 text-xs px-1 rounded-full">قريباً</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-gray-50 py-12 px-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">كيف يعمل؟</h3>
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {[
            { n: "1", t: "اختر الخدمة التي تحتاجها" },
            { n: "2", t: "حدد موقعك واشرح المشكلة" },
            { n: "3", t: "انتظر قبول مقدم الخدمة" },
            { n: "4", t: "قيّم الخدمة بعد الانتهاء" },
          ].map((step) => (
            <div key={step.n} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">{step.n}</div>
              <p className="text-gray-700">{step.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 text-center bg-green-600">
        <h3 className="text-2xl font-bold text-white mb-3">أنت مقدم خدمة؟</h3>
        <p className="text-green-100 mb-6">انضم إلينا وابدأ استقبال الطلبات اليوم</p>
        <a href="/register" className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold inline-block hover:bg-green-50">
          سجل كمقدم خدمة
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p className="font-bold text-lg">Tasky DZ 🇩🇿</p>
        <p className="text-gray-400 text-sm mt-1">كل خدماتك في مكان واحد</p>
      </footer>
    </main>
  );
}
