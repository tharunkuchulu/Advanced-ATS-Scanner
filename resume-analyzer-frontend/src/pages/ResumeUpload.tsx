import {
  Box,
  Button,
  Paper,
  Typography,
  LinearProgress,
  Divider
} from "@mui/material";
import { useState } from "react";
import api from "../utils/api";
import AlertMessage from "../components/AlertMessage";
import ResumeAnalysisResult from "../components/ResumeAnalysisResult";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  const handleUpload = async () => {
    if (!file) {
      setAlert({ open: true, message: "Please select a PDF resume.", severity: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const uploadRes = await api.post("/upload_resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const resumeId = uploadRes.data.resume_id;

      const analyzeRes = await api.post("/analyze_resume/", {
        text: uploadRes.data.text,
        filename: file.name
      });

      setAnalysis(analyzeRes.data.analysis);
      setAlert({ open: true, message: "Analysis completed successfully.", severity: "success" });
    } catch (err: any) {
      console.error(err);
      setAlert({ open: true, message: "Failed to analyze resume.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Upload Your Resume</Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpload}>
          Analyze Resume
        </Button>

        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </Paper>

      {analysis && (
        <>
          <Divider sx={{ my: 4 }} />
          <ResumeAnalysisResult data={analysis} />
        </>
      )}

      <AlertMessage open={alert.open} message={alert.message} severity={alert.severity as any} onClose={() => setAlert({ ...alert, open: false })} />
    </Box>
  );
}
