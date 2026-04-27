export default function Home() {
  return (
    <main className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">Tasky DZ</h1>
        <div className="flex gap-3">
          <a href="/login" className="text-green-600 border border-green-600 px-4 py-2 rounded-lg text-sm">دخول</a>
          <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">تسجيل</a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-green-50 py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">كل خدماتك في مكان واحد</h2>
        <p className="text-gray-500 text-lg mb-8">سباك، كهربائي، نجار — في دقائق</p>
        <a href="/services" className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-bold">
          اطلب الآن
        </a>
      </section>

      {/* Services */}
      <section className="py-12 px-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">الخدمات المتاحة</h3>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="bg-green-50 rounded-xl p-6 text-center cursor-pointer hover:bg-green-100">
            <div className="text-4xl mb-2">🔧</div>
            <p className="font-bold text-gray-700">سباك</p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 text-center cursor-pointer hover:bg-green-100">
            <div className="text-4xl mb-2">⚡</div>
            <p className="font-bold text-gray-700">كهربائي</p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 text-center cursor-pointer hover:bg-green-100">
            <div className="text-4xl mb-2">🪚</div>
            <p className="font-bold text-gray-700">نجار</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-12 px-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">كيف يعمل؟</h3>
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
            <p className="text-gray-700">اختر الخدمة التي تحتاجها</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
            <p className="text-gray-700">حدد موقعك</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
            <p className="text-gray-700">انتظر قبول مقدم الخدمة</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">4</div>
            <p className="text-gray-700">قيّم الخدمة بعد الانتهاء</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-600 text-white text-center py-6">
        <p className="font-bold text-lg">Tasky DZ</p>
        <p className="text-green-100 text-sm mt-1">كل خدماتك في مكان واحد 🇩🇿</p>
      </footer>
    </main>
  );
}
