require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Build allowed origins list — always include Vercel preview URLs
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://mutcu.org',
  'https://www.mutcu.org',
  'https://mutcuweb.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return cb(null, true);
    // Allow exact matches
    if (allowedOrigins.includes(origin)) return cb(null, true);
    // Allow any *.vercel.app subdomain (Vercel preview deployments)
    if (origin.endsWith('.vercel.app')) return cb(null, true);
    // Allow any *.onrender.com (Render preview)
    if (origin.endsWith('.onrender.com')) return cb(null, true);
    // Allow localhost on any port
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return cb(null, true);
    console.warn('[CORS] Blocked origin:', origin);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle preflight OPTIONS requests explicitly
app.options('*', cors());

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' }));
// Stricter for form submissions
app.use('/api/contact', rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }));
app.use('/api/prayer', rateLimit({ windowMs: 60 * 60 * 1000, max: 20 }));
app.use('/api/newsletter', rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'MUTCU Website API', timestamp: new Date().toISOString() }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/admin', require('./routes/admin'));
app.use('/api/leadership', require('./routes/leadership'));
app.use('/api/events', require('./routes/events'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/prayer', require('./routes/prayer'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/ministries', require('./routes/ministries'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/ai', require('./routes/ai'));

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ MUTCU Website API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Supabase: ${process.env.SUPABASE_URL ? '✓ Connected' : '✗ Missing SUPABASE_URL'}`);
  console.log(`   Brevo: ${process.env.BREVO_API_KEY ? '✓ Configured' : '✗ Missing BREVO_API_KEY'}`);
  console.log(`   Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? '✓ Configured' : '✗ Missing CLOUDINARY_CLOUD_NAME'}`);
});