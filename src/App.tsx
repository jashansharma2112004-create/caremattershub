import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

// Eagerly load the Index page for best LCP
import Index from "./pages/Index";

// Lazy load other pages to reduce initial bundle size
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Register = lazy(() => import("./pages/Register"));
const Careers = lazy(() => import("./pages/Careers"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/register" element={<Register />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/reset-password" element={<AdminResetPassword />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
