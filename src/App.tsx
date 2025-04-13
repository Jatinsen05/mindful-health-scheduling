
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import UpcomingAppointments from "./pages/UpcomingAppointments";
import PastAppointments from "./pages/PastAppointments";
import Prescriptions from "./pages/Prescriptions";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Layout
import { Layout } from "./components/layout/Layout";

// Context
import { HealthAppProvider } from "./contexts/HealthAppContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HealthAppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/book" element={<BookAppointment />} />
              <Route path="/upcoming" element={<UpcomingAppointments />} />
              <Route path="/past" element={<PastAppointments />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HealthAppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
