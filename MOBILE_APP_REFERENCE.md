# 📱 MOBILE APP REFERENCE - MESERIAS LOCAL

## 🗄️ SUPABASE DATABASE SCHEMA

### 1. **profiles** - Tabela principală utilizatori
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  role TEXT DEFAULT 'guest', -- 'guest', 'client', 'worker', 'admin'
  phone TEXT,
  address TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  registered_by UUID REFERENCES auth.users(id),
  is_pro BOOLEAN DEFAULT FALSE,
  pro_since TIMESTAMPTZ,
  is_online BOOLEAN DEFAULT FALSE,
  coordinates JSONB, -- {lat: number, lng: number}
  work_radius INTEGER,
  notifications_by_radius BOOLEAN DEFAULT FALSE,
  notifications_all_trades BOOLEAN DEFAULT FALSE
);
```

### 2. **jobs** - Cereri de servicii
```sql
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  address TEXT NOT NULL,
  tradeType TEXT NOT NULL,
  details JSONB, -- Additional job details
  images TEXT[], -- Array of image URLs
  review_id UUID REFERENCES reviews(id),
  is_guest_request BOOLEAN DEFAULT FALSE
);
```

### 3. **trades** - Tipuri de meserii
```sql
CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  slug TEXT UNIQUE,
  description TEXT
);
```

### 4. **worker_trades** - Meseriile meseriașilor
```sql
CREATE TABLE worker_trades (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trade_ids INTEGER[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (profile_id)
);
```

### 5. **reviews** - Recenzii
```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. **subscription_plans** - Planuri de abonament
```sql
CREATE TABLE subscription_plans (
  plan_id TEXT PRIMARY KEY, -- 'basic', 'pro', 'premium'
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL,
  credits_granted INTEGER NOT NULL,
  stripe_price_id_monthly TEXT NOT NULL,
  display_order INTEGER
);
```

### 7. **user_subscriptions** - Abonamente utilizatori
```sql
CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES subscription_plans(plan_id),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'canceled', 'past_due', 'incomplete', 'trialing'
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8. **user_credits** - Credite utilizatori
```sql
CREATE TABLE user_credits (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  balance INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. **contact_unlocks** - Deblocări contacte
```sql
CREATE TABLE contact_unlocks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);
```

### 10. **saved_jobs** - Joburi salvate
```sql
CREATE TABLE saved_jobs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);
```

### 11. **notifications** - Notificări
```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 12. **portfolio_items** - Portofoliu meseriași
```sql
CREATE TABLE portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 13. **certifications** - Certificări meseriași
```sql
CREATE TABLE certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT,
  issue_date DATE,
  expiry_date DATE,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 14. **profile_views** - Vizualizări profil
```sql
CREATE TABLE profile_views (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id),
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET
);
```

### 15. **phone_reveal_events** - Evenimente dezvăluire telefon
```sql
CREATE TABLE phone_reveal_events (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id),
  revealed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET
);
```

### 16. **chatbot_conversations** - Conversații chatbot
```sql
CREATE TABLE chatbot_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 17. **analytics_events** - Evenimente analytics
```sql
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_action TEXT,
  event_label TEXT,
  event_value INTEGER,
  custom_parameters JSONB,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 18. **ab_test_stats** - Statistici A/B test
```sql
CREATE TABLE ab_test_stats (
  id BIGSERIAL PRIMARY KEY,
  test_name TEXT NOT NULL,
  variant TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(test_name, variant)
);
```

---

## 📱 ECRANE MOBILE APP

### 🔐 **AUTHENTICATION SCREENS**

#### 1. **Login Screen** (`/login`)
- **Funcționalitate**: Autentificare utilizatori
- **Câmpuri**: Email, Password
- **API Endpoints**: 
  - `POST /auth/signin` - Login
  - `GET /auth/user` - Verificare sesiune
- **Navigare după login**: Dashboard sau Profile Complete

#### 2. **Register Screen** (`/register`)
- **Funcționalitate**: Înregistrare utilizatori noi
- **Câmpuri**: Name, Email, Password, Confirm Password
- **API Endpoints**: `POST /auth/signup`
- **Navigare după înregistrare**: Profile Complete

#### 3. **Forgot Password** (`/forgot-password`)
- **Funcționalitate**: Resetare parolă
- **Câmpuri**: Email
- **API Endpoints**: `POST /auth/reset-password`

#### 4. **Reset Password** (`/resetare-parola`)
- **Funcționalitate**: Setare parolă nouă
- **Câmpuri**: New Password, Confirm Password
- **API Endpoints**: `POST /auth/update-password`

#### 5. **Profile Complete** (`/profile/complete`)
- **Funcționalitate**: Completare profil după înregistrare
- **Câmpuri**: Role (client/worker), Phone, Address, Bio
- **API Endpoints**: `PUT /profiles/{id}`
- **Navigare după completare**: Dashboard

### 🏠 **MAIN SCREENS**

#### 6. **Home Screen** (`/`)
- **Funcționalitate**: Pagina principală cu hero și servicii
- **Componente**:
  - Hero cu search
  - Popular trades
  - How it works
  - Testimonials
- **API Endpoints**: 
  - `GET /trades` - Lista meserii
  - `GET /rpc/get_homepage_stats` - Statistici

#### 7. **Services List** (`/servicii`)
- **Funcționalitate**: Lista toate serviciile
- **Componente**: Grid cu categorii de servicii
- **API Endpoints**: `GET /trades`

#### 8. **Service Category** (`/servicii/{category}`)
- **Funcționalitate**: Servicii din o categorie
- **Componente**: Lista meseriași pentru categoria respectivă
- **API Endpoints**: `GET /profiles?role=worker&trades={category}`

#### 9. **Service City** (`/servicii/{category}/{city}`)
- **Funcționalitate**: Meseriași din oraș specific
- **Componente**: Lista meseriași cu filtrare pe oraș
- **API Endpoints**: `GET /profiles?role=worker&trades={category}&city={city}`

#### 10. **Tradesmen List** (`/meseriasi`)
- **Funcționalitate**: Lista toți meseriașii
- **Componente**: Grid cu meseriași, filtrare
- **API Endpoints**: `GET /profiles?role=worker`

#### 11. **Tradesman Profile** (`/meseriasi/{slug}`)
- **Funcționalitate**: Profil detaliat meseriaș
- **Componente**:
  - Informații meseriaș
  - Portfolio
  - Recenzii
  - Contact (deblocat cu credite)
- **API Endpoints**:
  - `GET /profiles/{id}`
  - `GET /reviews?worker_id={id}`
  - `POST /contact_unlocks` - Deblocare contact

### 📝 **JOB MANAGEMENT SCREENS**

#### 12. **Create Job** (`/cere-oferta`)
- **Funcționalitate**: Creare cerere serviciu
- **Câmpuri**: Title, Description, Trade Type, Address, Budget, etc.
- **API Endpoints**: `POST /jobs`
- **Navigare după creare**: Job Success

#### 13. **Job Success** (`/cere-oferta/succes`)
- **Funcționalitate**: Confirmare job creat
- **Componente**: Mesaj succes, link către dashboard

#### 14. **Job Details** (`/jobs/{id}`)
- **Funcționalitate**: Detalii job
- **Componente**:
  - Informații job
  - Lista meseriași aplicați
  - Status job
- **API Endpoints**: `GET /jobs/{id}`

### 👤 **DASHBOARD SCREENS**

#### 15. **Client Dashboard** (`/client-dashboard`)
- **Funcționalitate**: Dashboard pentru clienți
- **Componente**:
  - Overview cu joburi
  - Notificări
  - Profil
- **Sub-screens**:
  - Overview (`/client-dashboard/overview`)
  - Jobs (`/client-dashboard/requests`)
  - Notifications (`/client-dashboard/notifications`)
  - Profile (`/client-dashboard/profile`)
  - Reviews (`/client-dashboard/recenzii-de-lasat`)

#### 16. **Worker Dashboard** (`/dashboard`)
- **Funcționalitate**: Dashboard pentru meseriași
- **Componente**:
  - Overview cu statistici
  - Joburi disponibile
  - Aplicații
  - Recenzii
- **Sub-screens**:
  - Overview (`/dashboard/overview`)
  - Applications (`/dashboard/applications`)
  - Reviews (`/dashboard/reviews`)
  - Profile (`/dashboard/profile`)
  - Settings (`/dashboard/settings`)
  - Subscription (`/dashboard/subscription`)
  - Contact Unlocks (`/dashboard/contact-unlocks`)
  - Saved Jobs (`/dashboard/saved_jobs`)

### 💳 **SUBSCRIPTION SCREENS**

#### 17. **Pricing** (`/pricing`)
- **Funcționalitate**: Planuri de abonament
- **Componente**: Cards cu planuri, comparație
- **API Endpoints**: `GET /subscription_plans`

#### 18. **Subscription Success** (`/abonament/succes`)
- **Funcționalitate**: Confirmare abonament
- **Componente**: Mesaj succes, link către dashboard

#### 19. **Credits Success** (`/credite/succes`)
- **Funcționalitate**: Confirmare cumpărare credite
- **Componente**: Mesaj succes

### 📰 **CONTENT SCREENS**

#### 20. **Blog List** (`/blog`)
- **Funcționalitate**: Lista articole blog
- **Componente**: Grid cu articole, filtrare pe categorii
- **API Endpoints**: Sanity CMS

#### 21. **Blog Article** (`/blog/{slug}`)
- **Funcționalitate**: Articol blog individual
- **Componente**: Conținut articol, autor, data
- **API Endpoints**: Sanity CMS

#### 22. **Blog Category** (`/blog/categorie/{slug}`)
- **Funcționalitate**: Articole din o categorie
- **Componente**: Lista articole filtrate
- **API Endpoints**: Sanity CMS

### 📞 **CONTACT & INFO SCREENS**

#### 23. **Contact** (`/contact`)
- **Funcționalitate**: Pagină contact
- **Câmpuri**: Name, Email, Message
- **API Endpoints**: Email sending

#### 24. **About Us** (`/despre-noi`)
- **Funcționalitate**: Pagină despre noi
- **Componente**: Informații companie

#### 25. **Privacy Policy** (`/politica-confidentialitate`)
- **Funcționalitate**: Politica de confidențialitate

#### 26. **Terms & Conditions** (`/termeni-si-conditii`)
- **Funcționalitate**: Termeni și condiții

### 🤖 **AI FEATURES**

#### 27. **Chatbot**
- **Funcționalitate**: Asistent AI pentru ghidare
- **API Endpoints**: `POST /api/chatbot`
- **Componente**: Chat interface, sugestii

---

## 🔧 **API ENDPOINTS**

### **Authentication**
- `POST /auth/signin` - Login
- `POST /auth/signup` - Register
- `POST /auth/signout` - Logout
- `POST /auth/reset-password` - Reset password
- `GET /auth/user` - Get current user

### **Profiles**
- `GET /profiles` - List profiles (with filters)
- `GET /profiles/{id}` - Get profile by ID
- `PUT /profiles/{id}` - Update profile
- `DELETE /profiles/{id}` - Delete profile

### **Jobs**
- `GET /jobs` - List jobs (with filters)
- `GET /jobs/{id}` - Get job by ID
- `POST /jobs` - Create job
- `PUT /jobs/{id}` - Update job
- `DELETE /jobs/{id}` - Delete job

### **Reviews**
- `GET /reviews` - List reviews (with filters)
- `POST /reviews` - Create review
- `PUT /reviews/{id}` - Update review
- `DELETE /reviews/{id}` - Delete review

### **Subscriptions**
- `GET /subscription_plans` - List plans
- `GET /user_subscriptions` - Get user subscription
- `POST /user_subscriptions` - Create subscription
- `PUT /user_subscriptions/{id}` - Update subscription

### **Credits**
- `GET /user_credits` - Get user credits
- `PUT /user_credits` - Update credits

### **Contact Unlocks**
- `POST /contact_unlocks` - Unlock contact
- `GET /contact_unlocks` - List unlocks

### **Saved Jobs**
- `GET /saved_jobs` - List saved jobs
- `POST /saved_jobs` - Save job
- `DELETE /saved_jobs/{id}` - Remove saved job

### **Notifications**
- `GET /notifications` - List notifications
- `PUT /notifications/{id}` - Mark as read
- `DELETE /notifications/{id}` - Delete notification

### **Analytics**
- `POST /api/analytics` - Track event
- `POST /api/track-profile-view` - Track profile view
- `POST /api/track-phone-reveal` - Track phone reveal

---

## 🎨 **UI COMPONENTS**

### **Navigation**
- Bottom Tab Navigator (Mobile)
- Stack Navigator pentru fiecare tab
- Drawer Navigator pentru meniuri

### **Common Components**
- **Button**: Primary, Secondary, Outline variants
- **Input**: Text, Email, Password, Search
- **Card**: Job Card, Profile Card, Review Card
- **Modal**: Confirmation, Image Viewer
- **Toast**: Success, Error, Info notifications
- **Loading**: Spinner, Skeleton
- **Avatar**: User avatars with fallback
- **Rating**: Star rating component
- **Badge**: Status badges, PRO badges

### **Forms**
- **Job Form**: Multi-step form pentru creare job
- **Profile Form**: Editare profil
- **Review Form**: Adăugare recenzie
- **Contact Form**: Formular contact

### **Lists**
- **Job List**: Lista joburi cu filtrare
- **Profile List**: Lista meseriași
- **Review List**: Lista recenzii
- **Notification List**: Lista notificări

---

## 🔐 **SECURITY & PERMISSIONS**

### **Row Level Security (RLS)**
- Utilizatorii pot vedea doar propriile date
- Meseriașii pot vedea joburile publice
- Clienții pot vedea profilurile meseriașilor
- Adminii au acces complet

### **Authentication**
- Supabase Auth cu JWT tokens
- Refresh tokens pentru persistență
- Password reset cu email
- Social login (opțional)

### **Rate Limiting**
- API rate limiting pentru protecție
- Bot detection
- IP blocking pentru spam

---

## 📊 **ANALYTICS & TRACKING**

### **Events Tracked**
- Page views
- Button clicks
- Form submissions
- Profile views
- Contact unlocks
- Job applications
- Subscription conversions

### **User Properties**
- User ID
- Role (client/worker)
- Subscription status
- Location
- Device type

---

## 🚀 **DEPLOYMENT**

### **Environment Variables**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
BREVO_API_KEY=your_brevo_key
SANITY_PROJECT_ID=your_sanity_id
SANITY_DATASET=your_dataset
SANITY_TOKEN=your_token
```

