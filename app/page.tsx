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
      <section className="bg-green-50 py-12 px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">كل خدماتك في مكان واحد</h2>
        <p className="text-gray-500 text-lg mb-6">سباك، كهربائي، نجار — في دقائق</p>
        <a href="/services" className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-bold inline-block">
          اطلب الآن
        </a>
      </section>

      {/* Services */}
      <section className="py-12 px-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">الخدمات المتاحة</h3>
        <p className="text-center text-gray-400 text-sm mb-8">اضغط على الخدمة لطلبها مباشرة</p>

        <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
          <a href="/request?service=سباك&icon=🔧" className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-green-400 hover:shadow-md transition-all">
            <div className="text-5xl">🔧</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-lg">سباك</h4>
              <p className="text-gray-500 text-sm">إصلاح تسربات، تمديدات المياه</p>
            </div>
            <div className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full">من 1500 دج</div>
          </a>

          <a href="/request?service=كهربائي&icon=⚡" className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-green-400 hover:shadow-md transition-all">
            <div className="text-5xl">⚡</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-lg">كهربائي</h4>
              <p className="text-gray-500 text-sm">إصلاح أعطال كهربائية، تركيب</p>
            </div>
            <div className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full">من 2000 دج</div>
          </a>

          <a href="/request?service=نجار&icon=🪚" className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-green-400 hover:shadow-md transition-all">
            <div className="text-5xl">🪚</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-lg">نجار</h4>
              <p className="text-gray-500 text-sm">إصلاح أثاث، تركيب أبواب</p>
            </div>
            <div className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full">من 1500 دج</div>
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-12 px-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">كيف يعمل؟</h3>
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
            <p className="text-gray-700">اختر الخدمة التي تحتاجها</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
            <p className="text-gray-700">حدد موقعك واشرح المشكلة</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
            <p className="text-gray-700">انتظر قبول مقدم الخدمة</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">4</div>
            <p className="text-gray-700">قيّم الخدمة بعد الانتهاء</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 text-center bg-green-600">
        <h3 className="text-2xl font-bold text-white mb-3">أنت مقدم خدمة؟</h3>
        <p className="text-green-100 mb-6">انضم إلينا وابدأ استقبال الطلبات اليوم</p>
        <a href="/register" className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold inline-block">
          سجل كمقدم خدمة
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p className="font-bold text-lg">Tasky DZ</p>
        <p className="text-gray-400 text-sm mt-1">كل خدماتك في مكان واحد 🇩🇿</p>
      </footer>
    </main>
  );
}
