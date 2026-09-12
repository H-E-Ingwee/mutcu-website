-- ============================================================
-- MUTCU WEBSITE — COMPLETE SEED DATA
-- Run this in Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- ─── 1. WEBSITE EVENTS — September–December 2026 ─────────────────────────────

INSERT INTO website_events (title, date, time, service_type, speaker, description, image_url, is_active, is_featured) VALUES

-- Sunday Services
('Academic Excellence', '2026-09-06', '10:00 AM', 'SUNDAY', 'Orientation Department', 'Orientation Sunday — launching the new semester with a focus on academic excellence and God''s purpose for our studies.', '/assets/images/church2.jpg', true, true),
('Bible Study Sunday', '2026-09-13', '10:00 AM', 'SUNDAY', 'Bible Study, Discipleship & Training Department', 'A Sunday dedicated to in-depth Bible study and equipping members in the Word of God.', '/assets/images/bs1.jpg', true, false),
('God''s Redemption Plan', '2026-09-20', '10:00 AM', 'SUNDAY', 'Issa Thuo', 'Exploring the magnificent story of God''s redemptive plan for humanity through Jesus Christ. Back-up: Natasha Amani.', '/assets/images/church2.jpg', true, false),
('Giving', '2026-09-27', '10:00 AM', 'SUNDAY', 'Exec 2024/2025', 'A Sunday on the biblical principles of giving, stewardship, and generosity as an act of worship.', '/assets/images/church2.jpg', true, false),
('Hermeneutics', '2026-10-04', '10:00 AM', 'SUNDAY', 'Samuel Namano', 'Learning the art and science of biblical interpretation — how to correctly handle the Word of Truth. Back-up: Caleb Esere.', '/assets/images/bs1.jpg', true, false),
('Leadership', '2026-10-11', '10:00 AM', 'SUNDAY', 'Daphne Kimani', 'Biblical principles of servant leadership and how to lead with integrity and purpose. Back-up: Joshua Kipkirui.', '/assets/images/church2.jpg', true, false),
('Mental Health', '2026-10-18', '10:00 AM', 'SUNDAY', 'Becky Wanjiru', 'A candid conversation on mental health from a Christian perspective — finding wholeness in Christ. Back-up: John Mwanthii.', '/assets/images/church2.jpg', true, false),
('The Life and Character of Peter', '2026-10-25', '10:00 AM', 'SUNDAY', 'Samson Muturi', 'Lessons from the life of Peter — faith, failure, restoration, and purpose. Back-up: Emmanuel Vuma.', '/assets/images/church2.jpg', true, false),
('Christian Maturity', '2026-11-01', '10:00 AM', 'SUNDAY', 'Dr. John Ndia', 'Growing from spiritual infancy to maturity — what it means to be a fully devoted follower of Christ. Back-up: Martha Thuku.', '/assets/images/church2.jpg', true, false),
('Holy Communion', '2026-11-08', '10:00 AM', 'SUNDAY', 'Dr. Githaiga', 'A sacred Sunday of Holy Communion — remembering the sacrifice of Christ and renewing our covenant with God. Back-up: Dr. John Ndia.', '/assets/images/church2.jpg', true, false),
('Family Genesis', '2026-11-15', '10:00 AM', 'SUNDAY', 'Nancy Oginde', 'God''s design for family — understanding the foundations of godly relationships and family life. Back-up: Mwaura Mercy.', '/assets/images/church2.jpg', true, false),
('Stewardship', '2026-11-22', '10:00 AM', 'SUNDAY', 'Anne Kimathi', 'Faithful stewardship of time, talents, and resources — living as managers of God''s gifts. Back-up: Philemon Kaaria.', '/assets/images/church2.jpg', true, false),
('Newmatology', '2026-11-29', '10:00 AM', 'SUNDAY', 'Simon Kande', 'A deep dive into the doctrine of the Holy Spirit — His person, work, and role in the believer''s life. Back-up: Purdri Kihika.', '/assets/images/church2.jpg', true, false),
('Purity', '2026-12-06', '10:00 AM', 'SUNDAY', 'James Njuguna', 'Living a life of purity in a world that challenges our values — God''s call to holiness. Back-up: Mercy Mutuku.', '/assets/images/church2.jpg', true, false),
('The Man Jesus', '2026-12-13', '10:00 AM', 'SUNDAY', 'Rachel Mwangi', 'A Christmas season reflection on the humanity and divinity of Jesus Christ. Back-up: Peter Vaati.', '/assets/images/church2.jpg', true, true),

