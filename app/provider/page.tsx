"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProviderDashboard() {
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

      if (!prof || prof.role !== "provider") {
        router.push("/dashboard");
        return;
      }
      setProfile(prof);

      const { data: reqs } = await supabase
        .from("requests")
        .select("*")
        .eq("service_type", prof.service_type === "plumber" ? "سباك" : prof.service_type === "electrician" ? "كهربائي" : "نجار")
        .order("created_at", { ascending: false });

      setRequests(reqs || []);
      setLoading(false);
    };
    load();
  }, [router]);

  const updateStatus = async (id: number, status: string) => {
    await supabase.from("requests").update({ status }).eq("id", id);
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

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

  const pending = requests.filter((r) => r.status === "pending");
  const active = requests.filter((r) => r.status === "accepted");
  const done = requests.filter((r) => r.status === "completed");

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <button onClick={handleLogout} className="text-red-500 text-sm font-bold">خروج</button>
        <h1 className="text-xl font-bold text-green-600">لوحة مقدم الخدمة</h1>
        <div className="text-sm text-gray-500">👷 {profile?.full_name}</div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-yellow-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
            <p className="text-xs text-gray-500 mt-1">في الانتظار</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{active.length}</p>
            <p className="text-xs text-gray-500 mt-1">جارية</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{done.length}</p>
            <p className="text-xs text-gray-500 mt-1">مكتملة</p>
          </div>
        </div>

        {/* Requests */}
        <h3 className="font-bold text-gray-800 mb-4">الطلبات الواردة</h3>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500">لا يوجد طلبات حالياً</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((req) => {
              const s = statusLabel(req.status);
              return (
                <div key={req.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-800">طلب #{req.id}</p>
                      <p className="text-gray-500 text-sm mt-1">{req.description}</p>
                      <p className="text-gray-500 text-sm">📍 {req.address}</p>
                      <p className="text-gray-500 text-sm">📞 {req.phone}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(req.created_at).toLocaleDateString("ar-DZ")}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.color}`}>
                      {s.text}
                    </span>
                  </div>

                  {req.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => updateStatus(req.id, "accepted")}
                        className="flex-1 bg-green-600 text-white py-2 rounded-xl text-sm font-bold"
                      >
                        ✅ قبول
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, "cancelled")}
                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-bold"
                      >
                        ❌ رفض
                      </button>
                    </div>
                  )}

                  {req.status === "accepted" && (
                    <button
                      onClick={() => updateStatus(req.id, "completed")}
                      className="w-full mt-3 bg-blue-600 text-white py-2 rounded-xl text-sm font-bold"
                    >
                      ✔️ تم الإنجاز
                    </button>
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