### **Build Configuration**
- React Native / Expo
- TypeScript
- Supabase client
- Stripe integration
- Push notifications
- Offline support

---

## 📱 **MOBILE SPECIFIC FEATURES**

### **Push Notifications**
- Job notifications pentru meseriași
- Application updates pentru clienți
- Marketing notifications
- System notifications

### **Offline Support**
- Cache joburi și profiluri
- Offline job creation
- Sync când revine online

### **Location Services**
- GPS pentru căutare locală
- Geofencing pentru notificări
- Map integration

### **Camera & Media**
- Upload poze pentru joburi
- Avatar upload
- Portfolio images
- Document scanning

### **Social Features**
- Share joburi
- Invite friends
- Social login
- Referral system

---

## 🔄 **DATA FLOW**

### **Job Creation Flow**
1. Client fills job form
2. Job saved to database
3. Notifications sent to relevant workers
4. Workers can apply
5. Client reviews applications
6. Job assigned to worker
7. Job completed and reviewed

### **Subscription Flow**
1. User selects plan
2. Stripe payment processed
3. Subscription created in database
4. Credits added to user account
5. User can unlock contacts

### **Review Flow**
1. Job completed
2. Client prompted for review
3. Review saved to database
4. Worker rating updated
5. Review displayed on profile

