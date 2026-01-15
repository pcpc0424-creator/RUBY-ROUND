import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Season from './pages/Season';
import Rounds from './pages/Rounds';
import Tiers from './pages/Tiers';
import Guide from './pages/Guide';
import MyPage from './pages/MyPage';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Login from './pages/Login';
import Exchange from './pages/Exchange';
import Participate from './pages/Participate';
import Notice from './pages/Notice';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Refund from './pages/Refund';
import Privacy from './pages/Privacy';
import YouthPolicy from './pages/YouthPolicy';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ExchangeManagement from './pages/admin/ExchangeManagement';
import ExchangeDetail from './pages/admin/ExchangeDetail';
import UserManagement from './pages/admin/UserManagement';

function App() {
  return (
    <Router basename="/RUBY-ROUND">
      <Routes>
        {/* Customer Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="exchange" element={<ExchangeManagement />} />
          <Route path="exchange/:id" element={<ExchangeDetail />} />
        </Route>

        {/* Customer Routes */}
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/season" element={<Season />} />
                <Route path="/rounds" element={<Rounds />} />
                <Route path="/tiers" element={<Tiers />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/about" element={<About />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/participate" element={<Participate />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/youth-policy" element={<YouthPolicy />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