-- Friday Services
('Bible Study Exposition', '2026-09-11', '6:00 PM', 'FRIDAY', 'CMF/STEM', 'An in-depth exposition of Scripture led by CMF/STEM — equipping members in biblical knowledge.', '/assets/images/bs1.jpg', true, false),
('God''s Redemptive Plan', '2026-09-18', '6:00 PM', 'FRIDAY', 'Issa Thuo', 'A Friday fellowship exploring God''s redemptive plan — the Gospel in its fullness. Back-up: Natasha Amani.', '/assets/images/prayer1.jpg', true, false),
('Prayer Kesha', '2026-09-25', '6:00 PM', 'FRIDAY', 'Prayer Department', 'An all-night prayer meeting — seeking God''s face, interceding for the Union, campus, and nation.', '/assets/images/prayer1.jpg', true, true),
('Worship Experience', '2026-10-02', '6:00 PM', 'FRIDAY', 'Music Ministry', 'A Friday dedicated to extended worship — the Music Ministry leads the Union into God''s presence.', '/assets/images/music2.jpg', true, false),
('Creative Night', '2026-10-09', '6:00 PM', 'FRIDAY', 'Creative Ministry', 'A night of creative expression — drama, dance, spoken word, and artistic worship from CREAM.', '/assets/images/dance3.jpg', true, true),
('Living a Balanced Life', '2026-10-16', '6:00 PM', 'FRIDAY', 'Prof Humphrey Kirimi', 'Practical wisdom on balancing academics, ministry, relationships, and personal growth. Back-up: Beth Kamau.', '/assets/images/prayer1.jpg', true, false),
('Prayer Service', '2026-10-23', '6:00 PM', 'FRIDAY', 'Prayer Department', 'A corporate prayer service — interceding for the Union, the university, and the nation.', '/assets/images/prayer1.jpg', true, false),
('Law and Grace', '2026-10-30', '6:00 PM', 'FRIDAY', 'Jimmy Kidavasi', 'Understanding the relationship between the Law and Grace in the Christian life. Back-up: Lilian Wangari.', '/assets/images/church2.jpg', true, false),
('Integrity', '2026-11-06', '6:00 PM', 'FRIDAY', 'Dr Thuita', 'Living with integrity in all areas of life — character, honesty, and faithfulness. Back-up: Nicholas Mungai.', '/assets/images/church2.jpg', true, false),
('Creative Experience', '2026-11-13', '6:00 PM', 'FRIDAY', 'Creative Ministry', 'Another night of creative worship and artistic expression from the Creative Arts Ministry.', '/assets/images/cream1.JPG', true, false),
('Praise Fest', '2026-11-20', '6:00 PM', 'FRIDAY', 'Music Ministry', 'A high-energy night of praise and worship — all Music Ministry teams minister together.', '/assets/images/music2.jpg', true, true),
('Newmatology', '2026-11-27', '6:00 PM', 'FRIDAY', 'Simon Kande', 'Friday teaching on the Holy Spirit — His gifts, fruit, and work in the believer. Back-up: Purdri Kihika.', '/assets/images/church2.jpg', true, false),
('Prayer Service', '2026-12-04', '6:00 PM', 'FRIDAY', 'Prayer Department', 'End-of-semester prayer service — thanksgiving, intercession, and seeking God''s direction.', '/assets/images/prayer1.jpg', true, false),
('Christmas Cantata', '2026-12-11', '6:00 PM', 'FRIDAY', 'Creative Ministry', 'A collaborative Christmas celebration — music, drama, and creative arts celebrating the birth of Jesus.', '/assets/images/dance3.jpg', true, true),

