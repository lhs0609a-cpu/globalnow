-- User watchlist (for logged-in users, optional sync)
CREATE TABLE IF NOT EXISTS user_watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  name TEXT NOT NULL,
  name_ko TEXT,
  exchange TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ticker)
);

-- Weekly industry reports
CREATE TABLE IF NOT EXISTS weekly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  industry TEXT NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  content JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(industry, week_start)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_watchlist_user ON user_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlist_ticker ON user_watchlist(ticker);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_industry ON weekly_reports(industry);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_week ON weekly_reports(week_start DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_industry_week ON weekly_reports(industry, week_start DESC);

-- Enable trigram extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Full-text search index on news for watchdog matching
CREATE INDEX IF NOT EXISTS idx_news_title_trgm ON news USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_news_title_ko_trgm ON news USING gin (title_ko gin_trgm_ops);

-- RLS policies
ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

-- user_watchlist: users can only access their own watchlist
CREATE POLICY "Users can view own watchlist" ON user_watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist" ON user_watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist" ON user_watchlist
  FOR DELETE USING (auth.uid() = user_id);

-- weekly_reports: readable by everyone, writable by service role only
CREATE POLICY "Anyone can view reports" ON weekly_reports
  FOR SELECT USING (true);
