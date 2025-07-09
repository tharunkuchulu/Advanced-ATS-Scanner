import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import BulkResumeResults from "@/components/BulkResumeResults";
import { 
  Upload, 
  FileText, 
  Target, 
  BarChart3, 
  LogOut, 
  User,
  Brain,
  Zap,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Search,
  Plus,
  ArrowRight,
  Database,
  Link,
  History,
  BarChart,
  Activity,
  Eye,
  Download
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [bulkResults, setBulkResults] = useState<any[]>([]);
  const [jdUploadProgress, setJdUploadProgress] = useState(0);
  const [showJdConfirm, setShowJdConfirm] = useState(false);
  const [selectedJdFile, setSelectedJdFile] = useState<File | null>(null);

  // Get user email on component mount
  useEffect(() => {
    // Get the actual user email from localStorage or use a default
    const email = localStorage.getItem('userEmail') || 'user@example.com';
    setUserEmail(email);
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Files uploaded successfully!",
            description: `${selectedFiles.length} resume(s) uploaded and ready for analysis.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleJDUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedJdFile(file);
      setShowJdConfirm(true);
      // Simulate reading file content
      const reader = new FileReader();
      reader.onload = (e) => {
        setJobDescription(e.target?.result as string || "Job description content will appear here...");
      };
      reader.readAsText(file);
    }
  };

  const confirmJDUpload = () => {
    if (!selectedJdFile) return;
    
    setShowJdConfirm(false);
    setJdUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setJdUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Job description uploaded!",
            description: "JD has been processed and is ready for matching.",
          });
          setJdUploadProgress(0);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleBulkAnalysis = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload resumes first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock results
    const mockResults = files.map((file, index) => ({
      id: `resume-${index}`,
      fileName: file.name,
      candidateName: `Candidate ${index + 1}`,
      jobFitScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
      matchingSkills: ["JavaScript", "React", "Node.js", "Python", "AWS"].slice(0, Math.floor(Math.random() * 3) + 2),
      missingSkills: ["Docker", "Kubernetes", "GraphQL"].slice(0, Math.floor(Math.random() * 2) + 1),
      experienceMatch: `${Math.floor(Math.random() * 5) + 3}+ years`,
      location: ["New York", "San Francisco", "Remote", "London"][Math.floor(Math.random() * 4)],
      yearsOfExperience: Math.floor(Math.random() * 8) + 2
    }));

    setBulkResults(mockResults.sort((a, b) => b.jobFitScore - a.jobFitScore));
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis complete!",
      description: `${files.length} resumes analyzed and ranked by fit score.`,
    });
  };

  const handleViewDetails = (resumeId: string) => {
    toast({
      title: "View Details",
      description: "Opening detailed analysis view...",
    });
  };

  const handleDownload = (resumeId: string) => {
    toast({
      title: "Download Started",
      description: "Resume is being downloaded...",
    });
  };

  const handleSectionNavigation = (section: string) => {
    const routes = {
      'resume-analysis': '/resume-analysis-engine',
      'upload-jd': '/upload-job-description',
      'jd-extractor': '/jd-extractor',
      'match-analysis': '/match-analysis',
      'jd-vs-resume': '/jd-vs-resume',
      'recruit': '/recruit',
      'history': '/history'
    };
    
    const route = routes[section as keyof typeof routes];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">SkillSync AI</span>
              <span className="text-gray-400">|</span>
              <span className="text-white">Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <User className="w-4 h-4" />
                <span className="text-sm">{userEmail}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-black/20 border-purple-500/30 text-purple-400 hover:text-white hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome to your SkillSync AI control center. Manage resumes, analyze job fits, and generate insights.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-cyan-500/20 rounded-lg mx-auto mb-3">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-cyan-400">0</h3>
              <p className="text-gray-400 text-sm">Resumes Analyzed</p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mx-auto mb-3">
                <Database className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-400">0</h3>
              <p className="text-gray-400 text-sm">Job Descriptions</p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-blue-400">0</h3>
              <p className="text-gray-400 text-sm">Matches Created</p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mx-auto mb-3">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-purple-400">0</h3>
              <p className="text-gray-400 text-sm">Reports Generated</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Resume Analysis Engine */}
          <Card className="bg-black/20 border-purple-500/20 group hover:border-cyan-500/40 transition-colors cursor-pointer" onClick={() => handleSectionNavigation('resume-analysis')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-cyan-500/20 rounded-lg">
                  <Upload className="w-6 h-6 text-cyan-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Resume Analysis Engine</h3>
              <p className="text-gray-400 text-sm mb-4">Upload and analyze candidate resumes with AI-powered insights</p>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Upload Job Description */}
          <Card className="bg-black/20 border-purple-500/20 group hover:border-green-500/40 transition-colors cursor-pointer" onClick={() => handleSectionNavigation('upload-jd')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Upload Job Description</h3>
              <p className="text-gray-400 text-sm mb-4">Add job descriptions for matching analysis</p>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* JD Extractor */}
          <Card className="bg-black/20 border-purple-500/20 group hover:border-blue-500/40 transition-colors cursor-pointer" onClick={() => handleSectionNavigation('jd-extractor')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg">
                  <Link className="w-6 h-6 text-blue-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">JD Extractor</h3>
              <p className="text-gray-400 text-sm mb-4">Extract job descriptions from LinkedIn, Indeed, and Google Jobs</p>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Match Analysis */}
          <Card className="bg-black/20 border-purple-500/20 group hover:border-orange-500/40 transition-colors cursor-pointer" onClick={() => handleSectionNavigation('match-analysis')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-orange-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Match Analysis</h3>
              <p className="text-gray-400 text-sm mb-4">Compare resumes with job descriptions for detailed analysis</p>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Second Row of Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* JD vs Resume */}
          <Card className="bg-black/20 border-purple-500/20 group hover:border-purple-500/40 transition-colors cursor-pointer" onClick={() => handleSectionNavigation('jd-vs-resume')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg">
                  <BarChart className="w-6 h-6 text-purple-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">JD vs Resume</h3>
              <p className="text-gray-400 text-sm mb-4">Direct comparison between job description and resume</p>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Recruit */}
          <Card className="bg-black/20 border-purple-500/20 group hover:border-pink-500/40 transition-colors cursor-pointer" onClick={() => handleSectionNavigation('recruit')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-pink-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-pink-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-pink-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Recruit</h3>
              <p className="text-gray-400 text-sm mb-4">Bulk resume analysis and candidate matching for recruitment</p>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="bg-black/20 border-purple-500/20 group hover:border-yellow-500/40 transition-colors cursor-pointer" onClick={() => handleSectionNavigation('history')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-lg">
                  <History className="w-6 h-6 text-yellow-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">History</h3>
              <p className="text-gray-400 text-sm mb-4">View and manage all analyzed resumes with filtering</p>
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Guide */}
        <Card className="bg-black/20 border-purple-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Quick Start Guide</CardTitle>
            <CardDescription className="text-gray-400">
              New to SkillSync AI? Follow these steps to get started with your first analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Upload Resume</h3>
                <p className="text-gray-400">Start by uploading a candidate's resume for AI analysis</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Add Job Description</h3>
                <p className="text-gray-400">Upload or extract job descriptions for comparison</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Generate Match</h3>
                <p className="text-gray-400">Create detailed matching analysis and export reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs at Bottom */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge 
            variant="default" 
            className="px-4 py-2 bg-purple-500/20 text-purple-400 border-purple-500/30 cursor-pointer hover:bg-purple-500/30"
            onClick={() => handleSectionNavigation('resume-analysis')}
          >
            Resume Analysis Engine
          </Badge>
          <Badge 
            variant="secondary" 
            className="px-4 py-2 bg-black/20 text-gray-400 hover:bg-gray-700/20 cursor-pointer"
            onClick={() => handleSectionNavigation('upload-jd')}
          >
            Upload Job Description
          </Badge>
          <Badge 
            variant="secondary" 
            className="px-4 py-2 bg-black/20 text-gray-400 hover:bg-gray-700/20 cursor-pointer"
            onClick={() => handleSectionNavigation('jd-extractor')}
          >
            JD Extractor
          </Badge>
          <Badge 
            variant="secondary" 
            className="px-4 py-2 bg-black/20 text-gray-400 hover:bg-gray-700/20 cursor-pointer"
            onClick={() => handleSectionNavigation('match-analysis')}
          >
            Match Analysis
          </Badge>
          <Badge 
            variant="secondary" 
            className="px-4 py-2 bg-black/20 text-gray-400 hover:bg-gray-700/20 cursor-pointer"
            onClick={() => handleSectionNavigation('jd-vs-resume')}
          >
            JD vs Resume
          </Badge>
          <Badge 
            variant="secondary" 
            className="px-4 py-2 bg-black/20 text-gray-400 hover:bg-gray-700/20 cursor-pointer"
            onClick={() => handleSectionNavigation('recruit')}
          >
            Recruit
          </Badge>
          <Badge 
            variant="secondary" 
            className="px-4 py-2 bg-black/20 text-gray-400 hover:bg-gray-700/20 cursor-pointer"
            onClick={() => handleSectionNavigation('history')}
          >
            History
          </Badge>
        </div>

        {/* Hidden Upload Areas for File Management */}
        <div className="hidden">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            id="resume-upload"
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleJDUpload}
            id="jd-upload"
          />
        </div>

        {/* Progress Indicators */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Card className="bg-black/20 border-purple-500/20 mt-4">
            <CardContent className="p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Uploading resumes...</span>
                <span className="text-purple-400">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </CardContent>
          </Card>
        )}

        {jdUploadProgress > 0 && jdUploadProgress < 100 && (
          <Card className="bg-black/20 border-purple-500/20 mt-4">
            <CardContent className="p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Processing JD...</span>
                <span className="text-green-400">{jdUploadProgress}%</span>
              </div>
              <Progress value={jdUploadProgress} className="h-2" />
            </CardContent>
          </Card>
        )}

        {/* JD Confirmation Dialog */}
        {showJdConfirm && (
          <Card className="bg-black/20 border-green-500/20 mt-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Confirm JD Upload</h4>
                  <p className="text-gray-400 text-sm">Ready to upload: {selectedJdFile?.name}</p>
                </div>
                <Button
                  onClick={confirmJDUpload}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload JD
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {bulkResults.length > 0 && (
          <div className="mt-8">
            <BulkResumeResults
              results={bulkResults}
              onViewDetails={handleViewDetails}
              onDownload={handleDownload}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