-- Special Events
('Church Prayer Stretch & Bible Study Pastor''s Training', '2026-09-12', '8:00 AM', 'TRAINING', 'Prayer Department', 'A morning of corporate prayer and specialized training for Bible study leaders.', '/assets/images/prayer1.jpg', true, false),
('Prayer Walk & Evangelism Training', '2026-09-19', '8:00 AM', 'OUTREACH', 'Missions & Evangelism Ministry', 'Taking prayer to the streets — a prayer walk across campus combined with evangelism training.', '/assets/images/mission1.jpg', true, false),
('Leaders Retreat', '2026-09-26', '8:00 AM', 'TRAINING', 'Executive Council', 'A dedicated retreat for MUTCU leaders — vision, strategy, and spiritual renewal.', '/assets/images/BS3.jpg', true, true),
('CREAM Hangout', '2026-10-03', '2:00 PM', 'SPECIAL', 'Creative Arts Ministry', 'A fun and creative hangout for all CREAM members — fellowship, creativity, and community.', '/assets/images/dance3.jpg', true, false),
('Apologetics Forum', '2026-10-04', '2:00 PM', 'TRAINING', 'Bible Study Department', 'Equipping members to defend the faith — answering tough questions about Christianity.', '/assets/images/bs1.jpg', true, false),
('Music Training', '2026-10-17', '2:00 PM', 'TRAINING', 'Music Ministry', 'Specialized training for all Music Ministry members — vocal, instrumental, and worship leading.', '/assets/images/music2.jpg', true, false),
('Mbuzi Forum', '2026-10-19', '2:00 PM', 'SPECIAL', 'Executive Council', 'An open forum for members to raise questions, concerns, and ideas with the leadership.', '/assets/images/church2.jpg', true, false),
('Ladies Retreat', '2026-10-20', '8:00 AM', 'SPECIAL', 'Executive Council', 'A dedicated retreat for the ladies of MUTCU — fellowship, mentorship, and spiritual growth.', '/assets/images/prayer1.jpg', true, true),
('Play', '2026-10-28', '4:00 PM', 'SPECIAL', 'Creative Arts Ministry', 'A full theatrical production from the Creative Arts Ministry — drama, dance, and spoken word.', '/assets/images/drama2.JPG', true, true),
('Leaders Training', '2026-11-07', '8:00 AM', 'TRAINING', 'Executive Council', 'Equipping MUTCU leaders with skills, knowledge, and spiritual tools for effective ministry.', '/assets/images/BS3.jpg', true, false),
('Prayer Retreat', '2026-11-14', '8:00 AM', 'SPECIAL', 'Prayer Department', 'A dedicated day of prayer, fasting, and seeking God''s face for the Union and the nation.', '/assets/images/prayer1.jpg', true, true),
('Leaders Prayer Stretch & Ladies Initiative', '2026-11-21', '8:00 AM', 'SPECIAL', 'Executive Council', 'A combined leaders prayer stretch and ladies initiative — intercession and empowerment.', '/assets/images/prayer1.jpg', true, false)

ON CONFLICT DO NOTHING;

-- ─── 2. WEBSITE RESOURCES — YouTube Videos + Documents ───────────────────────

INSERT INTO website_resources (title, description, url, type, category, is_active, display_order) VALUES

-- Featured Videos
('Unlocking the Secrets to Academic Excellence', 'Learn the proven strategies and spiritual foundations for achieving academic success in university.', 'https://youtube.com/watch?v=brvyKkNHIps', 'VIDEO', 'sermons', true, 1),
('Purpose', 'A creative experience exploring God''s divine purpose for your life and ministry.', 'https://youtu.be/qqTkS5KQDyA', 'VIDEO', 'sermons', true, 2),
('Pastor John Ng''ang''a on Purposeful Life', 'Inspiring insights on living a life aligned with God''s plan and calling.', 'https://youtu.be/fbstJHBDGrc', 'VIDEO', 'sermons', true, 3),
('Best-P Class on Homiletics', 'Master the art of preaching and Biblical communication through this comprehensive guide.', 'https://youtu.be/uSIp_D1Vpcs', 'VIDEO', 'sermons', true, 4),

