
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Download,
  BarChart3
} from "lucide-react";

const JDvsResume = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedResume(file);
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
            title: "Resume uploaded successfully!",
            description: "Resume is ready for comparison.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleAnalyzeMatch = async () => {
    if (!jobDescription || !uploadedResume) {
      toast({
        title: "Missing information",
        description: "Please provide both job description and resume.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsAnalyzing(false);
    toast({
      title: "Analysis complete!",
      description: "Job description vs resume comparison has been generated.",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: `${format} Export`,
      description: `Analysis results will be downloaded as ${format}.`,
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
          <h1 className="text-3xl font-bold text-white mb-2">JD vs Resume</h1>
          <p className="text-gray-400">Direct comparison between job description and resume with instant analysis</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Job Description Input */}
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here..."
                rows={16}
                className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
              />
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Resume Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6 p-8 border-2 border-dashed border-purple-500/30 rounded-lg h-80 flex flex-col justify-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-purple-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Drop resume here or click to browse
                  </h3>
                  <p className="text-gray-400">PDF, DOC, DOCX files up to 10MB</p>
                </div>

                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
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

                {uploadedResume && (
                  <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                    <p className="text-white font-medium">{uploadedResume.name}</p>
                    <p className="text-gray-400 text-sm">{(uploadedResume.size / 1024 / 1024).toFixed(2)} MB</p>
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
        </div>

        {/* Analyze Button */}
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-6">
            <Button
              onClick={handleAnalyzeMatch}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-4 text-lg"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              {isAnalyzing ? "Analyzing Match..." : "Analyze Match"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JDvsResume;
