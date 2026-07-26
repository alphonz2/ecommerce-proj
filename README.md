# E-Commerce Project — Admin Panel (Products)

مشروع بسيط باستخدام Node.js + Express + MongoDB (Mongoose) حسب الملاحظات:
- Products CRUD كاملة (Admin Panel)
- Schema فيها: name, description, brand, category, price, quantity, available, status

## التشغيل

```bash
npm install
cp .env.example .env   # عدّل MONGO_URI حسب جهازك
npm run dev             # أو npm start
```

السيرفر بيشتغل على `http://localhost:5000`

## المسارات (Endpoints)

القاعدة: `/api/admin/products`

| # | العملية | Method | Route |
|---|---------|--------|-------|
| 1 | Add a product | POST | `/` |
| 2 | Get a specific product (by Id) | GET | `/:id` |
| 3 | Get all products | GET | `/` |
| 4 | Update a product | PUT | `/:id` |
| 5 | Delete a specific product | DELETE | `/:id` |
| 6 | Delete all products | DELETE | `/` |
| 7 | Get all available products | GET | `/available` |
| 8 | Get all unavailable products | GET | `/unavailable` |
| 9 | Get product by name | GET | `/name/:name` |
| 10 | Get product by category | GET | `/category/:category` |

## مثال Body لإضافة منتج (POST /)

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "brand": "Logitech",
  "category": "Electronics",
  "price": 15.99,
  "quantity": 50,
  "available": true,
  "status": "active"
}
```

## ملاحظات

- `.env` غير موجود في git (`.gitignore`) — استخدم `.env.example` كنموذج.
- الروابط الثابتة زي `/available` و `/unavailable` و `/name/:name` مكتوبة قبل `/:id` في الراوتر حتى ما تتعارض معه.




## اختبار عبر Postman

### تسجيل مستخدم جديد
```
POST http://localhost:5000/api/auth/register
```
Body → raw → JSON:
```json
{
  "username": "ahmed",
  "email": "ahmed@example.com",
  "password": "123456"
}
```

### تسجيل الدخول
```
POST http://localhost:5000/api/auth/login
```
```json
{
  "email": "ahmed@example.com",
  "password": "123456"
}
```
⚠️ Postman بيحفظ الكوكي تلقائياً بعد الـ login — هاي الكوكي هي يلي بتخلي الطلبات الجاية "متذكرة" إنك مسجل دخول.

### المستخدم الحالي (لازم تكون عملت login قبل)
```
GET http://localhost:5000/api/auth/me
```

### Route محمي (تجربة)
```
GET http://localhost:5000/api/auth/protected
```
لو مسجل دخول → رسالة ترحيب. لو لأ → `401`.

### تسجيل الخروج
```
POST http://localhost:5000/api/auth/logout
```

## ملاحظات

- الباسورد دايماً مشفر بـ bcrypt قبل ما ينخزن — أبداً نص صريح.
- مسارات المنتجات (`/api/admin/products/...`) يلي عملناهم سابقاً ضلوا شغالين متل ما هم، ما تأثروا.
- هاد النظام يستخدم **Sessions + Cookies** (مو JWT) — يعني الحالة محفوظة عالسيرفر.
