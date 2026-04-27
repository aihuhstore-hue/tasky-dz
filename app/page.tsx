"use client";
import { useState } from "react";

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
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const handleCategory = (cat: typeof categories[0]) => {
    if (!cat.available) return;
    setActiveCategory(activeCategory === cat.id ? null : cat.id);
  };

  const selected = categories.find((c) => c.id === activeCategory);

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-green-600">Tasky DZ</h1>
          <nav className="hidden md:flex gap-4">
            <a href="#services" className="text-gray-600 text-sm hover:text-green-600 font-medium">الخدمات</a>
            <a href="#how" className="text-gray-600 text-sm hover:text-green-600 font-medium">كيف يعمل؟</a>
            <a href="/register" className="text-gray-600 text-sm hover:text-green-600 font-medium">انضم كمقدم خدمة</a>
          </nav>
        </div>
        <div className="flex gap-2">
          <a href="/login" className="text-green-600 border border-green-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-50">دخول</a>
          <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700">تسجيل</a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-14 px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">كل خدماتك في مكان واحد</h2>
        <p className="text-gray-500 text-lg mb-8">اطلب أي خدمة منزلية في دقائق — بدون تعب</p>
        <a href="#services" className="bg-green-600 text-white px-10 py-4 rounded-xl text-lg font-bold inline-block hover:bg-green-700 transition-all">
          اكتشف الخدمات
        </a>
      </section>

      {/* Categories */}
      <section id="services" className="py-12 px-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">اختر صنف الخدمة</h3>
        <p className="text-center text-gray-400 text-sm mb-8">اضغط على الصنف لعرض الخدمات المتاحة</p>

        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat)}
              className={`relative rounded-2xl p-4 text-center transition-all border-2 ${
                !cat.available
                  ? "bg-gray-50 border-transparent opacity-60 cursor-not-allowed"
                  : activeCategory === cat.id
                  ? "bg-green-600 border-green-600 text-white shadow-lg"
                  : "bg-white border-gray-100 hover:border-green-400 shadow-sm"
              }`}
            >
              <div className="text-3xl mb-1">{cat.icon}</div>
              <p className={`text-xs font-bold ${activeCategory === cat.id ? "text-white" : "text-gray-700"}`}>
                {cat.name}
              </p>
              {!cat.available && (
                <span className="absolute top-1 left-1 bg-gray-200 text-gray-500 text-xs px-1 rounded-full">
                  قريباً
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Services List */}
        {selected && (
          <div className="max-w-lg mx-auto">
            <h4 className="font-bold text-gray-700 mb-4 text-center">خدمات {selected.name}</h4>
            <div className="flex flex-col gap-3">
              {selected.services.map((service) => (
                <a
                  key={service.name}
                  href={`/request?service=${encodeURIComponent(service.name)}&icon=${encodeURIComponent(service.icon)}`}
                  className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 hover:border-green-400 hover:shadow-md transition-all"
                >
                  <div className="text-4xl">{service.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-800">{service.name}</h5>
                    <p className="text-gray-500 text-sm">{service.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold text-sm">{service.price}</p>
                    <p className="text-gray-400 text-xs mt-1">اطلب الآن ←</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
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
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                {step.n}
              </div>
              <p className="text-gray-700">{step.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Provider */}
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
