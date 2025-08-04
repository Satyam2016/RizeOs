
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Feed from "./pages/Feed";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import PostJob from "./pages/PostJob";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>

      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Authentication Route */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Main App Routes with Layout */}
          <Route path="/" element={<Layout><Feed /></Layout>} />
          <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
          <Route path="/post-job" element={<Layout><PostJob /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/payments" element={<Layout><Payments /></Layout>} />
          <Route path="/create-post" element={<Layout><Feed /></Layout>} />
          <Route path="/my-jobs" element={<Layout><Jobs /></Layout>} />
          <Route path="/settings" element={<Layout><Profile /></Layout>} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;