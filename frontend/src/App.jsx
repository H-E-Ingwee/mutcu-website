import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import MinistriesPage from './pages/MinistriesPage'
import EventsPage from './pages/EventsPage'
import BlogsPage from './pages/BlogsPage'
import BlogDetailPage from './pages/BlogDetailPage'
import GalleryPage from './pages/GalleryPage'
import ResourcesPage from './pages/ResourcesPage'
import ContactPage from './pages/ContactPage'
import RegisterPage from './pages/RegisterPage'
import SermonArchivePage from './pages/SermonArchivePage'
import MinistryMatcherPage from './pages/MinistryMatcherPage'

// Ministry Pages
import MusicMinistryPage from './pages/ministries/MusicMinistryPage'
import BibleStudyPage from './pages/ministries/BibleStudyPage'
import MissionsPage from './pages/ministries/MissionsPage'
import CreativeArtsPage from './pages/ministries/CreativeArtsPage'
import PrayerMinistryPage from './pages/ministries/PrayerMinistryPage'
import HospitalityPage from './pages/ministries/HospitalityPage'
import TechnicalDeptPage from './pages/ministries/TechnicalDeptPage'
import WelfarePage from './pages/ministries/WelfarePage'
import DiscipleshipPage from './pages/ministries/DiscipleshipPage'
import RMCPage from './pages/ministries/RMCPage'

// Committee Pages
import ChairmanPage from './pages/committees/ChairmanPage'
import ViceChair1Page from './pages/committees/ViceChair1Page'
import ViceChair2Page from './pages/committees/ViceChair2Page'
import SecretaryPage from './pages/committees/SecretaryPage'
import ViceSecretaryPage from './pages/committees/ViceSecretaryPage'
import TreasurerPage from './pages/committees/TreasurerPage'
import BibleStudyCoordPage from './pages/committees/BibleStudyCoordPage'
import PrayerCoordPage from './pages/committees/PrayerCoordPage'
import MissionsCoordPage from './pages/committees/MissionsCoordPage'
import MusicCoordPage from './pages/committees/MusicCoordPage'
import TechnicalCoordPage from './pages/committees/TechnicalCoordPage'
import CreativeCoordPage from './pages/committees/CreativeCoordPage'

// Special Committees
import SpecialCommitteesPage from './pages/special-committees/SpecialCommitteesPage'
import AdvisoryBoardPage from './pages/special-committees/AdvisoryBoardPage'
import AuditingPage from './pages/special-committees/AuditingPage'
import AssociatesPage from './pages/special-committees/AssociatesPage'
import InterimECPage from './pages/special-committees/InterimECPage'
import RMCSpecialPage from './pages/special-committees/RMCSpecialPage'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminHomepage from './pages/admin/AdminHomepage'
import AdminSettings from './pages/admin/AdminSettings'
import AdminLeadership from './pages/admin/AdminLeadership'
import AdminEvents from './pages/admin/AdminEvents'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminGallery from './pages/admin/AdminGallery'
import AdminResources from './pages/admin/AdminResources'
import AdminMinistries from './pages/admin/AdminMinistries'
import AdminContacts from './pages/admin/AdminContacts'
import AdminPrayer from './pages/admin/AdminPrayer'
import AdminNewsletter from './pages/admin/AdminNewsletter'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Admin Login (standalone) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="homepage" element={<AdminHomepage />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="leadership" element={<AdminLeadership />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="ministries" element={<AdminMinistries />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="prayer" element={<AdminPrayer />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
        </Route>

        {/* Public Site */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="ministries" element={<MinistriesPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blogs/:slug" element={<BlogDetailPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="sermons" element={<SermonArchivePage />} />
          <Route path="find-your-ministry" element={<MinistryMatcherPage />} />

          {/* Ministry Detail Pages */}
          <Route path="ministries/music-ministry" element={<MusicMinistryPage />} />
          <Route path="ministries/bible-study" element={<BibleStudyPage />} />
          <Route path="ministries/missions-evangelism" element={<MissionsPage />} />
          <Route path="ministries/creative-arts" element={<CreativeArtsPage />} />
          <Route path="ministries/prayer-ministry" element={<PrayerMinistryPage />} />
          <Route path="ministries/hospitality-ministry" element={<HospitalityPage />} />
          <Route path="ministries/technical-department" element={<TechnicalDeptPage />} />
          <Route path="ministries/welfare-committee" element={<WelfarePage />} />
          <Route path="ministries/discipleship" element={<DiscipleshipPage />} />
          <Route path="ministries/rmc" element={<RMCPage />} />

          {/* Committee Pages */}
          <Route path="committees/chairman" element={<ChairmanPage />} />
          <Route path="committees/vice-chair1" element={<ViceChair1Page />} />
          <Route path="committees/vice-chair2" element={<ViceChair2Page />} />
          <Route path="committees/secretary" element={<SecretaryPage />} />
          <Route path="committees/vice-secretary" element={<ViceSecretaryPage />} />
          <Route path="committees/treasurer" element={<TreasurerPage />} />
          <Route path="committees/bible-study" element={<BibleStudyCoordPage />} />
          <Route path="committees/prayer" element={<PrayerCoordPage />} />
          <Route path="committees/missions" element={<MissionsCoordPage />} />
          <Route path="committees/music" element={<MusicCoordPage />} />
          <Route path="committees/technical" element={<TechnicalCoordPage />} />
          <Route path="committees/creative" element={<CreativeCoordPage />} />

          {/* Special Committees */}
          <Route path="special-committees" element={<SpecialCommitteesPage />} />
          <Route path="special-committees/advisory-board" element={<AdvisoryBoardPage />} />
          <Route path="special-committees/auditing" element={<AuditingPage />} />
          <Route path="special-committees/associates" element={<AssociatesPage />} />
          <Route path="special-committees/interim-exco" element={<InterimECPage />} />
          <Route path="special-committees/rmc" element={<RMCSpecialPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}