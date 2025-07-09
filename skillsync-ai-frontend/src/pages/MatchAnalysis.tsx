
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Download,
  Target,
  FileText,
  User
} from "lucide-react";

const MatchAnalysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJD, setSelectedJD] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMatch = async () => {
    if (!selectedResume || !selectedJD) {
      toast({
        title: "Selection required",
        description: "Please select both a resume and job description.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate match generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    toast({
      title: "Match analysis complete!",
      description: "Detailed compatibility analysis has been generated.",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: `${format} Export`,
      description: `Match analysis will be downloaded as ${format}.`,
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
          <h1 className="text-3xl font-bold text-white mb-2">Match Analysis</h1>
          <p className="text-gray-400">Compare candidate resumes with job descriptions to get detailed matching analysis and fit scores.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Selection Panel */}
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 text-cyan-400 mr-2" />
                Select Items to Match
              </CardTitle>
              <CardDescription className="text-gray-400">
                Choose a resume and job description for comparison
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Select Resume</label>
                <Select value={selectedResume} onValueChange={setSelectedResume}>
                  <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                    <SelectValue placeholder="Choose a resume" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-purple-500/30">
                    <SelectItem value="resume1">John Doe - Software Engineer</SelectItem>
                    <SelectItem value="resume2">Jane Smith - Frontend Developer</SelectItem>
                    <SelectItem value="resume3">Mike Johnson - Full Stack Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Select Job Description</label>
                <Select value={selectedJD} onValueChange={setSelectedJD}>
                  <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                    <SelectValue placeholder="Choose a job description" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-purple-500/30">
                    <SelectItem value="jd1">Senior Frontend Developer - TechCorp</SelectItem>
                    <SelectItem value="jd2">Full Stack Developer - StartupXYZ</SelectItem>
                    <SelectItem value="jd3">React Developer - BigTech Inc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateMatch}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                <Target className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating Match..." : "Generate Match"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-12 h-12 text-cyan-400" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Match Analysis Yet</h3>
                  <p className="text-gray-400">
                    Select a resume and job description, then click "Generate Match" to see detailed compatibility analysis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MatchAnalysis;
