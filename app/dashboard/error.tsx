"use client";
export default function ErrorPage({reset}:{reset:()=>void}) {
  return <section className="panel empty"><h2>تعذّر تحميل البيانات</h2><p>حدثت مشكلة في الاتصال. يمكنك إعادة المحاولة دون فقدان بياناتك المحفوظة.</p><button className="primary" onClick={reset}>إعادة المحاولة</button></section>;
}
