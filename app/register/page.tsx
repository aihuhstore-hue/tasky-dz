"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const wilayas = [
  {
    id: 19, name: "سطيف", available: true,
    communes: ["سطيف", "عين أرنات", "عين ولمان", "بئر العرش", "بوقاعة", "الأرجاء", "قجال", "حمام السوخنة", "عين لقراج", "جميلة", "خربة", "المعامرة", "دراع قدوح", "روابح", "بني عزيز", "تالة إيفاسن"],
  },
  { id: 1, name: "أدرار", available: false, communes: [] },
  { id: 2, name: "الشلف", available: false, communes: [] },
  { id: 3, name: "الأغواط", available: false, communes: [] },
  { id: 4, name: "أم البواقي", available: false, communes: [] },
  { id: 5, name: "باتنة", available: false, communes: [] },
  { id: 6, name: "بجاية", available: false, communes: [] },
  { id: 7, name: "بسكرة", available: false, communes: [] },
  { id: 8, name: "بشار", available: false, communes: [] },
  { id: 9, name: "البليدة", available: false, communes: [] },
  { id: 16, name: "الجزائر", available: false, communes: [] },
  { id: 25, name: "قسنطينة", available: false, communes: [] },
  { id: 31, name: "وهران", available: false, communes: [] },
  { id: 23, name: "عنابة", available: false, communes: [] },
];

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState<typeof wilayas[0] | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    service_type: "",
    wilaya: "",
    commune: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wilaya = wilayas.find((w) => w.name === e.target.value);
    setSelectedWilaya(wilaya || null);
    setForm({ ...form, wilaya: e.target.value, commune: "" });
  };

  const validatePhone = (phone: string) => /^(05|06|07)[0-9]{8}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validatePhone(form.phone)) {
      setError("رقم الهاتف غير صحيح — يجب أن يبدأ بـ 05 أو 06 أو 07 ويحتوي على 10 أرقام");
      setLoading(false);
      return;
    }

    if (!form.wilaya || !form.commune) {
      setError("الرجاء اختيار الولاية والبلدية");
      setLoading(false);
      return;
    }

    const email = form.email || `user_${form.phone}@tasky.dz`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: form.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: form.full_name,
        phone: form.phone,
        role,
        service_type: role === "provider" ? form.service_type : null,
        wilaya: form.wilaya,
        commune: form.commune,
      });
    }

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8" dir="rtl">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-2">Tasky DZ</h1>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">إنشاء حساب جديد</h2>

        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button onClick={() => setRole("client")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === "client" ? "bg-green-600 text-white" : "text-gray-500"}`}>زبون</button>
          <button onClick={() => setRole("provider")} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === "provider" ? "bg-green-600 text-white" : "text-gray-500"}`}>مقدم خدمة</button>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="full_name" placeholder="الاسم الكامل" value={form.full_name} onChange={handleChange} required className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500" />

          <input type="tel" name="phone" placeholder="رقم الهاتف (05xxxxxxxx)" value={form.phone} onChange={handleChange} required maxLength={10} className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500" />

          <input type="email" name="email" placeholder="البريد الإلكتروني (اختياري)" value={form.email} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500" />

          <input type="password" name="password" placeholder="كلمة المرور" value={form.password} onChange={handleChange} required className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500" />

          {/* Wilaya + Commune */}
          <div className="flex gap-3">
            <select
              name="wilaya"
              value={form.wilaya}
              onChange={handleWilayaChange}
              required
              className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-green-500"
            >
              <option value="">اختر الولاية</option>
              {wilayas.map((w) => (
                <option key={w.id} value={w.name} disabled={!w.available}>
                  {w.name}{!w.available ? " (قريباً)" : ""}
                </option>
              ))}
            </select>

            <select
              name="commune"
              value={form.commune}
              onChange={handleChange}
              required
              disabled={!selectedWilaya?.available}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-green-500 disabled:opacity-50"
            >
              <option value="">اختر البلدية</option>
              {selectedWilaya?.communes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {role === "provider" && (
            <select name="service_type" value={form.service_type} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500">
              <option value="">اختر نوع الخدمة</option>
              <option value="سباك">سباك</option>
              <option value="كهربائي">كهربائي</option>
              <option value="نجار">نجار</option>
              <option value="دهان">دهان</option>
              <option value="تكييف">تكييف</option>
              <option value="غاز">غاز</option>
            </select>
          )}

          <button type="submit" disabled={loading} className="bg-green-600 text-white py-3 rounded-xl font-bold text-base mt-2 disabled:opacity-50">
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          لديك حساب؟{" "}
          <a href="/login" className="text-green-600 font-bold">سجل دخول</a>
        </p>
      </div>
    </main>
  );
}
