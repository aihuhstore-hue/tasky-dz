"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

export default function Request() {
  const searchParams = useSearchParams();
  const serviceType = searchParams.get("service") || "سباك";
  const serviceIcon = searchParams.get("icon") || "🔧";

  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ description: "", address: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.from("requests").insert({
      client_id: user?.id || null,
      service_type: serviceType,
      description: form.description,
      address: form.address,
      phone: form.phone,
      status: "pending",
    }).select().single();

    if (!error && data) {
      setRequestId(data.id);
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تم إرسال طلبك!</h2>
          <p className="text-gray-500 mb-6">سيتواصل معك مقدم الخدمة قريباً</p>
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-green-700 font-bold">رقم الطلب: #{requestId}</p>
            <p className="text-gray-500 text-sm mt-1">وقت الانتظار المتوقع: 15–30 دقيقة</p>
          </div>
          <a href="/dashboard" className="block bg-green-600 text-white py-3 rounded-xl font-bold">
            متابعة طلباتي
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <a href="/services" className="text-green-600 font-bold text-lg">← رجوع</a>
        <h1 className="text-xl font-bold text-gray-800">تفاصيل الطلب</h1>
        <div className="w-16"></div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h3 className="font-bold text-gray-700 mb-3">الخدمة المختارة</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{serviceIcon}</span>
            <div>
              <p className="font-bold text-gray-800">{serviceType}</p>
              <p className="text-green-600 text-sm font-bold">من 1500 دج</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h3 className="font-bold text-gray-700 mb-4">تفاصيل إضافية</h3>
          <div className="flex flex-col gap-4">
            <textarea
              name="description"
              placeholder="اشرح المشكلة بإيجاز..."
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 resize-none"
            />
            <input
              type="text"
              name="address"
              placeholder="عنوانك (الحي، المدينة)"
              value={form.address}
              onChange={handleChange}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
            />
            <input
              type="tel"
              name="phone"
              placeholder="رقم هاتفك"
              value={form.phone}
              onChange={handleChange}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h3 className="font-bold text-gray-700 mb-3">طريقة الدفع</h3>
          <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-gray-700 font-bold text-sm">دفع عند الاستلام</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !form.address || !form.phone}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50"
        >
          {loading ? "جاري الإرسال..." : "تأكيد الطلب"}
        </button>
      </div>
    </main>
  );
}
