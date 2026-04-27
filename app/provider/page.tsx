"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProviderDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [eta, setEta] = useState("");

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
        .eq("service_type", prof.service_type)
        .order("created_at", { ascending: false });

      setRequests(reqs || []);
      setLoading(false);
    };
    load();
  }, [router]);

  const updateStatus = async (id: number, status: string) => {
    await supabase.from("requests").update({ status }).eq("id", id);
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const acceptWithEta = async (id: number) => {
    if (!eta.trim()) return;
    await supabase
      .from("requests")
      .update({ status: "accepted", estimated_time: eta.trim() })
      .eq("id", id);
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "accepted", estimated_time: eta.trim() } : r)
    );
    setAcceptingId(null);
    setEta("");
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

                  {/* وقت الوصول للطلبات المقبولة */}
                  {req.status === "accepted" && req.estimated_time && (
                    <div className="bg-blue-50 rounded-xl px-4 py-2 mb-3 flex items-center gap-2">
                      <span>⏱</span>
                      <p className="text-blue-700 text-sm font-bold">وقت الوصول: {req.estimated_time}</p>
                    </div>
                  )}

                  {/* زر القبول مع تحديد وقت الوصول */}
                  {req.status === "pending" && (
                    acceptingId === req.id ? (
                      <div className="mt-3 bg-green-50 rounded-2xl p-4">
                        <p className="text-sm font-bold text-gray-700 mb-3">🕐 متى ستصل للزبون؟</p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {["30 دقيقة", "ساعة واحدة", "ساعتين", "أكثر من ساعتين"].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setEta(opt)}
                              className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                                eta === opt
                                  ? "border-green-600 bg-green-600 text-white"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-green-400"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          dir="rtl"
                          placeholder="أو اكتب وقتاً آخر... (مثال: 45 دقيقة)"
                          value={eta}
                          onChange={(e) => setEta(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 mb-3"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptWithEta(req.id)}
                            disabled={!eta.trim()}
                            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 transition-all"
                          >
                            ✅ تأكيد القبول
                          </button>
                          <button
                            onClick={() => { setAcceptingId(null); setEta(""); }}
                            className="px-5 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-bold"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => { setAcceptingId(req.id); setEta(""); }}
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
                    )
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
