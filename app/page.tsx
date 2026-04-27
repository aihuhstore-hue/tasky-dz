"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const categoriesData = {
  ar: [
    { id: 1, name: "صيانة المنزل", icon: "🏠", available: true, services: [
      { name: "سباك", icon: "🔧", price: "من 1500 دج", desc: "إصلاح تسربات وتمديدات المياه" },
      { name: "كهربائي", icon: "⚡", price: "من 2000 دج", desc: "إصلاح أعطال كهربائية وتركيب" },
      { name: "نجار", icon: "🪚", price: "من 1500 دج", desc: "إصلاح أثاث وتركيب أبواب" },
      { name: "دهان", icon: "🎨", price: "من 3000 دج", desc: "دهان جدران وديكور" },
      { name: "تكييف", icon: "❄️", price: "من 2500 دج", desc: "تركيب وصيانة المكيفات" },
      { name: "غاز", icon: "🔥", price: "من 1500 دج", desc: "تمديدات وإصلاح الغاز" },
    ]},
    { id: 2, name: "توصيل", icon: "🚚", available: false, services: [] },
    { id: 3, name: "دروس خصوصية", icon: "📚", available: false, services: [] },
    { id: 4, name: "صحة", icon: "🏥", available: false, services: [] },
    { id: 5, name: "أكل منزلي", icon: "🍲", available: false, services: [] },
    { id: 6, name: "تنظيف", icon: "🧹", available: false, services: [] },
  ],
  fr: [
    { id: 1, name: "Maison & Réparation", icon: "🏠", available: true, services: [
      { name: "Plombier", icon: "🔧", price: "À partir de 1500 DA", desc: "Réparation fuites et canalisations" },
      { name: "Électricien", icon: "⚡", price: "À partir de 2000 DA", desc: "Pannes électriques et installation" },
      { name: "Menuisier", icon: "🪚", price: "À partir de 1500 DA", desc: "Réparation meubles et portes" },
      { name: "Peintre", icon: "🎨", price: "À partir de 3000 DA", desc: "Peinture murale et décoration" },
      { name: "Climatisation", icon: "❄️", price: "À partir de 2500 DA", desc: "Installation et entretien clim" },
      { name: "Gaz", icon: "🔥", price: "À partir de 1500 DA", desc: "Installation et réparation gaz" },
    ]},
    { id: 2, name: "Livraison", icon: "🚚", available: false, services: [] },
    { id: 3, name: "Cours particuliers", icon: "📚", available: false, services: [] },
    { id: 4, name: "Santé", icon: "🏥", available: false, services: [] },
    { id: 5, name: "Cuisine maison", icon: "🍲", available: false, services: [] },
    { id: 6, name: "Nettoyage", icon: "🧹", available: false, services: [] },
  ],
};

const stats = [
  { value: "500+", key: "users" },
  { value: "50+", key: "providers" },
  { value: "1000+", key: "orders" },
  { value: "4.8★", key: "rating" },
];

const steps = ["step1", "step2", "step3", "step4"];
const stepIcons = ["🔍", "📍", "⏳", "⭐"];

