
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Star, 
  TrendingUp, 
  Download, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Award,
  Briefcase,
  Brain,
  Zap
} from "lucide-react";

const Analyze = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const file = location.state?.file;

  useEffect(() => {
    if (!file) {
      navigate('/dashboard');
      return;
    }

    // Simulate AI analysis with progress
    const analyzeResume = async () => {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      
      // Simulate progressive analysis
      const steps = [
        { progress: 20, message: "Extracting text from resume..." },
        { progress: 40, message: "Analyzing skills and experience..." },
        { progress: 60, message: "Calculating ATS compatibility..." },
        { progress: 80, message: "Generating insights and suggestions..." },
        { progress: 100, message: "Analysis complete!" }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setAnalysisProgress(step.progress);
      }
      
      // Mock comprehensive analysis data
      const mockData = {
        fileName: file.name,
        uploadedAt: new Date().toLocaleString(),
        candidateName: "John Doe",
        
        // Scores
        atsScore: 87,
        jobFitScore: 92,
        skillsScore: 85,
        experienceScore: 78,
        
        // Skills Analysis
        skills: [
          { name: "JavaScript", level: "Expert", match: true, years: 5 },
          { name: "React", level: "Expert", match: true, years: 4 },
          { name: "Node.js", level: "Advanced", match: true, years: 3 },
          { name: "Python", level: "Intermediate", match: false, years: 2 },
          { name: "TypeScript", level: "Advanced", match: true, years: 3 },
          { name: "AWS", level: "Beginner", match: false, years: 1 },
        ],
        
        highlightSkills: ["JavaScript", "React", "Node.js", "TypeScript", "MongoDB"],
        
        // Analysis Details
        summary: "Experienced software developer with strong frontend skills and full-stack capabilities. Demonstrates expertise in modern web technologies and has a solid foundation in software engineering principles.",
        
        strengths: [
          "Strong expertise in modern JavaScript frameworks",
          "Full-stack development experience with MERN stack",
          "Good understanding of software architecture patterns",
          "Experience with version control and collaborative development",
          "Problem-solving and debugging skills"
        ],
        
        weaknesses: [
          "Limited cloud platform experience (AWS/Azure)",
          "Minimal mobile development experience",
          "Could improve database optimization skills",
          "Lacks experience with microservices architecture"
        ],
        
        suggestions: [
          "Consider gaining AWS certification to strengthen cloud skills",
          "Add experience with React Native for mobile development",
          "Learn Docker and Kubernetes for containerization",
          "Explore GraphQL as an alternative to REST APIs",
          "Consider learning a second programming language like Go or Rust"
        ],
        
        suggestedRoles: [
          "Senior Frontend Developer",
          "Full Stack Developer",
          "React Developer", 
          "JavaScript Engineer",
          "Web Application Developer"
        ],
        
        // Basic Info
        experience: "5+ years",
        education: "Bachelor's in Computer Science",
        location: "San Francisco, CA",
        expectedSalary: "$95,000 - $125,000",
        certifications: ["AWS Cloud Practitioner", "Google Analytics Certified"]
      };
      
      setAnalysisData(mockData);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete!",
        description: `${file.name} has been analyzed successfully.`,
      });
    };

    analyzeResume();
  }, [file, navigate, toast]);

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setTimeout(() => {
      setAnalysisProgress(100);
      setIsAnalyzing(false);
      toast({
        title: "Reanalysis complete!",
        description: "Resume has been reanalyzed with updated insights.",
      });
    }, 2000);
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "Analysis report will be downloaded shortly.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20 border-green-500/30";
    if (score >= 60) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  if (!file) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-purple-400 hover:text-purple-300 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-white">SkillSync AI</span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="text-white font-medium">Resume Analysis</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReanalyze}
                disabled={isAnalyzing}
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                Reanalyze
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAnalyzing ? (
          // Loading State with Futuristic Animation
          <div className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto relative">
                      <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-pulse"></div>
                      <div className="absolute inset-2 border-4 border-cyan-500/50 rounded-full animate-spin"></div>
                      <div className="absolute inset-4 border-4 border-blue-500/70 rounded-full animate-ping"></div>
                      <div className="absolute inset-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">AI Analysis in Progress</h2>
                    <p className="text-gray-400">Our advanced AI is analyzing {file.name}...</p>
                  </div>
                  
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-purple-400">{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                      <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Skills Extraction</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                      <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">ATS Scoring</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                      <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Experience Analysis</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                      <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">AI Insights</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Analysis Results
          <div className="space-y-6">
            {/* Header Card */}
            <Card className={`bg-black/20 border-purple-500/20 ${getScoreBgColor(analysisData?.atsScore)}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-6 h-6 text-purple-400" />
                      <div>
                        <h1 className="text-2xl font-bold text-white">{analysisData?.candidateName}</h1>
                        <p className="text-gray-400">{analysisData?.fileName}</p>
                        <p className="text-gray-500 text-sm">Analyzed on {analysisData?.uploadedAt}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{analysisData?.summary}</p>
                  </div>

                  <div className="text-center min-w-[140px]">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full border-4 border-gray-700 flex items-center justify-center relative mx-auto">
                        <div
                          className={`absolute inset-0 rounded-full border-4 border-transparent ${getScoreColor(analysisData?.atsScore).replace('text-', 'border-')}`}
                          style={{
                            background: `conic-gradient(currentColor ${analysisData?.atsScore * 3.6}deg, transparent 0deg)`,
                            clipPath: 'circle(50%)',
                          }}
                        />
                        <div className="relative z-10 text-center">
                          <div className={`text-xl font-bold ${getScoreColor(analysisData?.atsScore)}`}>
                            {analysisData?.atsScore}%
                          </div>
                          <div className="text-xs text-gray-400">ATS Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-black/20 border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className={`text-2xl font-bold ${getScoreColor(analysisData?.jobFitScore)}`}>
                    {analysisData?.jobFitScore}%
                  </div>
                  <p className="text-gray-400 text-sm">Job Fit Score</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <div className={`text-2xl font-bold ${getScoreColor(analysisData?.skillsScore)}`}>
                    {analysisData?.skillsScore}%
                  </div>
                  <p className="text-gray-400 text-sm">Skills Match</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <Briefcase className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <div className={`text-2xl font-bold ${getScoreColor(analysisData?.experienceScore)}`}>
                    {analysisData?.experienceScore}%
                  </div>
                  <p className="text-gray-400 text-sm">Experience Match</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-purple-400">{analysisData?.experience}</div>
                  <p className="text-gray-400 text-sm">Experience</p>
                </CardContent>
              </Card>
            </div>

            {/* Skills Analysis */}
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Highlighted Skills</CardTitle>
                <CardDescription className="text-gray-400">
                  Key technical skills identified in the resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  {analysisData?.skills.map((skill: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-purple-500/10">
                      <div className="flex items-center space-x-2">
                        {skill.match ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                        )}
                        <span className="text-white font-medium">{skill.name}</span>
                      </div>
                      <div className="text-right">
                        <Badge variant={skill.match ? "default" : "secondary"} className="text-xs mb-1">
                          {skill.level}
                        </Badge>
                        <div className="text-xs text-gray-400">{skill.years}y exp</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Top Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData?.highlightSkills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-400">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Details */}
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
                    {analysisData?.strengths.map((strength: string, index: number) => (
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
                    <AlertCircle className="w-5 h-5 text-orange-400 mr-2" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisData?.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Suggestions and Roles */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 text-purple-400 mr-2" />
                    Suggestions to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisData?.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Target className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Briefcase className="w-5 h-5 text-cyan-400 mr-2" />
                    Suggested Job Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisData?.suggestedRoles.map((role: string, index: number) => (
                      <div key={index} className="p-3 bg-black/20 rounded-lg border border-cyan-500/20">
                        <span className="text-cyan-400 font-medium">{role}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-black/20 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <User className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-medium">{analysisData?.education}</p>
                  <p className="text-gray-400 text-sm">Education</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-medium">{analysisData?.location}</p>
                  <p className="text-gray-400 text-sm">Location</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white font-medium">{analysisData?.expectedSalary}</p>
                  <p className="text-gray-400 text-sm">Expected Salary</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-medium">{analysisData?.certifications.length}</p>
                  <p className="text-gray-400 text-sm">Certifications</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
