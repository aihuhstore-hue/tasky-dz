"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    service_type: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      });
    }

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-2">Tasky DZ</h1>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">إنشاء حساب جديد</h2>

        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setRole("client")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              role === "client" ? "bg-green-600 text-white" : "text-gray-500"
            }`}
          >
            زبون
          </button>
          <button
            onClick={() => setRole("provider")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              role === "provider" ? "bg-green-600 text-white" : "text-gray-500"
            }`}
          >
            مقدم خدمة
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="full_name"
            placeholder="الاسم الكامل"
            value={form.full_name}
            onChange={handleChange}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="رقم الهاتف"
            value={form.phone}
            onChange={handleChange}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
          />
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني (اختياري)"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
          />
          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={handleChange}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
          />

          {role === "provider" && (
            <select
              name="service_type"
              value={form.service_type}
              onChange={handleChange}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
            >
              <option value="">اختر نوع الخدمة</option>
              <option value="plumber">سباك</option>
              <option value="electrician">كهربائي</option>
              <option value="carpenter">نجار</option>
            </select>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-3 rounded-xl font-bold text-base mt-2 disabled:opacity-50"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          لديك حساب؟{" "}
          <a href="/login" className="text-green-600 font-bold">
            سجل دخول
          </a>
        </p>
      </div>
    </main>
  );
}
