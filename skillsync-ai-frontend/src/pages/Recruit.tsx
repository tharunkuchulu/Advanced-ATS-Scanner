
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import BulkResumeResults from "@/components/BulkResumeResults";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Download,
  Users,
  Eye
} from "lucide-react";

const Recruit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'url'>('text');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bulkResults, setBulkResults] = useState<any[]>([]);

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

  const handleMatchToJob = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload resumes first.",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription) {
      toast({
        title: "Job description required",
        description: "Please provide a job description.",
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

  const handleExport = (format: string) => {
    toast({
      title: `${format} Export`,
      description: `Bulk analysis results will be downloaded as ${format}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-purple-400 hover:text-purple-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('CSV')}
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('PDF')}
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Recruit</h1>
          <p className="text-gray-400">Bulk resume analysis and candidate matching for recruitment teams</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Bulk Resume Upload */}
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Bulk Resume Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6 p-8 border-2 border-dashed border-purple-500/30 rounded-lg">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Drop multiple resumes here or click to browse
                  </h3>
                  <p className="text-gray-400">Select multiple PDF, DOC, DOCX files (up to 50 files)</p>
                </div>

                <div>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="bulk-resume-upload"
                  />
                  <label htmlFor="bulk-resume-upload">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <FileText className="w-4 h-4 mr-2" />
                      Browse Files
                    </Button>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                    <p className="text-white font-medium">{files.length} files selected</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {files.slice(0, 3).map((file, index) => (
                        <span key={index} className="text-xs text-gray-400">{file.name}{index < 2 && files.length > 1 ? ', ' : ''}</span>
                      ))}
                      {files.length > 3 && <span className="text-xs text-gray-400">... and {files.length - 3} more</span>}
                    </div>
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Uploading...</span>
                      <span className="text-purple-400">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Job Description</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('text')}
                  className={activeTab === 'text' 
                    ? 'bg-white text-black' 
                    : 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10'
                  }
                >
                  Text Input
                </Button>
                <Button
                  variant={activeTab === 'file' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('file')}
                  className={activeTab === 'file' 
                    ? 'bg-white text-black' 
                    : 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10'
                  }
                >
                  File Upload
                </Button>
                <Button
                  variant={activeTab === 'url' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('url')}
                  className={activeTab === 'url' 
                    ? 'bg-white text-black' 
                    : 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10'
                  }
                >
                  Extract URL
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'text' && (
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description..."
                  rows={16}
                  className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Match Button */}
        <Card className="bg-black/20 border-purple-500/20 mb-8">
          <CardContent className="p-6">
            <Button
              onClick={handleMatchToJob}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              {isAnalyzing ? "Analyzing Candidates..." : "Match to Job"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {bulkResults.length > 0 && (
          <BulkResumeResults
            results={bulkResults}
            onViewDetails={handleViewDetails}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
};

export default Recruit;
