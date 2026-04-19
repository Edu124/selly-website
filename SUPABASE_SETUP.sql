-- ── Run this in your Supabase SQL Editor ──────────────────────────────────
-- Go to: supabase.com → your project → SQL Editor → New Query → paste & run

-- 1. Selly profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.selly_profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name    TEXT,
  business_id      TEXT UNIQUE,
  plan             TEXT    NOT NULL DEFAULT 'trial',   -- trial | pro
  trial_days_left  INTEGER NOT NULL DEFAULT 14,
  monthly_fee      INTEGER NOT NULL DEFAULT 3000,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_selly_user()
RETURNS TRIGGER AS $$
DECLARE
  new_bid TEXT;
BEGIN
  -- Generate a unique Business ID: SELLY-XXXX-XXXX
  new_bid := 'SELLY-'
    || upper(substring(md5(NEW.id::text) from 1 for 4)) || '-'
    || upper(substring(md5(random()::text)  from 1 for 4));

  INSERT INTO public.selly_profiles (id, business_name, business_id, plan)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'business_name',
    new_bid,
    'trial'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach the trigger
DROP TRIGGER IF EXISTS on_selly_user_created ON auth.users;
CREATE TRIGGER on_selly_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_selly_user();

-- 4. Row Level Security — users can only read their own profile
ALTER TABLE public.selly_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Selly users can view own profile" ON public.selly_profiles;
CREATE POLICY "Selly users can view own profile"
  ON public.selly_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Selly users can update own profile" ON public.selly_profiles;
CREATE POLICY "Selly users can update own profile"
  ON public.selly_profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. (Optional) Admin: upgrade a user to Pro
-- UPDATE public.selly_profiles
-- SET plan = 'pro', trial_days_left = 0
-- WHERE id = '<user-uuid-here>';
