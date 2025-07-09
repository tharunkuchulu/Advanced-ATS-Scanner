
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Eye,
  Trash2
} from "lucide-react";

const ResumeHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [fitScore, setFitScore] = useState("all");

  // Mock data - replace with actual API data
  const resumes = [
    {
      id: 1,
      fileName: "john_doe_resume.pdf",
      uploadDate: "Jun 20, 2024, 04:00 PM",
      fitScore: 92,
      version: "v1"
    },
    {
      id: 2,
      fileName: "jane_smith_resume.pdf",
      uploadDate: "Jun 19, 2024, 07:45 PM",
      fitScore: 78,
      version: "v2"
    },
    {
      id: 3,
      fileName: "mike_johnson_resume.pdf",
      uploadDate: "Jun 18, 2024, 03:15 PM",
      fitScore: 85,
      version: "v1"
    },
    {
      id: 4,
      fileName: "sarah_wilson_resume.pdf",
      uploadDate: "Jun 17, 2024, 09:50 PM",
      fitScore: 67,
      version: "v3"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-400/20 border-green-400/30";
    if (score >= 60) return "bg-yellow-400/20 border-yellow-400/30";
    return "bg-red-400/20 border-red-400/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Resume History</h1>
          <p className="text-gray-400">View and manage all analyzed resumes with filtering and version control.</p>
        </div>

        {/* Filters */}
        <Card className="bg-black/20 border-purple-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-gray-300">Search by filename</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search resumes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-500 pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Fit Score</Label>
                <Select value={fitScore} onValueChange={setFitScore}>
                  <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scores</SelectItem>
                    <SelectItem value="high">80% and above</SelectItem>
                    <SelectItem value="medium">60% - 79%</SelectItem>
                    <SelectItem value="low">Below 60%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume List */}
        <div className="space-y-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="bg-black/20 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <FileText className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{resume.fileName}</h3>
                      <p className="text-gray-400 text-sm flex items-center space-x-4">
                        <span>{resume.uploadDate}</span>
                        <span className="bg-purple-500/20 px-2 py-1 rounded text-purple-400 text-xs">
                          {resume.version}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`px-4 py-2 rounded-lg border ${getScoreBgColor(resume.fitScore)}`}>
                      <span className={`font-bold text-lg ${getScoreColor(resume.fitScore)}`}>
                        {resume.fitScore}%
                      </span>
                      <p className="text-gray-400 text-xs">Match</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeHistory;
