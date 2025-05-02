
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
      <ShadcnToaster />
      <Toaster richColors closeButton position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pointage" element={<Pointage />} />
          <Route path="/calendrier" element={<Calendar />} />
          <Route path="/suivi-hebdo" element={<WeeklySummary />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/rapports" element={<Reports />} />
          <Route path="/gestion/*" element={<Gestion />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
