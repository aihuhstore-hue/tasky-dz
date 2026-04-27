"use client";
import { useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";

function ReviewForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestId = searchParams.get("id");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("reviews").insert({
      request_id: requestId,
      client_id: user?.id,
      rating,
      comment,
    });

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 text-center animate-scale-in">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">شكراً على تقييمك!</h2>
          <p className="text-gray-500 mb-6">تقييمك يساعدنا على تحسين الخدمة</p>
          <a href="/dashboard" className="block bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all">
            العودة للوحة التحكم
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-2">Tasky DZ</h1>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">قيّم الخدمة</h2>
        <p className="text-center text-gray-400 text-sm mb-8">رأيك يهمنا</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="text-5xl transition-transform hover:scale-110"
            >
              <span className={star <= (hover || rating) ? "text-yellow-400" : "text-gray-200"}>★</span>
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-green-600 font-bold mb-6">
            {rating === 1 ? "سيء" : rating === 2 ? "مقبول" : rating === 3 ? "جيد" : rating === 4 ? "جيد جداً" : "ممتاز! 🎉"}
          </p>
        )}

        <textarea
          placeholder="أضف تعليقاً (اختياري)..."
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 resize-none mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={!rating || loading}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-40 hover:bg-green-700 transition-all"
        >
          {loading ? "جاري الإرسال..." : "إرسال التقييم ⭐"}
        </button>
      </div>
    </main>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-green-600 font-bold">جاري التحميل...</p></div>}>
      <ReviewForm />
    </Suspense>
  );
}
