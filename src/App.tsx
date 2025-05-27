
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthGuard } from "@/components/auth/SupabaseAuthGuard";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Pointage from "./pages/Pointage";
import Calendar from "./pages/Calendar";
import Gestion from "./pages/Gestion";
import WeeklySummary from "./pages/WeeklySummary";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors closeButton position="top-center" />
      <HashRouter>
        <Routes>
          {/* Route publique - Page de connexion */}
          <Route path="/" element={
            <SupabaseAuthGuard requireAuth={false}>
              <Index />
            </SupabaseAuthGuard>
          } />
          
          {/* Routes protégées - Authentification requise */}
          <Route path="/home" element={
            <SupabaseAuthGuard>
              <Home />
            </SupabaseAuthGuard>
          } />
          
          <Route path="/pointage" element={
            <SupabaseAuthGuard>
              <Pointage />
            </SupabaseAuthGuard>
          } />
          
          <Route path="/calendrier" element={
            <SupabaseAuthGuard>
              <Calendar />
            </SupabaseAuthGuard>
          } />
          
          <Route path="/suivi-hebdo" element={
            <SupabaseAuthGuard>
              <WeeklySummary />
            </SupabaseAuthGuard>
          } />
          
          <Route path="/profil" element={
            <SupabaseAuthGuard>
              <Profile />
            </SupabaseAuthGuard>
          } />
          
          <Route path="/rapports" element={
            <SupabaseAuthGuard>
              <Reports />
            </SupabaseAuthGuard>
          } />
          
          {/* Routes admin uniquement */}
          <Route path="/gestion/*" element={
            <SupabaseAuthGuard requireRole="admin">
              <Gestion />
            </SupabaseAuthGuard>
          } />
          
          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
