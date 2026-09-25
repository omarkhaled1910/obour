// إصلاح لمشكلة DNS محلية على بعض أجهزة ويندوز حيث بيفشل Node.js في resolve
// عناوين MongoDB SRV (querySrv ECONNREFUSED) لأن resolver الافتراضي بيوجّه لـ 127.0.0.1.
// محصور على البيئة المحلية فقط (مفيش أي تأثير على Vercel/الإنتاج).
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && !process.env.VERCEL) {
    const dns = await import('dns')
    dns.setServers(['8.8.8.8', '1.1.1.1'])
  }
}
