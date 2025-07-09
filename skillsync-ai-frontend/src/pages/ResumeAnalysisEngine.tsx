
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Download,
  Star,
  Award,
  Target,
  CheckCircle,
  AlertCircle,
  Brain,
  TrendingUp
} from "lucide-react";

const ResumeAnalysisEngine = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "File uploaded successfully!",
            description: "Resume is ready for analysis.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleAnalysis = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a resume first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResult = {
      fileName: uploadedFile.name,
      atsScore: 87,
      candidateName: "John Doe",
      skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
      highlightedSkills: ["JavaScript", "React", "TypeScript", "MongoDB"],
      strengths: [
        "Strong expertise in modern JavaScript frameworks",
        "Full-stack development experience",
        "Good understanding of software architecture",
        "Experience with version control systems"
      ],
      suggestions: [
        "Consider gaining AWS certification",
        "Add mobile development experience",
        "Learn Docker and Kubernetes",
        "Explore GraphQL as alternative to REST"
      ],
      suggestedRoles: [
        "Senior Frontend Developer",
        "Full Stack Developer",
        "React Developer",
        "JavaScript Engineer"
      ]
    };

    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis complete!",
      description: "Resume has been analyzed successfully.",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: `${format} Export`,
      description: `Analysis report will be downloaded as ${format}.`,
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
          <h1 className="text-3xl font-bold text-white mb-2">Resume Analysis Engine</h1>
          <p className="text-gray-400">Upload and analyze candidate resumes with AI-powered insights</p>
        </div>

        {/* Upload Section */}
        <Card className="bg-black/20 border-purple-500/20 mb-8">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-purple-400" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Drop your resume here or click to browse
                </h3>
                <p className="text-gray-400">Supports PDF, DOC, DOCX files up to 10MB</p>
              </div>

              <div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                </label>
              </div>

              {uploadedFile && (
                <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                  <p className="text-white font-medium">{uploadedFile.name}</p>
                  <p className="text-gray-400 text-sm">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  
                  <Button
                    onClick={handleAnalysis}
                    disabled={isAnalyzing}
                    className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                  </Button>
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

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* ATS Score */}
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Analysis Results</CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive resume analysis for {analysisResult.candidateName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-green-500"
                        style={{
                          background: `conic-gradient(#10b981 ${analysisResult.atsScore * 3.6}deg, transparent 0deg)`,
                          clipPath: 'circle(50%)',
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{analysisResult.atsScore}%</div>
                          <div className="text-xs text-gray-400">ATS Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Analysis */}
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  Skills Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-3">Highlighted Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.highlightedSkills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-400">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-3">All Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-purple-500/30 text-gray-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Suggestions */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 text-purple-400 mr-2" />
                    Suggestions to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Target className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Suggested Job Roles */}
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-5 h-5 text-cyan-400 mr-2" />
                  Suggested Job Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {analysisResult.suggestedRoles.map((role: string, index: number) => (
                    <div key={index} className="p-3 bg-black/20 rounded-lg border border-cyan-500/20">
                      <span className="text-cyan-400 font-medium">{role}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysisEngine;