export default function Home() {
  const { lang, t, setLang } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categories = categoriesData[lang];

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

  useEffect(() => {
    setActiveCategory(null);
    setShowDropdown(false);
  }, [lang]);

  return (
    <main className="min-h-screen bg-white" dir={t.dir}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="py-3 px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-600">Tasky DZ</h1>

          {/* Mobile: language + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setLang("ar")} className={`px-2.5 py-1 rounded-md text-sm font-bold transition-all ${lang === "ar" ? "bg-green-600 text-white" : "text-gray-500"}`}>ع</button>
              <button onClick={() => setLang("fr")} className={`px-2.5 py-1 rounded-md text-sm font-bold transition-all ${lang === "fr" ? "bg-green-600 text-white" : "text-gray-500"}`}>Fr</button>
            </div>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="p-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg w-10 h-10 flex items-center justify-center">
              {mobileMenu ? "✕" : "☰"}
            </button>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" ref={dropdownRef}>
            <div className="relative">
              <button onClick={() => { setShowDropdown(!showDropdown); setActiveCategory(null); }}
                className="flex items-center gap-1 text-gray-700 font-bold text-sm hover:text-green-600 transition-all">
                {t.services}
                <span className={`transition-transform duration-300 inline-block ${showDropdown ? "rotate-180" : ""}`}>▼</span>
              </button>
              {showDropdown && (
                <div className={`absolute top-10 ${t.dir === "rtl" ? "right-0" : "left-0"} bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-down`} style={{ width: "260px" }}>
                  {!activeCategory ? (
                    <div className="p-2">
                      <p className="text-xs text-gray-400 font-bold px-3 py-2 border-b border-gray-50 mb-1">{t.choose_category}</p>
                      {categories.map((cat) => (
                        <button key={cat.id} onClick={() => cat.available && setActiveCategory(cat)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${cat.available ? "hover:bg-green-50 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}>
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="flex-1 font-bold text-gray-700 text-sm text-right">{cat.name}</span>
                          {!cat.available
                            ? <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{t.coming_soon}</span>
                            : <span className="text-gray-300 text-sm">{t.dir === "rtl" ? "←" : "→"}</span>}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 animate-fade-in">
                      <button onClick={() => setActiveCategory(null)} className="flex items-center gap-2 px-3 py-2 text-green-600 font-bold text-sm mb-1 hover:bg-green-50 rounded-xl w-full">
                        {t.back_categories}
                      </button>
                      <p className="text-xs text-gray-400 font-bold px-3 py-1 border-b border-gray-50 mb-1">{activeCategory.icon} {activeCategory.name}</p>
                      {activeCategory.services.map((service: any) => (
                        <a key={service.name} href={`/request?service=${encodeURIComponent(service.name)}&icon=${encodeURIComponent(service.icon)}`}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-green-50 transition-all group">
                          <span className="text-2xl">{service.icon}</span>
                          <div className="flex-1">
                            <p className="font-bold text-gray-700 text-sm group-hover:text-green-700">{service.name}</p>
                            <p className="text-green-600 text-xs">{service.price}</p>
                          </div>
                          <span className="text-gray-300 text-sm group-hover:text-green-500">{t.dir === "rtl" ? "←" : "→"}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <a href="#how" className="text-gray-600 text-sm hover:text-green-600 font-medium">{t.how_it_works}</a>
            <a href="/register" className="text-gray-600 text-sm hover:text-green-600 font-medium">{t.join_provider}</a>
          </nav>

          {/* Desktop auth + lang */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setLang("ar")} className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${lang === "ar" ? "bg-green-600 text-white" : "text-gray-500"}`}>ع</button>
              <button onClick={() => setLang("fr")} className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${lang === "fr" ? "bg-green-600 text-white" : "text-gray-500"}`}>Fr</button>
            </div>
            <a href="/login" className="text-green-600 border border-green-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-50 transition-all">{t.login}</a>
            <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-all">{t.register}</a>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3 animate-slide-down">
            <button onClick={() => { setMobileServices(!mobileServices); setMobileActiveCategory(null); }}
              className="flex items-center justify-between text-gray-700 font-bold text-base py-2 border-b border-gray-100 w-full">
              <span>{t.services}</span>
              <span className={`transition-transform duration-300 inline-block text-sm ${mobileServices ? "rotate-180" : ""}`}>▼</span>
            </button>

            {mobileServices && (
              <div className="bg-gray-50 rounded-xl p-2 flex flex-col gap-1 animate-slide-down">
                {!mobileActiveCategory ? (
                  <>
                    <p className="text-xs text-gray-400 font-bold px-3 py-1">{t.choose_category}</p>
                    {categories.map((cat) => (
                      <button key={cat.id} onClick={() => cat.available && setMobileActiveCategory(cat)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl w-full transition-all ${cat.available ? "hover:bg-green-50 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}>
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="flex-1 font-bold text-gray-700 text-sm text-start">{cat.name}</span>
                        {!cat.available
                          ? <span className="text-xs bg-gray-200 text-gray-400 px-2 py-0.5 rounded-full">{t.coming_soon}</span>
                          : <span className="text-gray-400 text-sm">{t.dir === "rtl" ? "←" : "→"}</span>}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    <button onClick={() => setMobileActiveCategory(null)} className="flex items-center gap-2 px-3 py-2 text-green-600 font-bold text-sm rounded-xl hover:bg-green-50 w-full">
                      {t.back_categories}
                    </button>
                    <p className="text-xs text-gray-400 font-bold px-3 py-1">{mobileActiveCategory.icon} {mobileActiveCategory.name}</p>
                    {mobileActiveCategory.services.map((service: any) => (
                      <a key={service.name} href={`/request?service=${encodeURIComponent(service.name)}&icon=${encodeURIComponent(service.icon)}`}
                        onClick={() => setMobileMenu(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-green-50 transition-all">
                        <span className="text-2xl">{service.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-gray-700 text-sm">{service.name}</p>
                          <p className="text-green-600 text-xs">{service.price}</p>
                        </div>
                        <span className="text-gray-400 text-sm">{t.dir === "rtl" ? "←" : "→"}</span>
                      </a>
                    ))}
                  </>
                )}
              </div>
            )}

            <a href="#how" onClick={() => setMobileMenu(false)} className="text-gray-700 font-bold text-base py-2 border-b border-gray-100 block">{t.how_it_works}</a>
            <a href="/register" onClick={() => setMobileMenu(false)} className="text-gray-700 font-bold text-base py-2 border-b border-gray-100 block">{t.join_provider}</a>
            <div className="flex gap-3 pt-2">
              <a href="/login" className="flex-1 text-center text-green-600 border border-green-600 py-2.5 rounded-xl font-bold">{t.login}</a>
              <a href="/register" className="flex-1 text-center bg-green-600 text-white py-2.5 rounded-xl font-bold">{t.register}</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 py-20 px-6 text-center overflow-hidden">
        <div className="animate-fade-in-up">
          <span className="bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full inline-block mb-6">{t.badge}</span>
          <h2 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
            {t.hero_title_1}<br /><span className="text-green-600">{t.hero_title_2}</span>
          </h2>
          <p className="text-gray-500 text-xl mb-10">{t.hero_sub}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#services" className="bg-green-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl">{t.discover}</a>
            <a href="#how" className="bg-white text-green-600 border-2 border-green-200 px-8 py-4 rounded-xl text-lg font-bold hover:border-green-400 transition-all">{t.how_btn}</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6 bg-white border-y border-gray-100">
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {stats.map((s, i) => (
            <div key={i} className={`text-center animate-fade-in-up delay-${i + 1}`}>
              <p className="text-3xl font-bold text-green-600">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{(t as any)[s.key]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-14 px-6">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-2">{t.services_title}</h3>
        <p className="text-center text-gray-400 mb-10">{t.services_sub}</p>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {categories.map((cat, i) => (
            <div key={cat.id} onClick={() => { if (cat.available) { setActiveCategory(cat); setShowDropdown(true); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
              className={`animate-fade-in-up delay-${i + 1} relative rounded-2xl p-5 text-center border-2 transition-all ${cat.available ? "bg-white border-gray-100 hover:border-green-400 shadow-sm hover:shadow-lg cursor-pointer hover:-translate-y-1" : "bg-gray-50 border-transparent opacity-50 cursor-not-allowed"}`}>
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="text-sm font-bold text-gray-700">{cat.name}</p>
              {!cat.available && <span className="absolute top-2 left-2 bg-gray-200 text-gray-500 text-xs px-1.5 py-0.5 rounded-full">{t.coming_soon}</span>}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-gradient-to-b from-gray-50 to-white py-14 px-6">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">{t.how_title}</h3>
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {steps.map((step, i) => (
            <div key={step} className={`animate-fade-in-up delay-${i + 1} flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:border-green-200 transition-all`}>
              <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 text-lg">{i + 1}</div>
              <p className="text-gray-700 font-medium flex-1">{(t as any)[step]}</p>
              <span className="text-2xl">{stepIcons[i]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 text-center bg-gradient-to-r from-green-600 to-green-700">
        <h3 className="text-3xl font-bold text-white mb-3">{t.cta_title}</h3>
        <p className="text-green-100 text-lg mb-8">{t.cta_sub}</p>
        <a href="/register" className="bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg inline-block hover:bg-green-50 transition-all shadow-lg">{t.cta_btn}</a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-2xl font-bold text-green-400 mb-2">Tasky DZ 🇩🇿</p>
          <p className="text-gray-400 mb-6">{t.footer_sub}</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <a href="/login" className="hover:text-green-400 transition-colors">{t.login}</a>
            <a href="/register" className="hover:text-green-400 transition-colors">{t.register}</a>
            <a href="#how" className="hover:text-green-400 transition-colors">{t.how_it_works}</a>
          </div>
          <p className="text-gray-600 text-xs mt-6">{t.rights}</p>
        </div>
      </footer>
    </main>
  );
}
