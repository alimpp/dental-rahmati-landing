# دیپلوی سایت روی لیارا (Nuxt)

جزئیات کامل در `../server/LIARA.md` است. خلاصه:

```bash
cd client
liara deploy --app dental-web --port 3000 --platform node
```

متغیرهای ضروری در پنل لیارا:

```env
PORT=3000
NUXT_PUBLIC_API_BASE=https://YOUR-API.liara.run/api
NUXT_PUBLIC_SITE_URL=https://YOUR-SITE.liara.run
API_ORIGIN=https://YOUR-API.liara.run
```

قبل از دیپلوی: فایل‌سیستم برنامه را Writable کنید.
