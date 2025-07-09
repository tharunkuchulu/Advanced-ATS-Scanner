
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Link as LinkIcon, 
  Download,
  Globe,
  Search
} from "lucide-react";

const JDExtractor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobUrl, setJobUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtract = async (platform: string) => {
    if (!jobUrl) {
      toast({
        title: "URL required",
        description: "Please enter a job posting URL.",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);
    
    // Simulate extraction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsExtracting(false);
    toast({
      title: `Extraction from ${platform} complete!`,
      description: "Job description has been extracted and saved.",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: `${format} Export`,
      description: `Extracted job descriptions will be downloaded as ${format}.`,
    });
  };

  const steps = [
    "Navigate to a LinkedIn or Indeed job posting",
    "Copy the job posting URL from your browser's address bar",
    "Paste the URL into the input field above",
    "Click 'Extract Job Description' to automatically extract the content",
    "Review the extracted content and save it to your collection"
  ];

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
          <h1 className="text-3xl font-bold text-white mb-2">JD Extractor</h1>
          <p className="text-gray-400">Extract job descriptions directly from LinkedIn or Indeed job posting URLs.</p>
        </div>

        {/* URL Extractor */}
        <Card className="bg-black/20 border-purple-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <LinkIcon className="w-5 h-5 text-cyan-400 mr-2" />
              Job URL Extractor
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter a LinkedIn or Indeed job posting URL to extract the job description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Job Posting URL</label>
              <Input
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://www.linkedin.com/jobs/view/1234567890 or https://www.indeed.com/viewjob?jk=..."
                className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleExtract('LinkedIn')}
                disabled={isExtracting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                {isExtracting ? "Extracting..." : "Extract from LinkedIn"}
              </Button>
              
              <Button
                onClick={() => handleExtract('Indeed')}
                disabled={isExtracting}
                className="bg-slate-600 hover:bg-slate-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                {isExtracting ? "Extracting..." : "Extract from Indeed"}
              </Button>
              
              <Button
                onClick={() => handleExtract('Google Jobs')}
                disabled={isExtracting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Globe className="w-4 h-4 mr-2" />
                {isExtracting ? "Extracting..." : "Extract from Google Jobs"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How to Use */}
        <Card className="bg-black/20 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white text-cyan-400">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JDExtractor;
