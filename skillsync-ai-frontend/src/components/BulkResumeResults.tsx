
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Download, User, Trophy, Star, Target } from "lucide-react";

interface ResumeResult {
  id: string;
  fileName: string;
  candidateName: string;
  jobFitScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  experienceMatch: string;
  salaryExpectation?: string;
  location?: string;
  yearsOfExperience?: number;
}

interface BulkResumeResultsProps {
  results: ResumeResult[];
  onViewDetails: (resumeId: string) => void;
  onDownload: (resumeId: string) => void;
}

const BulkResumeResults = ({ results, onViewDetails, onDownload }: BulkResumeResultsProps) => {
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

  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-purple-500/20">
        <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Results Yet</h3>
        <p className="text-gray-500">Upload resumes and job description to see candidate rankings</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Candidate Rankings</h3>
          <p className="text-gray-400 text-sm">{results.length} candidates analyzed</p>
        </div>
        <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
          <Trophy className="w-4 h-4 mr-1" />
          Sorted by fit score
        </Badge>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card key={result.id} className={`bg-slate-800/50 border-purple-500/20 transition-all hover:border-purple-500/40 ${getScoreBgColor(result.jobFitScore)}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-6">
                {/* Left Section - Candidate Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-full">
                      <span className="text-purple-400 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{result.candidateName}</h4>
                      <p className="text-gray-400 text-sm">{result.fileName}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-300 text-sm mb-2">Matching Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {result.matchingSkills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {result.matchingSkills.length > 3 && (
                          <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 text-xs">
                            +{result.matchingSkills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-300 text-sm mb-2">Missing Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {result.missingSkills.slice(0, 2).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-red-500/20 text-red-400 text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {result.missingSkills.length > 2 && (
                          <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 text-xs">
                            +{result.missingSkills.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Experience</p>
                      <p className="text-white">{result.experienceMatch}</p>
                    </div>
                    {result.yearsOfExperience && (
                      <div>
                        <p className="text-gray-400">Years</p>
                        <p className="text-white">{result.yearsOfExperience} years</p>
                      </div>
                    )}
                    {result.location && (
                      <div>
                        <p className="text-gray-400">Location</p>
                        <p className="text-white">{result.location}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Section - Score & Actions */}
                <div className="flex flex-col items-center gap-4 min-w-[140px]">
                  {/* Circular Progress */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-gray-700 flex items-center justify-center relative">
                      <div
                        className={`absolute inset-0 rounded-full border-4 border-transparent ${getScoreColor(result.jobFitScore).replace('text-', 'border-')}`}
                        style={{
                          background: `conic-gradient(currentColor ${result.jobFitScore * 3.6}deg, transparent 0deg)`,
                          clipPath: 'circle(50%)',
                        }}
                      />
                      <div className="relative z-10 text-center">
                        <div className={`text-xl font-bold ${getScoreColor(result.jobFitScore)}`}>
                          {result.jobFitScore}%
                        </div>
                        <div className="text-xs text-gray-400">Fit Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(result.id)}
                      className="bg-black/20 border-purple-500/30 text-purple-400 hover:text-white hover:border-purple-500"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownload(result.id)}
                      className="bg-black/20 border-purple-500/30 text-purple-400 hover:text-white hover:border-purple-500"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BulkResumeResults;
