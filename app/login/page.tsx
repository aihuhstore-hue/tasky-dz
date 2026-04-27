"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

export default function Login() {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
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
      setError(lang === "ar" ? "رقم الهاتف غير صحيح — يجب أن يبدأ بـ 05 أو 06 أو 07 ويحتوي على 10 أرقام" : "Numéro invalide — doit commencer par 05, 06 ou 07 et contenir 10 chiffres");
      setLoading(false);
      return;
    }

    const email = `user_${form.phone}@tasky.dz`;
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password: form.password });

    if (loginError) {
      setError(lang === "ar" ? "رقم الهاتف أو كلمة المرور غير صحيحة" : "Téléphone ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir={t.dir}>
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-600">Tasky DZ</h1>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setLang("ar")} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${lang === "ar" ? "bg-green-600 text-white" : "text-gray-500"}`}>ع</button>
            <button onClick={() => setLang("fr")} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${lang === "fr" ? "bg-green-600 text-white" : "text-gray-500"}`}>Fr</button>
          </div>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">{t.login_title}</h2>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="tel" name="phone" placeholder={t.phone} value={form.phone} onChange={handleChange} required maxLength={10}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500" />
          <input type="password" name="password" placeholder={t.password} value={form.password} onChange={handleChange} required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500" />
          <button type="submit" disabled={loading}
            className="bg-green-600 text-white py-3 rounded-xl font-bold text-base mt-2 disabled:opacity-50">
            {loading ? t.logging_in : t.login_btn}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t.no_account}{" "}
          <a href="/register" className="text-green-600 font-bold">{t.register_now}</a>
        </p>
      </div>
    </main>
  );
}
