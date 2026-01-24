import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Season from './pages/Season';
import Rounds from './pages/Rounds';
import RoundJoin from './pages/RoundJoin';
import Payment from './pages/Payment';
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
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';
import KakaoCallback from './pages/KakaoCallback';
import GoogleCallback from './pages/GoogleCallback';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ExchangeManagement from './pages/admin/ExchangeManagement';
import ExchangeDetail from './pages/admin/ExchangeDetail';
import UserManagement from './pages/admin/UserManagement';
import SeasonSettlement from './pages/admin/SeasonSettlement';
import SeasonManagement from './pages/admin/SeasonManagement';
import RoundManagement from './pages/admin/RoundManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import DeliveryManagement from './pages/admin/DeliveryManagement';
import AdultVerification from './pages/admin/AdultVerification';
import RoundResults from './pages/admin/RoundResults';
import LedgerManagement from './pages/admin/LedgerManagement';
import RewardManagement from './pages/admin/RewardManagement';
import CouponManagement from './pages/admin/CouponManagement';
import AuditLog from './pages/admin/AuditLog';
import SystemSettings from './pages/admin/SystemSettings';
import ConsultationManagement from './pages/admin/ConsultationManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/oauth" element={<KakaoCallback />} />
        <Route path="/oauth/google" element={<GoogleCallback />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="adult-verification" element={<AdultVerification />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="seasons" element={<SeasonManagement />} />
          <Route path="rounds" element={<RoundManagement />} />
          <Route path="round-results" element={<RoundResults />} />
          <Route path="ledger" element={<LedgerManagement />} />
          <Route path="exchange" element={<ExchangeManagement />} />
          <Route path="exchange/:id" element={<ExchangeDetail />} />
          <Route path="delivery" element={<DeliveryManagement />} />
          <Route path="rewards" element={<RewardManagement />} />
          <Route path="coupons" element={<CouponManagement />} />
          <Route path="consultation" element={<ConsultationManagement />} />
          <Route path="settlement" element={<SeasonSettlement />} />
          <Route path="audit-log" element={<AuditLog />} />
          <Route path="settings" element={<SystemSettings />} />
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
                <Route path="/rounds/:id/join" element={<RoundJoin />} />
                <Route path="/rounds/:id/payment" element={<Payment />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/fail" element={<PaymentFail />} />
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
