import React from "react";
import { Box, Button, Typography, Container, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "AI-Powered Resume Parsing",
    desc: "Extracts and analyzes resumes using advanced NLP to understand skills, experience, and education.",
  },
  {
    title: "Job Fit Score & Skill Sync",
    desc: "Matches resumes with job descriptions using semantic understanding and scoring logic.",
  },
  {
    title: "Smart Recruiter Dashboard",
    desc: "View parsed resumes, filter by scores, skill tags, or history with complete analysis reports.",
  },
  {
    title: "Upload JD (Text or URL)",
    desc: "Upload job descriptions directly or auto-fetch from LinkedIn & Google Jobs.",
  },
  {
    title: "Versioning & History",
    desc: "Automatically version resumes, track history, and download matched reports.",
  },
  {
    title: "Export as PDF/CSV",
    desc: "Download resume analytics, job fit score reports, or CSV summaries instantly.",
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: "#0B0F19", color: "#fff", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          SkillSync AI
        </Typography>
        <Typography variant="h6" color="gray" gutterBottom>
          Where AI meets smart hiring — Analyze, Match, and Hire better with ease.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2, backgroundColor: "#00BCD4", color: "#000" }}
            onClick={() => navigate("/register")}
          >
            Get Started
          </Button>
          <Button variant="outlined" sx={{ color: "#00BCD4", borderColor: "#00BCD4" }} onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            🔍 Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper elevation={4} sx={{ p: 3, backgroundColor: "#1A1F2B", color: "#fff" }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {feature.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 10, textAlign: "center", color: "gray" }}>
          <Typography variant="caption">
            &copy; {new Date().getFullYear()} SkillSync AI. Empowering Recruiters with Intelligence.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