-- Documents
('MUTCU Constitution 2025', 'The official MUTCU Constitution — the governing document of the Union, amended 2025.', '/assets/images/THE AMENDED 2021 MUT-CU CONSTITUTION (1) (1).docx', 'DOCUMENT', 'constitution', true, 5),
('MUTCU Brand Guidelines', 'Official MUTCU brand guidelines including logo usage, colors, typography, and visual identity.', '/assets/images/MUTCU BRAND GUIDELINES.pdf', 'PDF', 'other', true, 6),
('MUTCU Overview', 'A comprehensive overview of MUTCU — its history, structure, vision, and mission.', '/assets/images/MUTCU OVERVIEW.docx', 'DOCUMENT', 'other', true, 7),
('September–December 2026 Program', 'The complete semester program for September to December 2026 — Sunday services, Friday fellowships, and special activities.', '/assets/images/SEPTEMBER - DECEMBER PROGRAM.docx', 'DOCUMENT', 'other', true, 8),
('2025 Amended Policies', 'The 2025 amended MUTCU policies document — updated guidelines for Union operations.', '/assets/images/2025 AMMENDED POLICIES[1].docx', 'DOCUMENT', 'constitution', true, 9)

ON CONFLICT DO NOTHING;

-- ─── 3. WEBSITE GALLERY — Real MUTCU Photos ───────────────────────────────────

INSERT INTO website_gallery (title, image_url, category, is_active, display_order) VALUES
('Executive Committee', '/assets/images/exec.jpg', 'fellowship', true, 1),
('Worship Service', '/assets/images/music2.jpg', 'worship', true, 2),
('Music Ministry', '/assets/images/music11.jpg', 'worship', true, 3),
('Band', '/assets/images/band1.jpg', 'worship', true, 4),
('Prayer Meeting', '/assets/images/prayer1.jpg', 'worship', true, 5),
('Corporate Prayer', '/assets/images/PRAYER.jpg', 'worship', true, 6),
('Sunday Service', '/assets/images/service.jpg', 'worship', true, 7),
('Church Gathering', '/assets/images/church1.jpg', 'worship', true, 8),
('Outreach', '/assets/images/mission1.jpg', 'outreach', true, 9),
('Crusade', '/assets/images/crusade.jpg', 'outreach', true, 10),
('Crusade 2', '/assets/images/crusade 2.jpg', 'outreach', true, 11),
('Community Outreach', '/assets/images/Outreach 1.jpg', 'outreach', true, 12),
('Dance Ministry', '/assets/images/dance3.jpg', 'ministry', true, 13),
('Dance Performance', '/assets/images/dance4.jpg', 'ministry', true, 14),
('Dance', '/assets/images/Dance1.jpg', 'ministry', true, 15),
('Dance Outreach 1', '/assets/images/Dance out1.jpg', 'ministry', true, 16),
('Dance Outreach 2', '/assets/images/Dance out2.jpg', 'ministry', true, 17),
('CREAM Ministry', '/assets/images/cream1.JPG', 'ministry', true, 18),
('Drama', '/assets/images/drama2.JPG', 'ministry', true, 19),
('Modelling', '/assets/images/models1.JPG', 'ministry', true, 20),
('Models', '/assets/images/MODELS.jpg', 'ministry', true, 21),
('Bible Study', '/assets/images/bs1.jpg', 'fellowship', true, 22),
('Bible Study Group', '/assets/images/BS3.jpg', 'fellowship', true, 23),
('Fellowship Moment', '/assets/images/mbbc1.jpg', 'fellowship', true, 24),
('Lumii Fellowship', '/assets/images/Lumii_20241023_192938507.jpg', 'fellowship', true, 25),
('Technical Ministry', '/assets/images/technicalDpt.jpg', 'ministry', true, 26),
('Film Premiere', '/assets/images/film1.jpg', 'events', true, 27),
('MULEWO 2026', '/assets/images/MULEWO 2026 1.png', 'events', true, 28),
('Business Exposition', '/assets/images/bus.jpg', 'events', true, 29),
('Chastity Campaign', '/assets/images/chastity walk.png', 'outreach', true, 30),
('Mega Play', '/assets/images/play.jpg', 'events', true, 31),
('TLP', '/assets/images/tlp.jpg', 'fellowship', true, 32),
('BEST-P', '/assets/images/bestp.jpg', 'fellowship', true, 33),
('Welfare Ministry', '/assets/images/welfare11.jpg', 'ministry', true, 34)

