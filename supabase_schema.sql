-- ─────────────────────────────────────────────────────────────
--  GrowthOS — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analyses (
    id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
    url          TEXT         NOT NULL,
    score        INTEGER      NOT NULL CHECK (score >= 0 AND score <= 100),
    problems     JSONB        NOT NULL DEFAULT '[]',
    fixes        JSONB        NOT NULL DEFAULT '[]',
    rewrite      JSONB        NOT NULL DEFAULT '{}',
    raw_response TEXT,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS analyses_url_idx        ON analyses (url);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses (created_at DESC);

-- ─────────────────────────────────────────────────────────────
--  Row Level Security (RLS)
--  Enabled — anon/authenticated keys have NO access by default.
--  The backend uses the service_role key, which bypasses RLS
--  entirely, so inserts and selects from the backend still work.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Service role can insert (backend writes results here)
CREATE POLICY "service_insert" ON analyses
  FOR INSERT TO service_role WITH CHECK (true);

-- Service role can select (backend reads history)
CREATE POLICY "service_select" ON analyses
  FOR SELECT TO service_role USING (true);

-- Uncomment below ONLY if you want public/anon read access
-- CREATE POLICY "anon_select" ON analyses
--   FOR SELECT TO anon USING (true);

-- ─────────────────────────────────────────────────────────────
--  User Accounts — run this block to link analyses to users
--  Requires Supabase Auth to be enabled (it is by default)
-- ─────────────────────────────────────────────────────────────

ALTER TABLE analyses
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS analyses_user_id_idx ON analyses (user_id);

-- Allow authenticated users to read their own saved analyses
CREATE POLICY "users_select_own" ON analyses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
