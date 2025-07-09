
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import ResumeAnalysisEngine from "./pages/ResumeAnalysisEngine";
import UploadJobDescription from "./pages/UploadJobDescription";
import JDExtractor from "./pages/JDExtractor";
import MatchAnalysis from "./pages/MatchAnalysis";
import JDvsResume from "./pages/JDvsResume";
import Recruit from "./pages/Recruit";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/resume-analysis-engine" element={<ResumeAnalysisEngine />} />
          <Route path="/upload-job-description" element={<UploadJobDescription />} />
          <Route path="/jd-extractor" element={<JDExtractor />} />
          <Route path="/match-analysis" element={<MatchAnalysis />} />
          <Route path="/jd-vs-resume" element={<JDvsResume />} />
          <Route path="/recruit" element={<Recruit />} />
          <Route path="/history" element={<History />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