ON CONFLICT DO NOTHING;

-- ─── 4. WEBSITE MINISTRIES — All 10 with Full Descriptions ───────────────────

INSERT INTO website_ministries (name, slug, description, long_description, icon, image_url, is_active, display_order) VALUES

('Prayer Ministry', 'prayer-ministry',
'Leading the Union into a deep culture of prayer — personal devotion, corporate intercession, and spiritual revival.',
'The Prayer Ministry is the spiritual engine of MUTCU, dedicated to cultivating a deep culture of prayer and intercession among members. We believe that prayer is foundational to all ministry and that consistent, fervent intercession is key to spiritual breakthroughs and fulfilling the Union''s vision and mission. Through weekly prayer meetings, all-night keshas, prayer retreats, and intercession chains, we ensure that MUTCU remains a praying community — dependent on God for every step.',
'fa-praying-hands', '/assets/images/prayer1.jpg', true, 1),

('Music Ministry', 'music-ministry',
'Ministering worship with excellence through Praise & Worship, Choir, Instrumentalists and the Band.',
'The Music Ministry of MUTCU is dedicated to leading the Union in vibrant and spiritually uplifting worship experiences. Through multiple music teams including the choir, band, praise and worship leaders, and instrumentalists, we create an atmosphere where members can connect with God and express their faith through song. Our mandate is to lead the congregation in authentic, biblical, and excellent worship through music.',
'fa-music', '/assets/images/music2.jpg', true, 2),

('Missions & Evangelism', 'missions-evangelism',
'Mobilizing members to proclaim the Gospel in word and deed — on campus and beyond — through evangelism and outreach.',
'The Missions & Evangelism Ministry is committed to spreading the Gospel and serving communities. Through evangelism, community service, and discipleship, we seek to reach the lost, establish new believers in faith, and demonstrate Christ''s love through compassionate action. Our mandate is to equip and mobilize the CU to faithfully proclaim the gospel in word and deed, both on campus and beyond, ensuring that every member is engaged in the Great Commission.',
'fa-globe', '/assets/images/mission1.jpg', true, 3),

('Bible Study & Training', 'bible-study',
'Deepening spiritual growth through Bible study, doctrine, trainings, and equipping programs for all members.',
'The Bible Study & Training Ministry is the doctrinal and educational heart of MUTCU. We believe that a strong foundation in Scripture is essential for every believer, and we are committed to providing rich, in-depth Bible teaching for all members. From weekly Bible studies and small groups to specialized training programs and FOCUS Kenya conferences, this ministry equips members to know God''s Word, live by it, and share it with others.',
'fa-book-open', '/assets/images/bs1.jpg', true, 4),

('Discipleship', 'discipleship',
'Nurturing Christ-like maturity through mentorship, follow-up, small groups, and intentional spiritual formation.',
'The Discipleship Ministry is committed to the long-term spiritual growth of every MUTCU member. We believe that becoming like Christ is a lifelong journey that requires intentional relationships, accountability, and consistent spiritual formation. Through one-on-one mentorship, small discipleship groups, follow-up ministry, and leadership development, we walk alongside members at every stage of their spiritual journey — from new believers to mature leaders.',
'fa-user-friends', '/assets/images/BS3.jpg', true, 5),

('Technical & Media', 'technical-department',
'Supporting worship and communication through sound, visuals, coverage, design, and digital publicity platforms.',
'The Technical & Media Ministry ensures that all technical aspects of MUTCU''s services and events — including sound, visuals, live streaming, publicity, and digital communication — are executed with excellence, supporting the worship experience and enhancing our outreach impact. Our mandate is to provide excellent and seamless technical and media support for all CU activities and to manage the Union''s digital presence effectively.',
'fa-photo-video', '/assets/images/technicalDpt.jpg', true, 6),

