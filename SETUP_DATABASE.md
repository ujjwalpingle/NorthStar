# NorthStar Setup Guide - Database & Authentication

## Quick Setup (5 minutes)

### Step 1: Create Supabase Account & Project
1. Go to https://app.supabase.com and sign up
2. Create a new project (choose any region close to you)
3. Wait for project initialization

### Step 2: Get Your Credentials
1. Go to **Project Settings** → **API**
2. Copy:
   - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
   - `anon public key` → NEXT_PUBLIC_SUPABASE_ANON_KEY

### Step 3: Update .env.local
Create `.env.local` in your project root with:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Run Database Migration
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query** 
3. Copy entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into SQL editor
5. Click **Run**

### Step 5: Create Your Account
1. Start your dev server: `npm run dev`
2. Go to http://localhost:3000
3. Set up Supabase authentication:
   - Go to **Authentication** → **Providers** → **Email**
   - Enable it
4. In your app's login screen, enter any email and password to create your account
5. You're done! Data will now sync across all devices

---

## Authentication Methods

### Option A: Supabase Email/Password (Recommended)
- **Setup**: Automatic after creating account in Step 5
- **Security**: Medium (email-based)
- **Sync**: ✅ Works across all devices
- **Best for**: Serious single-user apps

### Option B: Simple Password (Fallback)
If Supabase isn't configured, falls back to simple password mode:
1. Add to `.env.local`:
   ```
   NEXT_PUBLIC_AUTH_PASSWORD=your_secure_password
   ```
2. Only you need to know this password
3. Data stored locally only (no sync across devices)

---

## Troubleshooting

### "Supabase is not configured" error
- Check `.env.local` exists and has correct values
- Restart dev server after adding `.env.local`

### Login page shows password-only auth
- Supabase not detected, add `.env.local` with URL and key

### Data not syncing across devices
- Make sure you're signed into the same account
- Check browser storage isn't blocking cookies

### SQL Migration Error
- Run queries one by one instead of all at once
- Check that you're in the **SQL Editor** (not CLI)

---

## Your Data in the Cloud

All your data is now stored in Supabase:
- ✅ Wealth accounts & snapshots
- ✅ Migration checklist
- ✅ Habits & logs
- ✅ Goals & milestones
- ✅ Daily tasks
- ✅ Study topics
- ✅ Interview prep
- ✅ Career roadmap

**Row-Level Security**: Only you can access your data (enforced at database level).

---

## What's Next?

1. **Sign in** with your email/password
2. **Add your data** back into the app
3. **Test on mobile** - same account, same data!
4. **Enjoy sync** across all devices

---

## Developer Notes

- Migration file: `supabase/migrations/001_initial_schema.sql`
- Auth config: `src/lib/config.ts`
- Supabase client: `src/lib/supabase/client.ts`
- App context syncs automatically when signed in

**Need help?** Check Supabase docs: https://supabase.com/docs
