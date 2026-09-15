# متجر إلكتروني ضخم ومتكامل (Enterprise E-Commerce API & Store)

مشروع تجارة إلكترونية متكامل ومقسم إلى مشروعي **Backend** و **Frontend** منفصلين تماماً، مع ربط قاعدة بيانات **MongoDB Atlas** الحقيقية ونظام كامل للمستخدمين، الصلاحيات، الكوبونات، المراجعات، لوحة التحكم، وإدارة الطلبات.

---

## 📁 هيكلية مجلدات المشروع (Project Structure)

```
d:/New folder (3)/
├── backend/                       # 🟢 الباك إند (Node.js / Express / MongoDB Mongoose)
│   ├── .env                       # يحتوي على رابط MongoDB Atlas ومفتاح الـ JWT
│   ├── package.json               # حزم (express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken)
│   ├── server.js                  # خادم Express الرئيسي ومسارات الـ 30+ Endpoint
│   ├── seeder.js                  # سكريبت تعبئة البيانات والمستخدمين الأوليين
│   ├── test-api-full.js           # سكريبت فحص واختبار كافة الـ Endpoints
│   ├── config/
│   │   └── db.js                  # الاتصال بـ MongoDB Atlas
│   ├── middleware/
│   │   └── authMiddleware.js      # حماية المسارات بواسطة JWT وفحص صلاحيات الأدمن
│   ├── models/
│   │   ├── User.js                # نموذج المستخدمين مع تشفير كلمات المرور والمفضلة
│   │   ├── Category.js            # نموذج الأقسام والتصنيفات
│   │   ├── Product.js             # نموذج المنتجات مع التقييمات والمراجعات
│   │   ├── Coupon.js              # نموذج كوبونات الخصم وتواريخ الانتهاء
│   │   ├── Order.js               # نموذج الطلبات وتتبع الحالات وتفاصيل الدفع
│   │   ├── Contact.js             # رسائل واستفسارات الدعم الفني
│   │   └── Newsletter.js          # الاشتراكات في النشرة الإخبارية
│   ├── controllers/
│   │   ├── authController.js      # تسجيل، دخول، ملف شخصي، تغيير كلمة المرور
│   │   ├── userController.js      # إدارة المستخدمين وتعيين الصلاحيات
│   │   ├── categoryController.js  # CRUD الأقسام
│   │   ├── productController.js   # المنتجات، المراجعات، والبحث والفلترة والـ Pagination
│   │   ├── couponController.js    # تطبيق وإنشاء وحذف الكوبونات
│   │   ├── wishlistController.js  # إضافة وحذف واستعراض قائمة المفضلة
│   │   ├── orderController.js     # إنشاء، إلغاء، استرجاع، وتحديث حالة الطلبات
│   │   ├── analyticsController.js # إحصائيات لوحة التحكم والتقارير المالية
│   │   └── contactController.js   # معالجة رسائل التواصل والنشرة البريدية
│   └── routes/
│       ├── authRoutes.js
│       ├── userRoutes.js
│       ├── categoryRoutes.js
│       ├── productRoutes.js
│       ├── couponRoutes.js
│       ├── wishlistRoutes.js
│       ├── orderRoutes.js
│       ├── analyticsRoutes.js
│       └── contactRoutes.js
│
└── frontend/                      # 🔵 الفرونت إند المستقل (HTML5 / CSS3 / JavaScript)
    ├── index.html                 # الصفحة الرئيسية (المنتجات، البحث الحي، الفلاتر)
    ├── product.html               # صفحة تفاصيل المنتج الكاملة والمراجعات
    ├── cart.html                  # سلة المشتريات التفاعلية وحساب الخصم والضرائب
    ├── checkout.html              # صفحة إتمام الشراء ونموذج بيانات العميل وطريقة الدفع
    ├── order-confirmation.html    # صفحة الفاتورة وتأكيد الطلب برقم فريد
    ├── css/
    │   └── style.css              # التصميم والتنسيقات الحديثة المتجاوبة
    └── js/
        ├── api.js                 # دوال الاتصال بـ Backend API (http://localhost:5000/api)
        ├── cart.js                # إدارة السلة والـ LocalStorage
        ├── main.js                # منطق المتجر والبحث
        ├── product.js             # منطق تفاصيل المنتج
        └── checkout.js            # منطق إتمام الطلب والفاتورة
```

---

## 📑 دليل الـ Endpoints الكامل (30+ Endpoints)

### 1. المصادقة والملف الشخصي (Authentication & Profile)
- `POST /api/auth/register` : تسجيل حساب مستخدم جديد (الاسم، البريد، كلمة المرور، الهاتف).
- `POST /api/auth/login` : تسجيل الدخول واستلام رمز JWT Token وبيانات المستخدم.
- `GET /api/auth/profile` : استرجاع الملف الشخصي للمستخدم الحالي (محمي بـ JWT).
- `PUT /api/auth/profile` : تحديث بيانات الملف الشخصي (الاسم، الهاتف، الصورة، العناوين).
- `PUT /api/auth/password` : تغيير كلمة المرور (تتطلب كلمة المرور القديمة).

