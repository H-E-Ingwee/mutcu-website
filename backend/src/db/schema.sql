-- MUTCU Website Database Schema
-- Run this in the SAME Supabase project as the DMS
-- These tables are prefixed with website_ to avoid conflicts

-- ─── Website Events ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time VARCHAR(50),
  location VARCHAR(255),
  image_url TEXT,
  service_type VARCHAR(50), -- SUNDAY | FRIDAY | SPECIAL | OUTREACH | TRAINING
  speaker VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Website Blogs ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author VARCHAR(255),
  status VARCHAR(20) DEFAULT 'draft', -- draft | published
  tags TEXT, -- comma-separated
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Website Gallery ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  description TEXT,
  image_url TEXT NOT NULL,
  cloudinary_public_id TEXT,
  category VARCHAR(100), -- worship | outreach | fellowship | events | ministry
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Website Resources ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT,
  type VARCHAR(50), -- PDF | AUDIO | VIDEO | LINK | DOCUMENT
  image_url TEXT,
  category VARCHAR(100), -- sermons | devotionals | constitution | forms | other
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Website Prayer Requests ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255), -- optional, can be anonymous
  request TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending', -- pending | prayed_for | answered
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Website Newsletter ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Website Contacts ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new', -- new | read | replied | archived
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Website Ministries ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_ministries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  icon VARCHAR(100), -- fontawesome class e.g. fa-music
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Website Leadership (override/supplement for DMS data) ────────────────────
-- Used when DMS appointments table doesn't have website-specific fields
CREATE TABLE IF NOT EXISTS website_leadership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dms_user_id UUID, -- links to DMS users.id if available
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  role_slug VARCHAR(255), -- e.g. chairman, vice-chair-1, secretary
  photo_url TEXT,
  bio TEXT,
  personal_message TEXT, -- "A word from the [role]"
  email VARCHAR(255),
  phone VARCHAR(50),
  is_patron BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  spiritual_year VARCHAR(20), -- e.g. 2025/2026
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Website Testimonials ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote TEXT NOT NULL,
  author VARCHAR(255) DEFAULT 'MUTCU Member',
  role VARCHAR(255),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Seed default testimonials ────────────────────────────────────────────────
INSERT INTO website_testimonials (quote, author, is_active, display_order) VALUES
  ('MUTCU has been my family away from home. The fellowship and discipleship have deepened my faith and helped me navigate university life.', 'MUTCU Member', true, 1),
  ('Serving in ministry helped me grow in discipline, accountability, and boldness for Christ.', 'MUTCU Member', true, 2),
  ('The Word, prayer meetings, and mentorship shaped me spiritually and gave me purpose in campus.', 'MUTCU Member', true, 3)
ON CONFLICT DO NOTHING;

-- ─── Seed default ministries ──────────────────────────────────────────────────
INSERT INTO website_ministries (name, slug, description, icon, display_order) VALUES
  ('Prayer Ministry', 'prayer-ministry', 'Leading the Union into a deep culture of prayer—personal devotion, corporate intercession, and spiritual revival.', 'fa-praying-hands', 1),
  ('Music Ministry', 'music-ministry', 'Ministering worship with excellence through Praise & Worship, Choir, Instrumentalists and the Band.', 'fa-music', 2),
  ('Missions & Evangelism', 'missions-evangelism', 'Mobilizing members to proclaim the Gospel in word and deed—on campus and beyond—through evangelism and outreach.', 'fa-globe', 3),
  ('Bible Study & Training', 'bible-study', 'Deepening spiritual growth through Bible study, doctrine, trainings, and equipping programs for all members.', 'fa-book-open', 4),
  ('Discipleship', 'discipleship', 'Nurturing Christ-like maturity through mentorship, follow-up, small groups, and intentional spiritual formation.', 'fa-user-friends', 5),
  ('Technical & Media', 'technical-department', 'Supporting worship and communication through sound, visuals, coverage, design, and digital publicity platforms.', 'fa-photo-video', 6),
  ('Creative Arts (CREAM)', 'creative-arts', 'Communicating the Gospel creatively through drama, dance, spoken word, and other Christ-centred expressions.', 'fa-theater-masks', 7),
  ('Hospitality Committee', 'hospitality-ministry', 'Welcoming guests, coordinating seating/hosting, and ensuring visitors and members feel at home.', 'fa-mug-hot', 8),
  ('Welfare Committee', 'welfare-committee', 'Member care, encouragement, support in times of need, and strengthening fellowship as a family.', 'fa-hand-holding-heart', 9),
  ('Resource Mobilization (RMC)', 'rmc', 'Stewardship and mobilization of financial/material resources to support ministry work and programs.', 'fa-donate', 10)
ON CONFLICT (slug) DO NOTHING;

-- ─── Enable RLS (public read for most tables) ─────────────────────────────────
ALTER TABLE website_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_testimonials ENABLE ROW LEVEL SECURITY;

-- Service role full access (backend uses service key)
CREATE POLICY "Service role full access" ON website_events FOR ALL USING (true);
CREATE POLICY "Service role full access" ON website_blogs FOR ALL USING (true);
CREATE POLICY "Service role full access" ON website_gallery FOR ALL USING (true);
CREATE POLICY "Service role full access" ON website_resources FOR ALL USING (true);
CREATE POLICY "Service role full access" ON website_prayer_requests FOR ALL USING (true);
CREATE POLICY "Service role full access" ON website_newsletter FOR ALL USING (true);
CREATE POLICY "Service role full access" ON website_contacts FOR ALL USING (true);
CREATE POLICY "Service role full access" ON website_ministries FOR ALL USING (true);
CREATE POLICY "Service role full access" ON website_leadership FOR ALL USING (true);
CREATE POLICY "Service role full access" ON website_testimonials FOR ALL USING (true);