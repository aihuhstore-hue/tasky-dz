"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

type Step = "form" | "review" | "done";

function StepBar({ current }: { current: Step }) {
  const steps = [
    { key: "service", label: "اختيار الخدمة" },
    { key: "form",    label: "تفاصيل الطلب" },
    { key: "review",  label: "مراجعة وتأكيد" },
  ];
  const order: Record<Step | "service", number> = { service: 0, form: 1, review: 2, done: 3 };
  const currentIdx = order[current];

  return (
    <div className="flex items-center justify-center gap-0 mb-8 px-2">
      {steps.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                done ? "bg-green-600 text-white" : active ? "bg-green-600 text-white ring-4 ring-green-100" : "bg-gray-200 text-gray-400"
              }`}>
                {done ? "✓" : i + 1}
              </div>
              <p className={`text-xs mt-1 font-medium whitespace-nowrap ${active ? "text-green-600" : done ? "text-green-500" : "text-gray-400"}`}>
                {s.label}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-1 mb-5 transition-all ${i < currentIdx ? "bg-green-600" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Request() {
  const searchParams = useSearchParams();
  const serviceType = searchParams.get("service") || "سباك";
  const serviceIcon  = searchParams.get("icon")    || "🔧";

  const [step, setStep]               = useState<Step>("form");
  const [requestId, setRequestId]     = useState<number | null>(null);
  const [loading, setLoading]         = useState(false);
  const [checking, setChecking]       = useState(true);
  const [available, setAvailable]     = useState(true);
  const [clientCommune, setClientCommune] = useState("");
  const [authError, setAuthError]     = useState(false);
  const [phoneError, setPhoneError]   = useState("");
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

  const goToReview = () => {
    setPhoneError("");
    setAuthError(false);

    if (!validatePhone(form.phone)) {
      setPhoneError("رقم الهاتف غير صحيح — يجب أن يبدأ بـ 05 أو 06 أو 07 ويحتوي على 10 أرقام");
      return;
    }
    setStep("review");
  };

  const handleSubmit = async () => {
    setAuthError(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setAuthError(true); setStep("form"); return; }

    setLoading(true);
    const { data, error } = await supabase.from("requests").insert({
      client_id: user.id,
      service_type: serviceType,
      description: form.description,
      address: form.address,
      phone: form.phone,
      status: "pending",
    }).select().single();

    if (!error && data) {
      setRequestId(data.id);
      setStep("done");
    }
    setLoading(false);
  };

  /* ── شاشة التحميل ── */
  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-green-600 font-bold animate-pulse">جاري التحقق من التوفر...</p>
      </main>
    );
  }

  /* ── الخدمة غير متوفرة ── */
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

  /* ── صفحة النجاح ── */
  if (step === "done") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce-once">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">تم إرسال طلبك بنجاح!</h2>
          <p className="text-gray-500 text-sm mb-6">في انتظار موافقة مقدم الخدمة</p>

          <div className="bg-green-50 rounded-2xl p-5 mb-4 text-center">
            <p className="text-gray-400 text-xs mb-1">رقم الطلب</p>
            <p className="text-4xl font-bold text-green-600">#{requestId}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-right flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{serviceIcon}</span>
              <p className="text-gray-700 text-sm font-bold">{serviceType}</p>
            </div>
            {clientCommune && (
              <div className="flex items-center gap-2">
                <span>📍</span>
                <p className="text-gray-500 text-sm">{clientCommune}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span>📞</span>
              <p className="text-gray-500 text-sm">{form.phone}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <a href="/dashboard" className="flex-1 text-center bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-all">
              متابعة طلباتي
            </a>
            <a href="/" className="flex-1 text-center border-2 border-green-600 text-green-600 py-3 rounded-xl font-bold text-sm hover:bg-green-50 transition-all">
              طلب خدمة أخرى
            </a>
          </div>
        </div>
      </main>
    );
  }

  /* ── مرحلة المراجعة ── */
  if (step === "review") {
    return (
      <main className="min-h-screen bg-gray-50" dir="rtl">
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <button onClick={() => setStep("form")} className="text-green-600 font-bold text-lg">← تعديل</button>
          <a href="/" className="text-xl font-bold text-green-600">Tasky DZ</a>
          <div className="w-16" />
        </header>

        <div className="max-w-lg mx-auto px-4 py-8">
          <StepBar current="review" />

          <h2 className="text-lg font-bold text-gray-800 text-center mb-6">راجع تفاصيل طلبك قبل الإرسال</h2>

          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50 mb-6 overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="text-3xl">{serviceIcon}</span>
              <div>
                <p className="text-xs text-gray-400">الخدمة المطلوبة</p>
                <p className="font-bold text-gray-800">{serviceType}</p>
              </div>
            </div>
            {clientCommune && (
              <div className="flex items-center gap-4 px-5 py-4">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs text-gray-400">البلدية</p>
                  <p className="font-bold text-gray-800">{clientCommune}</p>
                </div>
              </div>
            )}
            {form.description && (
              <div className="flex items-start gap-4 px-5 py-4">
                <span className="text-2xl mt-0.5">📝</span>
                <div>
                  <p className="text-xs text-gray-400">وصف المشكلة</p>
                  <p className="text-gray-700 text-sm">{form.description}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="text-2xl">🏠</span>
              <div>
                <p className="text-xs text-gray-400">العنوان</p>
                <p className="font-bold text-gray-800">{form.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-xs text-gray-400">رقم الهاتف</p>
                <p className="font-bold text-gray-800">{form.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="text-2xl">💵</span>
              <div>
                <p className="text-xs text-gray-400">طريقة الدفع</p>
                <p className="font-bold text-gray-800">دفع عند الاستلام</p>
              </div>
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
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-green-700 transition-all"
          >
            {loading ? "جاري الإرسال..." : "✅ تأكيد الطلب النهائي"}
          </button>
        </div>
      </main>
    );
  }

  /* ── مرحلة الإدخال ── */
  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <a href="/" className="text-green-600 font-bold text-lg">← رجوع</a>
        <a href="/" className="text-xl font-bold text-green-600">Tasky DZ</a>
        <div className="w-16" />
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        <StepBar current="form" />

        {/* الخدمة المختارة */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <p className="text-xs text-gray-400 mb-3 font-bold">الخدمة المختارة</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{serviceIcon}</span>
            <div>
              <p className="font-bold text-gray-800">{serviceType}</p>
              <p className="text-gray-400 text-xs mt-0.5">السعر يحدده مقدم الخدمة حسب وصف المشكلة</p>
            </div>
          </div>
          {clientCommune && (
            <div className="flex items-center gap-1 mt-3 bg-green-50 rounded-xl px-3 py-2">
              <span className="text-sm">📍</span>
              <p className="text-green-700 text-sm font-bold">{clientCommune}</p>
              <span className="text-green-600 text-xs mr-auto">الخدمة متوفرة ✅</span>
            </div>
          )}
        </div>

        {/* تفاصيل الطلب */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <p className="text-xs text-gray-400 mb-4 font-bold">تفاصيل الطلب</p>
          <div className="flex flex-col gap-4">
            <textarea
              name="description"
              placeholder="اشرح المشكلة بإيجاز... (اختياري)"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 resize-none"
            />
            <input
              type="text"
              name="address"
              placeholder="عنوانك (الحي، الشارع) *"
              value={form.address}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
            />
            <input
              type="tel"
              name="phone"
              dir="rtl"
              placeholder="رقم هاتفك (05XXXXXXXX) *"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              required
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
            />
            {phoneError && <p className="text-red-500 text-xs px-1">{phoneError}</p>}
          </div>
        </div>

        {/* طريقة الدفع */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <p className="text-xs text-gray-400 mb-3 font-bold">طريقة الدفع</p>
          <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center shrink-0">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <p className="text-gray-700 font-bold text-sm">دفع عند الاستلام</p>
          </div>
        </div>

        <button
          onClick={goToReview}
          disabled={!form.address || !form.phone}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-green-700 transition-all"
        >
          مراجعة الطلب ←
        </button>
      </div>
    </main>
  );
}

export default function RequestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-600 font-bold">جاري التحميل...</p>
      </div>
    }>
      <Request />
    </Suspense>
  );
}
