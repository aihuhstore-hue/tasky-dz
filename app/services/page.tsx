"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const services = [
  { id: 1, name: "سباك", icon: "🔧", desc: "إصلاح تسربات، تمديدات المياه", price: "من 1500 دج" },
  { id: 2, name: "كهربائي", icon: "⚡", desc: "إصلاح أعطال كهربائية، تركيب", price: "من 2000 دج" },
  { id: 3, name: "نجار", icon: "🪚", desc: "إصلاح أثاث، تركيب أبواب", price: "من 1500 دج" },
];

export default function Services() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  const handleRequest = () => {
    const service = services.find((s) => s.id === selected);
    if (service) {
      router.push(`/request?service=${encodeURIComponent(service.name)}&icon=${encodeURIComponent(service.icon)}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <a href="/" className="text-green-600 font-bold text-lg">← رجوع</a>
        <h1 className="text-xl font-bold text-gray-800">اختر الخدمة</h1>
        <div className="w-16"></div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        <p className="text-gray-500 text-center mb-6">اختر الخدمة التي تحتاجها</p>

        <div className="flex flex-col gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelected(service.id)}
              className={`bg-white rounded-2xl p-5 flex items-center gap-4 cursor-pointer border-2 transition-all shadow-sm ${
                selected === service.id ? "border-green-500" : "border-transparent"
              }`}
            >
              <div className="text-5xl">{service.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">{service.name}</h3>
                <p className="text-gray-500 text-sm">{service.desc}</p>
                <p className="text-green-600 font-bold text-sm mt-1">{service.price}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selected === service.id ? "bg-green-500 border-green-500" : "border-gray-300"
              }`}>
                {selected === service.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <button
            onClick={handleRequest}
            className="mt-8 w-full bg-green-600 text-white text-center py-4 rounded-xl font-bold text-lg"
          >
            اطلب الآن
          </button>
        )}
      </div>
    </main>
  );
}
