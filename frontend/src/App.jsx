import { Routes, Route } from 'react-router-dom';
import SaleStrip from './components/SaleStrip';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Addresses from './pages/Addresses';
import NotFound from './pages/NotFound';
import DieticianPlan from './pages/DieticianPlan';
import ChangePassword from './pages/ChangePassword';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import TermsAndConditions from './pages/policies/TermsAndConditions';
import ShippingPolicy from './pages/policies/ShippingPolicy';
import RefundPolicy from './pages/policies/RefundPolicy';

import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminHealthConcerns from './pages/admin/AdminHealthConcerns';
import AdminHealthConcernForm from './pages/admin/AdminHealthConcernForm';
import AdminDieticianRequests from './pages/admin/AdminDieticianRequests';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminTestimonialForm from './pages/admin/AdminTestimonialForm';
import AdminSaleBanner from './pages/admin/AdminSaleBanner';

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <SaleStrip />
      <AnnouncementBar />
      <Header />
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dietician-plan" element={<DieticianPlan />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />

          <Route path="/account/password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:orderNumber" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
          <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/health-concerns" element={<AdminRoute><AdminHealthConcerns /></AdminRoute>} />
          <Route path="/admin/health-concerns/new" element={<AdminRoute><AdminHealthConcernForm /></AdminRoute>} />
          <Route path="/admin/health-concerns/:id/edit" element={<AdminRoute><AdminHealthConcernForm /></AdminRoute>} />

          <Route path="/admin/dietician-requests" element={<AdminRoute><AdminDieticianRequests /></AdminRoute>} />

          <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonials /></AdminRoute>} />
          <Route path="/admin/testimonials/new" element={<AdminRoute><AdminTestimonialForm /></AdminRoute>} />
          <Route path="/admin/testimonials/:id/edit" element={<AdminRoute><AdminTestimonialForm /></AdminRoute>} />

          <Route path="/admin/sale-banner" element={<AdminRoute><AdminSaleBanner /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
