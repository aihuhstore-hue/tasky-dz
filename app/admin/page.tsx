"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"requests" | "users">("requests");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!prof || prof.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      const { data: reqs } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: usrs } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      setRequests(reqs || []);
      setUsers(usrs || []);
      setLoading(false);
    };
    load();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const deleteRequest = async (id: number) => {
    await supabase.from("requests").delete().eq("id", id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const statusColor: any = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusText: any = {
    pending: "في الانتظار",
    accepted: "مقبول",
    completed: "مكتمل",
    cancelled: "ملغي",
  };

  const roleText: any = {
    client: "زبون",
    provider: "مقدم خدمة",
    admin: "مدير",
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-green-600 font-bold">جاري التحميل...</p>
      </main>
    );
  }

  const total = requests.length;
  const pending = requests.filter((r) => r.status === "pending").length;
  const completed = requests.filter((r) => r.status === "completed").length;
  const clients = users.filter((u) => u.role === "client").length;
  const providers = users.filter((u) => u.role === "provider").length;

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 px-6 flex justify-between items-center">
        <button onClick={handleLogout} className="text-green-200 text-sm font-bold">خروج</button>
        <h1 className="text-xl font-bold">🛡️ لوحة الإدارة</h1>
        <div className="text-sm text-green-200">Tasky DZ</div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-green-600">{total}</p>
            <p className="text-gray-500 text-sm mt-1">إجمالي الطلبات</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-yellow-500">{pending}</p>
            <p className="text-gray-500 text-sm mt-1">طلبات في الانتظار</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-blue-500">{clients}</p>
            <p className="text-gray-500 text-sm mt-1">الزبائن</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-purple-500">{providers}</p>
            <p className="text-gray-500 text-sm mt-1">مقدمو الخدمات</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab("requests")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === "requests" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"
            }`}
          >
            الطلبات ({total})
          </button>
          <button
            onClick={() => setTab("users")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === "users" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"
            }`}
          >
            المستخدمون ({users.length})
          </button>
        </div>

        {/* Requests Tab */}
        {tab === "requests" && (
          <div className="flex flex-col gap-3">
            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <p className="text-gray-500">لا يوجد طلبات</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">طلب #{req.id} — {req.service_type}</p>
                      <p className="text-gray-500 text-sm mt-1">{req.description}</p>
                      <p className="text-gray-500 text-sm">📍 {req.address}</p>
                      <p className="text-gray-500 text-sm">📞 {req.phone}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(req.created_at).toLocaleDateString("ar-DZ")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[req.status] || "bg-gray-100 text-gray-700"}`}>
                        {statusText[req.status] || req.status}
                      </span>
                      <button
                        onClick={() => deleteRequest(req.id)}
                        className="text-red-400 text-xs font-bold hover:text-red-600"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div className="flex flex-col gap-3">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{user.full_name}</p>
                  <p className="text-gray-500 text-sm">📞 {user.phone}</p>
                  {user.service_type && (
                    <p className="text-gray-500 text-sm">🔧 {user.service_type}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(user.created_at).toLocaleDateString("ar-DZ")}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  user.role === "admin" ? "bg-purple-100 text-purple-700" :
                  user.role === "provider" ? "bg-blue-100 text-blue-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {roleText[user.role] || user.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
