"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(prof);

      const { data: reqs } = await supabase
        .from("requests")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
      setRequests(reqs || []);
      setLoading(false);
    };
    load();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const statusLabel = (status: string) => {
    const map: any = {
      pending: { text: "في الانتظار", color: "bg-yellow-100 text-yellow-700" },
      accepted: { text: "مقبول", color: "bg-blue-100 text-blue-700" },
      completed: { text: "مكتمل", color: "bg-green-100 text-green-700" },
      cancelled: { text: "ملغي", color: "bg-red-100 text-red-700" },
    };
    return map[status] || { text: status, color: "bg-gray-100 text-gray-700" };
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-green-600 font-bold">جاري التحميل...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <button onClick={handleLogout} className="text-red-500 text-sm font-bold">خروج</button>
        <h1 className="text-xl font-bold text-green-600">Tasky DZ</h1>
        <div className="text-sm text-gray-500">👤 {profile?.full_name}</div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="bg-green-600 rounded-2xl p-6 text-white mb-6">
          <p className="text-green-100 text-sm">مرحباً،</p>
          <h2 className="text-2xl font-bold">{profile?.full_name} 👋</h2>
          <p className="text-green-100 text-sm mt-1">ماذا تحتاج اليوم؟</p>
        </div>

        {/* Quick Action */}
        <a
          href="/services"
          className="block bg-white rounded-2xl p-5 shadow-sm mb-6 flex items-center gap-4 border-2 border-dashed border-green-300"
        >
          <div className="text-3xl">➕</div>
          <div>
            <p className="font-bold text-gray-800">طلب خدمة جديدة</p>
            <p className="text-gray-500 text-sm">سباك، كهربائي، نجار...</p>
          </div>
        </a>

        {/* Requests */}
        <h3 className="font-bold text-gray-800 mb-4">طلباتي السابقة</h3>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500">لا يوجد طلبات بعد</p>
            <a href="/services" className="text-green-600 font-bold text-sm mt-2 block">
              اطلب خدمة الآن
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((req) => {
              const s = statusLabel(req.status);
              return (
                <div key={req.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">{req.service_type}</p>
                      <p className="text-gray-500 text-sm mt-1">{req.address}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(req.created_at).toLocaleDateString("ar-DZ")}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.color}`}>
                      {s.text}
                    </span>
                  </div>
                  {req.status === "completed" && (
                    <a
                      href={`/review?id=${req.id}`}
                      className="mt-3 w-full block text-center bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-xl text-sm font-bold transition-all"
                    >
                      ⭐ قيّم الخدمة
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
