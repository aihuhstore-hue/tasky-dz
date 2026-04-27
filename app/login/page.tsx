"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ phone: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    const email = `user_${form.phone}@tasky.dz`;

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: form.password,
    });

    if (loginError) {
      setError("رقم الهاتف أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-2">Tasky DZ</h1>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">تسجيل الدخول</h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={handleChange}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-3 rounded-xl font-bold text-base mt-2 disabled:opacity-50"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          ليس لديك حساب؟{" "}
          <a href="/register" className="text-green-600 font-bold">
            سجل الآن
          </a>
        </p>
      </div>
    </main>
  );
}