---

## 📈 **PERFORMANCE OPTIMIZATION**

### **Caching Strategy**
- Redis cache pentru date statice
- Client-side cache pentru user data
- Image optimization și CDN
- Lazy loading pentru liste

### **Database Optimization**
- Indexuri pentru căutări frecvente
- Pagination pentru liste mari
- Query optimization
- Connection pooling

### **Mobile Optimization**
- Image compression
- Lazy loading
- Background sync
- Battery optimization

---

## 🧪 **TESTING STRATEGY**

### **Unit Tests**
- Component testing
- API endpoint testing
- Database function testing

### **Integration Tests**
- User flows
- Payment flows
- Notification flows

### **E2E Tests**
- Critical user journeys
- Cross-platform testing
- Performance testing

---

## 📚 **RESOURCES**

### **Documentation**
- Supabase docs: https://supabase.com/docs
- Stripe docs: https://stripe.com/docs
- React Native docs: https://reactnative.dev/docs
- Expo docs: https://docs.expo.dev

### **Design System**
- Color palette
- Typography
- Spacing system
- Component library

### **API Documentation**
- OpenAPI/Swagger specs
- Postman collections
- Example requests/responses

---

Această documentație oferă o privire completă asupra arhitecturii aplicației și poate fi folosită ca referință pentru dezvoltarea aplicației mobile.
