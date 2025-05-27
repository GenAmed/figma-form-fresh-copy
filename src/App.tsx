
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { SessionManager } from "@/components/auth/SessionManager";
import { AuthGuard } from "@/components/auth/AuthGuard";
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
      <SessionManager>
        <Toaster richColors closeButton position="top-center" />
        <HashRouter>
          <Routes>
            {/* Route publique - Page de connexion */}
            <Route path="/" element={
              <AuthGuard requireAuth={false}>
                <Index />
              </AuthGuard>
            } />
            
            {/* Routes protégées - Authentification requise */}
            <Route path="/home" element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            } />
            
            <Route path="/pointage" element={
              <AuthGuard>
                <Pointage />
              </AuthGuard>
            } />
            
            <Route path="/calendrier" element={
              <AuthGuard>
                <Calendar />
              </AuthGuard>
            } />
            
            <Route path="/suivi-hebdo" element={
              <AuthGuard>
                <WeeklySummary />
              </AuthGuard>
            } />
            
            <Route path="/profil" element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            } />
            
            <Route path="/rapports" element={
              <AuthGuard>
                <Reports />
              </AuthGuard>
            } />
            
            {/* Routes admin uniquement */}
            <Route path="/gestion/*" element={
              <AuthGuard requireRole="admin">
                <Gestion />
              </AuthGuard>
            } />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </SessionManager>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