('Creative Arts (CREAM)', 'creative-arts',
'Communicating the Gospel creatively through drama, dance, spoken word, and other Christ-centred expressions.',
'The Creative Arts Ministry uses drama, dance, spoken word, poetry, fine arts, and modeling to express faith and reach our community with the Gospel. We believe that artistic expression is a powerful medium for worship, evangelism, and spiritual growth. Our mandate is to use diverse artistic gifts to glorify God, edify the church, and communicate the gospel in a compelling way.',
'fa-theater-masks', '/assets/images/dance3.jpg', true, 7),

('Hospitality Ministry', 'hospitality-ministry',
'Welcoming guests, coordinating seating and hosting, and ensuring visitors and members feel at home.',
'The Hospitality Ministry is the welcoming face of MUTCU. We believe that every person who walks through our doors should feel genuinely welcomed, valued, and at home — reflecting the love and warmth of Christ. From ushering and seating to refreshments and member care, the Hospitality Ministry ensures that every MUTCU gathering is characterized by warmth, order, and genuine Christian fellowship.',
'fa-mug-hot', '/assets/images/guest-welcome.jfif', true, 8),

('Welfare Committee', 'welfare-committee',
'Member care, encouragement, support in times of need, and strengthening fellowship as a family.',
'The Welfare Committee is MUTCU''s expression of care and community. We believe that the Church is a family, and families look out for one another — especially in times of need. From practical support and sick visits to celebrations and fellowship activities, the Welfare Committee ensures that no member of MUTCU feels alone or unsupported. We are committed to building a community where everyone belongs and is cared for.',
'fa-hand-holding-heart', '/assets/images/welfare11.jpg', true, 9),

('Resource Mobilization (RMC)', 'rmc',
'Stewardship and mobilization of financial and material resources to support ministry work and programs.',
'The Resource Mobilization Committee (RMC) is responsible for ensuring that MUTCU has the financial and material resources needed to fulfill its mission. The RMC works alongside the Treasurer to identify funding opportunities, build partnerships, and mobilize resources for the Union''s programs and activities. We operate with a spirit of faithful stewardship, recognizing that all resources belong to God and are to be managed with integrity, transparency, and accountability.',
'fa-donate', '/assets/images/prayer1.jpg', true, 10)

ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  icon = EXCLUDED.icon,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order;

-- ─── 5. WEBSITE LEADERSHIP — Current EC Roster ───────────────────────────────

INSERT INTO website_leadership (name, role, role_slug, photo_url, is_patron, is_active, display_order, spiritual_year) VALUES

-- Patrons
('Dr. John Ndia', 'Patron', 'patron', '/assets/images/Ndia.jpg', true, true, 1, '2025/2026'),
('Dr. Tabitha Karanja', 'Assistant to the Patron', 'asst-patron', '/assets/images/TABITHA.jpg', true, true, 2, '2025/2026'),

-- Executive Committee
('Purdri Kihika', 'Chairman', 'chairman', '/assets/images/PADRI.jpeg', false, true, 1, '2025/2026'),
('Purity Njeri', '1st Vice Chairperson', 'vice-chair1', '/assets/images/PURITY.jpeg', false, true, 2, '2025/2026'),
('David Kimani', '2nd Vice Chairperson', 'vice-chair2', '/assets/images/DAVID.jpeg', false, true, 3, '2025/2026'),
('Faith Wavinya', 'CU Secretary', 'secretary', '/assets/images/FAITH.jpeg', false, true, 4, '2025/2026'),
('Natasha Amani', 'Vice Secretary', 'vice-secretary', '/assets/images/AMANI.jpeg', false, true, 5, '2025/2026'),
('Mercy Mwaura', 'CU Treasurer', 'treasurer', '/assets/images/MERCY.jpeg', false, true, 6, '2025/2026'),
('Caleb Esere', 'Bible Study & Training / Discipleship Chair', 'bible-study', '/assets/images/CALEB.jpg', false, true, 7, '2025/2026'),
('Martha Thuku', 'Prayer Ministry Coordinator', 'prayer', '/assets/images/MARTHA.jpeg', false, true, 8, '2025/2026'),
('Mercy Mutuku', 'Missions & Evangelism Coordinator', 'missions', '/assets/images/MUTUKU.jpeg', false, true, 9, '2025/2026'),
('Peter Vaati', 'Music Ministry Coordinator', 'music', '/assets/images/PETER.jpg', false, true, 10, '2025/2026'),
('John Mwanthi', 'Technical & Media Ministry Coordinator', 'technical', '/assets/images/JOHN.jpeg', false, true, 11, '2025/2026'),
('Esther Karimeri', 'Creative Arts Ministry Coordinator', 'creative', '/assets/images/ESTHER.jpeg', false, true, 12, '2025/2026')

