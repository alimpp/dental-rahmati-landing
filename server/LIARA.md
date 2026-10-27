# دیپلوی لیارا — کلینیک امیر رحمتی

دو برنامه Node جدا بسازید + یک دیتابیس PostgreSQL.

| سرویس | مسیر پوشه | پورت | پلتفرم |
|--------|-----------|------|--------|
| API (Nest) | `server/` | `4000` | Node |
| سایت (Nuxt) | `client/` | `3000` | Node |
| دیتابیس | — | — | PostgreSQL |

## ۱) دیتابیس

1. در لیارا یک **PostgreSQL** بسازید.
2. اطلاعات اتصال (host / port / user / password / database) را بردارید.

## ۲) API (`server/`)

1. برنامه Node بسازید (مثلاً `dental-api`).
2. فایل‌سیستم را **Writable** کنید.
3. یک **دیسک** بسازید و روی مسیر `uploads` مانت کنید (برای آپلود عکس‌ها).
4. متغیرهای محیطی (از `.env.example`):

```env
PORT=4000
NODE_ENV=production
DB_HOST=...
DB_PORT=...
DB_USERNAME=...
DB_PASSWORD=...
DB_DATABASE=...
DB_SYNCHRONIZE=true
DB_LOGGING=false
JWT_SECRET=یک-رشته-بلند-تصادفی
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=رمز-قوی
SUPERADMIN_NAME=سوپر ادمین
```

5. از پوشه `server` دیپلوی:

```bash
cd server
liara deploy --app dental-api --port 4000 --platform node
```

6. بعد از بالا آمدن، URL را چک کنید: `https://dental-api.liara.run/api`

> پس از اولین سینک جداول، بهتر است `DB_SYNCHRONIZE=false` شود.

## ۳) سایت (`client/`)

1. برنامه Node بسازید (مثلاً `dental-web`).
2. فایل‌سیستم را **Writable** کنید (برای Nuxt لازم است).
3. متغیرها:

```env
PORT=3000
NUXT_PUBLIC_API_BASE=https://dental-api.liara.run/api
NUXT_PUBLIC_SITE_URL=https://dental-web.liara.run
API_ORIGIN=https://dental-api.liara.run
```

4. دیپلوی:

```bash
cd client
liara deploy --app dental-web --port 3000 --platform node
```

## ۴) دامنه

- دامنه اصلی را به برنامه **سایت** وصل کنید.
- در صورت نیاز ساب‌دامین `api.` را به برنامه API بزنید و `NUXT_PUBLIC_API_BASE` را آپدیت کنید.

## نکات

- `start` سرور: `node dist/main` (listen روی `0.0.0.0`)
- `start` کلاینت: `node .output/server/index.mjs`
- Node نسخه ۲۰ در `liara.json` تنظیم شده است.
- `.liaraignore` برای رد کردن `node_modules` و خروجی‌های بیلد آماده است.
