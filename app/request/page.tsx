"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

function Request() {
  const searchParams = useSearchParams();
  const serviceType = searchParams.get("service") || "سباك";
  const serviceIcon = searchParams.get("icon") || "🔧";

  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(true);
  const [clientCommune, setClientCommune] = useState("");
  const [authError, setAuthError] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [form, setForm] = useState({ description: "", address: "", phone: "" });

  const validatePhone = (phone: string) => /^(05|06|07)[0-9]{8}$/.test(phone);

  useEffect(() => {
    const checkAvailability = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChecking(false); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("commune, phone")
        .eq("id", user.id)
        .single();

      if (profile?.commune) {
        setClientCommune(profile.commune);
        setForm((f) => ({ ...f, phone: profile.phone || "" }));

        const { data: providers } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "provider")
          .eq("service_type", serviceType)
          .eq("commune", profile.commune);

        setAvailable((providers?.length || 0) > 0);
      }
      setChecking(false);
    };
    checkAvailability();
  }, [serviceType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setAuthError(false);
    setPhoneError("");

    if (!validatePhone(form.phone)) {
      setPhoneError("رقم الهاتف غير صحيح — يجب أن يبدأ بـ 05 أو 06 أو 07 ويحتوي على 10 أرقام");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAuthError(true);
      return;
    }
    setLoading(true);

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

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-green-600 font-bold">جاري التحقق من التوفر...</p>
      </main>
    );
  }

  if (!available) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">الخدمة غير متوفرة</h2>
          <p className="text-gray-500 mb-2">
            عذراً، خدمة <span className="font-bold text-green-600">{serviceIcon} {serviceType}</span> غير متوفرة حالياً في
          </p>
          <p className="text-gray-700 font-bold text-lg mb-6">📍 {clientCommune}</p>
          <div className="bg-yellow-50 rounded-xl p-4 mb-6">
            <p className="text-yellow-700 text-sm font-bold">نعمل على التوسع قريباً في منطقتك!</p>
          </div>
          <a href="/" className="block bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all">
            العودة للرئيسية
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <a href="/" className="text-green-600 font-bold text-lg">← رجوع</a>
        <a href="/" className="text-xl font-bold text-green-600">Tasky DZ</a>
        <div className="w-16"></div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h3 className="font-bold text-gray-700 mb-3">الخدمة المختارة</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{serviceIcon}</span>
            <div>
              <p className="font-bold text-gray-800">{serviceType}</p>
              <p className="text-gray-400 text-sm">السعر يحدده مقدم الخدمة حسب وصف المشكلة</p>
            </div>
          </div>
          {clientCommune && (
            <p className="text-gray-400 text-sm mt-2">📍 {clientCommune} — الخدمة متوفرة ✅</p>
          )}
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
              placeholder="عنوانك (الحي، الشارع)"
              value={form.address}
              onChange={handleChange}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
            />
            <input
              type="tel"
              name="phone"
              dir="rtl"
              placeholder="رقم هاتفك (05XXXXXXXX)"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
            />
            {phoneError && <p className="text-red-500 text-xs px-1">{phoneError}</p>}
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

        {authError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4 text-center">
            <p className="text-2xl mb-2">🔒</p>
            <p className="text-red-700 font-bold text-base mb-1">يرجى إنشاء حساب أولاً</p>
            <p className="text-gray-500 text-sm mb-4">يجب تسجيل الدخول لتتمكن من طلب الخدمة</p>
            <div className="flex gap-3">
              <a href="/register" className="flex-1 text-center bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm">إنشاء حساب</a>
              <a href="/login" className="flex-1 text-center border border-green-600 text-green-600 py-2.5 rounded-xl font-bold text-sm">تسجيل الدخول</a>
            </div>
          </div>
        )}

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

export default function RequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-green-600 font-bold">جاري التحميل...</p></div>}>
      <Request />
    </Suspense>
  );
}