ON CONFLICT DO NOTHING;

-- ─── 6. WEBSITE TESTIMONIALS ─────────────────────────────────────────────────

INSERT INTO website_testimonials (quote, author, role, is_active, display_order) VALUES
('MUTCU has been my family away from home. The fellowship and discipleship have deepened my faith and helped me navigate university life.', 'MUTCU Member', 'Full Member', true, 1),
('Serving in ministry helped me grow in discipline, accountability, and boldness for Christ.', 'MUTCU Member', 'Ministry Leader', true, 2),
('The Word, prayer meetings, and mentorship shaped me spiritually and gave me purpose in campus.', 'MUTCU Member', 'Full Member', true, 3),
('MUTCU gave me a community that prays together, grows together, and serves together. I found my purpose here.', 'MUTCU Member', 'Full Member', true, 4),
('The Creative Arts Ministry helped me discover that my gifts can be used for God''s glory. CREAM changed my life.', 'MUTCU Member', 'CREAM Member', true, 5)

ON CONFLICT DO NOTHING;

-- ─── 7. WEBSITE SETTINGS (site-wide config) ──────────────────────────────────
-- Note: Create this table if it doesn't exist yet

CREATE TABLE IF NOT EXISTS website_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  label VARCHAR(255),
  category VARCHAR(100) DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON website_settings FOR ALL USING (true);

INSERT INTO website_settings (key, value, label, category) VALUES
('site_name', 'MUTCU', 'Site Name', 'identity'),
('site_tagline', 'Inspire Love, Hope & Godliness', 'Site Tagline', 'identity'),
('site_email', 'info@mutcu.org', 'Contact Email', 'identity'),
('site_location', 'Murang''a University of Technology, Kenya', 'Location', 'identity'),
('social_facebook', 'https://www.facebook.com/people/Muranga-University-of-Technology-Christian-Union-1/100068859581695/', 'Facebook URL', 'social'),
('social_instagram', 'https://www.instagram.com/muranga_university_cu/', 'Instagram URL', 'social'),
('social_tiktok', 'https://www.tiktok.com/@mutcu001', 'TikTok URL', 'social'),
('social_youtube', 'https://www.youtube.com/@murangauniversityCU', 'YouTube URL', 'social'),
('portal_url', 'https://portal.mutcu.org', 'Member Portal URL', 'links'),
('homepage_events_limit', '6', 'Homepage Events Limit', 'homepage'),
('homepage_gallery_limit', '8', 'Homepage Gallery Limit', 'homepage'),
('featured_videos_limit', '4', 'Featured Videos Limit', 'resources'),
('meta_description', 'Murang''a University of Technology Christian Union — Inspire Love, Hope & Godliness. A Christ-centred student fellowship at MUT.', 'Default Meta Description', 'seo'),
('og_image', '/assets/images/exec.jpg', 'Default OG Image', 'seo')

ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- ─── Done ─────────────────────────────────────────────────────────────────────
SELECT 'Seed complete!' as status,
  (SELECT COUNT(*) FROM website_events) as events,
  (SELECT COUNT(*) FROM website_resources) as resources,
  (SELECT COUNT(*) FROM website_gallery) as gallery,
  (SELECT COUNT(*) FROM website_ministries) as ministries,
  (SELECT COUNT(*) FROM website_leadership) as leaders,
  (SELECT COUNT(*) FROM website_testimonials) as testimonials,
  (SELECT COUNT(*) FROM website_settings) as settings;