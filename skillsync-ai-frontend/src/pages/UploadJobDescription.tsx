
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Download,
  Plus,
  History
} from "lucide-react";

const UploadJobDescription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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
            description: "Job description is ready for processing.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSave = () => {
    if (activeTab === 'text' && (!jobTitle || !jobDescription)) {
      toast({
        title: "Missing information",
        description: "Please fill in job title and description.",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === 'file' && !uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a job description file.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Job description saved!",
      description: "Job description has been saved successfully.",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: `${format} Export`,
      description: `Job description will be downloaded as ${format}.`,
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
                onClick={() => {}}
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <History className="w-4 h-4 mr-2" />
                Show History
              </Button>
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
          <h1 className="text-3xl font-bold text-white mb-2">Upload Job Description</h1>
          <p className="text-gray-400">Add job descriptions for matching analysis. Upload as text or file format.</p>
        </div>

        {/* Upload Method Selection */}
        <Card className="bg-black/20 border-purple-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Upload Method</CardTitle>
            <CardDescription className="text-gray-400">
              Choose how you'd like to upload the job description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-6">
              <Button
                variant={activeTab === 'text' ? 'default' : 'outline'}
                onClick={() => setActiveTab('text')}
                className={activeTab === 'text' 
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                  : 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10'
                }
              >
                <FileText className="w-4 h-4 mr-2" />
                Text Input
              </Button>
              <Button
                variant={activeTab === 'file' ? 'default' : 'outline'}
                onClick={() => setActiveTab('file')}
                className={activeTab === 'file' 
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                  : 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10'
                }
              >
                <Upload className="w-4 h-4 mr-2" />
                File Upload
              </Button>
            </div>

            {activeTab === 'file' && (
              <div className="text-center space-y-6 p-8 border-2 border-dashed border-purple-500/30 rounded-lg">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-purple-400" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Drop your job description file here or click to browse
                  </h3>
                  <p className="text-gray-400">Supports PDF, DOC, DOCX, TXT files up to 10MB</p>
                </div>

                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="jd-upload"
                  />
                  <label htmlFor="jd-upload">
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
            )}
          </CardContent>
        </Card>

        {/* Text Input Form */}
        {activeTab === 'text' && (
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 text-cyan-400 mr-2" />
                Enter Job Description
              </CardTitle>
              <CardDescription className="text-gray-400">
                Fill in the job details and description manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Job Title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                    className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Company</label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., TechCorp Inc."
                    className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Job Description <span className="text-red-400">*</span>
                </label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here including requirements, responsibilities, and qualifications..."
                  rows={12}
                  className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
                />
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Save Job Description
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UploadJobDescription;
