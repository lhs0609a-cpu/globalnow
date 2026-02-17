-- GLOBALNOW Database Schema

-- News table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ko TEXT,
  summary TEXT,
  summary_ko TEXT,
  content TEXT,
  url TEXT NOT NULL UNIQUE,
  image_url TEXT,
  source_id TEXT NOT NULL,
  category TEXT NOT NULL,
  country TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  sentiment FLOAT,
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trending items
CREATE TABLE IF NOT EXISTS trending (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ko TEXT,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  subreddit TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  collected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Humor content
CREATE TABLE IF NOT EXISTS humor (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ko TEXT,
  type TEXT NOT NULL CHECK (type IN ('meme', 'gif', 'satire', 'comic')),
  image_url TEXT,
  gif_url TEXT,
  content TEXT,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  tags TEXT[],
  published_at TIMESTAMPTZ NOT NULL,
  collected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market data
CREATE TABLE IF NOT EXISTS market_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  symbol TEXT,
  pair TEXT,
  name TEXT NOT NULL,
  name_ko TEXT,
  value FLOAT,
  price FLOAT,
  rate FLOAT,
  change FLOAT DEFAULT 0,
  change_percent FLOAT DEFAULT 0,
  change_24h FLOAT,
  market_cap FLOAT,
  volume_24h FLOAT,
  sparkline FLOAT[],
  label TEXT,
  label_ko TEXT,
  previous_value FLOAT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Morning briefs
CREATE TABLE IF NOT EXISTS morning_briefs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  items JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- So What analyses
CREATE TABLE IF NOT EXISTS so_what_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  key_point TEXT NOT NULL,
  background TEXT NOT NULL,
  outlook TEXT NOT NULL,
  action_item TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(news_id)
);

-- Signals
CREATE TABLE IF NOT EXISTS signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  title_ko TEXT,
  description TEXT,
  description_ko TEXT,
  company TEXT,
  ticker TEXT,
  value FLOAT,
  source TEXT NOT NULL,
  source_url TEXT,
  detected_at TIMESTAMPTZ NOT NULL,
  significance TEXT DEFAULT 'medium'
);

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_visit DATE,
  badges JSONB DEFAULT '[]'
);

-- User reads (for News DNA)
CREATE TABLE IF NOT EXISTS user_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  category TEXT,
  source_id TEXT,
  read_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, news_id)
);

-- Keyword alerts
CREATE TABLE IF NOT EXISTS user_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_triggered TIMESTAMPTZ,
  match_count INTEGER DEFAULT 0
);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  question_ko TEXT,
  description TEXT,
  option_a TEXT NOT NULL,
  option_a_ko TEXT,
  option_b TEXT NOT NULL,
  option_b_ko TEXT,
  votes_a INTEGER DEFAULT 0,
  votes_b INTEGER DEFAULT 0,
  deadline TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  result TEXT CHECK (result IN ('A', 'B')),
  category TEXT,
  related_news_id UUID REFERENCES news(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prediction_id UUID REFERENCES predictions(id) ON DELETE CASCADE,
  choice TEXT NOT NULL CHECK (choice IN ('A', 'B')),
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  is_correct BOOLEAN,
  UNIQUE(user_id, prediction_id)
);

-- Leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  v.user_id,
  up.nickname,
  up.avatar_url,
  COUNT(*) FILTER (WHERE v.is_correct = true) AS correct_predictions,
  COUNT(*) AS total_predictions,
  ROUND(COUNT(*) FILTER (WHERE v.is_correct = true)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) AS accuracy,
  COUNT(*) FILTER (WHERE v.is_correct = true) * 100 AS score
FROM votes v
JOIN user_profiles up ON v.user_id = up.id
WHERE v.is_correct IS NOT NULL
GROUP BY v.user_id, up.nickname, up.avatar_url
ORDER BY score DESC;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_country ON news(country);
CREATE INDEX IF NOT EXISTS idx_news_source ON news(source_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_collected ON news(collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_trending_source ON trending(source);
CREATE INDEX IF NOT EXISTS idx_trending_score ON trending(score DESC);
CREATE INDEX IF NOT EXISTS idx_humor_type ON humor(type);
CREATE INDEX IF NOT EXISTS idx_humor_upvotes ON humor(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_user_reads_user ON user_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_deadline ON predictions(deadline);
CREATE INDEX IF NOT EXISTS idx_signals_detected ON signals(detected_at DESC);

-- RPC function for vote increment
CREATE OR REPLACE FUNCTION increment_vote(p_id UUID, col TEXT)
RETURNS void AS $$
BEGIN
  IF col = 'votes_a' THEN
    UPDATE predictions SET votes_a = votes_a + 1 WHERE id = p_id;
  ELSIF col = 'votes_b' THEN
    UPDATE predictions SET votes_b = votes_b + 1 WHERE id = p_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