### 2. إدارة المستخدمين (Users Management - Admin)
- `GET /api/users` : عرض قائمة كافة المستخدمين مع ترقيم الصفحات (Pagination).
- `GET /api/users/:id` : جلب بيانات مستخدم محدد بواسطة المعرف.
- `PUT /api/users/:id/role` : ترقية أو تغيير دور المستخدم (`user` أو `admin`).
- `DELETE /api/users/:id` : حذف مستخدم من النظام.

### 3. الأقسام والتصنيفات (Categories)
- `GET /api/categories` : جلب قائمة بكافة الأقسام والتصنيفات المتاحة.
- `GET /api/categories/:id` : استرجاع تفاصيل قسم محدد.
- `POST /api/categories` : إنشاء قسم جديد (أدمن فقط).
- `PUT /api/categories/:id` : تعديل بيانات قسم (أدمن فقط).
- `DELETE /api/categories/:id` : حذف قسم (أدمن فقط).

### 4. المنتجات والمراجعات (Products & Reviews)
- `GET /api/products` : جلب المنتجات مع دعم الفلترة حسب (Category, Search, Min/Max Price, Rating, InStock) والترتيب والترقيم.
- `GET /api/products/featured` : جلب المنتجات المميزة والأعلى تقييماً.
- `GET /api/products/:id` : جلب تفاصيل المنتج الكاملة مع المراجعات.
- `POST /api/products` : إضافة منتج جديد (أدمن فقط).
- `PUT /api/products/:id` : تعديل بيانات منتج ومخزونه (أدمن فقط).
- `DELETE /api/products/:id` : حذف منتج (أدمن فقط).
- `POST /api/products/:id/reviews` : إضافة تقييم ومراجعة بالنجوم مع تحديث متوسط التقييم تلقائياً (محمي بـ JWT).
- `GET /api/products/:id/reviews` : استعراض كافة مراجعات وتقييمات المنتج.

### 5. نظام الكوبونات والخصومات (Coupons System)
- `POST /api/coupons/apply` : فحص وتطبيق كود الخصم (مثل `SAVE10`, `WELCOME20`, `CASH30`) وحساب قيمة الخصم.
- `GET /api/coupons` : استعراض كافة الكوبونات وتواريخ انتهائها ونسب استخدامها (أدمن فقط).
- `POST /api/coupons` : إنشاء كوبون خصم جديد بنسبة مئوية أو قيمة ثابتة (أدمن فقط).
- `DELETE /api/coupons/:id` : حذف أو إيقاف كوبون خصم (أدمن فقط).

### 6. قائمة الرغبات والمفضلة (Wishlist - JWT Protected)
- `GET /api/wishlist` : استعراض المنتجات المضافة في قائمة المفضلة للمستخدم.
- `POST /api/wishlist/:productId` : إضافة منتج إلى المفضلة.
- `DELETE /api/wishlist/:productId` : إزالة منتج من المفضلة.

### 7. إدارة الطلبات (Orders Management)
- `POST /api/orders` : إنشاء ومعالجة طلب شراء جديد (يدعم الكوبونات، وإنقاص المخزون، والزوار أو المستخدمين المسجلين).
- `GET /api/orders/my-orders` : استعراض سجل الطلبات السابقة للمستخدم الحالي (محمي بـ JWT).
- `GET /api/orders` : استعراض كافة الطلبات مع الفلترة حسب الحالة (`قيد التنفيذ`, `تم الشحن`, `تم التوصيل`, `ملغي`) (أدمن فقط).
- `GET /api/orders/:id` : استرجاع تفاصيل طلب محدد والفاتورة.
- `PUT /api/orders/:id/status` : تعديل حالة الطلب إلى مشحون أو مكتمل وتحديث حالة الدفع (أدمن فقط).
- `PUT /api/orders/:id/cancel` : إلغاء الطلب وإرجاع كميات المنتجات إلى المخزون تلقائياً في قاعدة البيانات.

### 8. لوحة التحليلات والإحصائيات (Admin Analytics Dashboard)
- `GET /api/analytics/dashboard` : إحصائيات متقدمة تشمل إجمالي المبيعات، الأرباح، عدد الطلبات، تصنيف الحالات، المنتجات الأكثر مبيعاً، والمنتجات المنتهية من المخزون (أدمن فقط).

### 9. التواصل والدعم والنشرة البريدية (Contact & Newsletter)
- `POST /api/contact` : إرسال رسالة تواصل واستفسار من العميل.
- `GET /api/contact` : عرض رسائل واستفسارات العملاء في لوحة التحكم (أدمن فقط).
- `POST /api/newsletter/subscribe` : اشتراك بريد العميل في النشرة الإخبارية والعروض.

---

## 🚀 حسابات الدخول التجريبية الجاهزة في قاعدة البيانات

| الحساب | البريد الإلكتروني | كلمة المرور | الصلاحية |
|---|---|---|---|
| **مدير النظام (Admin)** | `admin@store.com` | `admin123456` | صلاحيات كاملة (Admin) |
| **عميل تجريبي (User)** | `user@store.com` | `user123456` | مستخدم عادي (Customer) |

---

## 💻 كيفية التشغيل

1. **تشغيل الباك إند:**
   ```bash
   cd backend
   npm run dev
   ```
2. **فحص الـ Endpoints آلياً:**
   ```bash
   node test-api-full.js
   ```
3. **فتح الفرونت إند:**
   - افتح ملف `frontend/index.html` في المتصفح.
