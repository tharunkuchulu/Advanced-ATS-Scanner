import { Paper, Typography, Chip, Box, Divider } from "@mui/material";

export default function ResumeAnalysisResult({ data }: { data: any }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Skills:</Typography>
      <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {data.skills.map((skill: string, idx: number) => (
          <Chip label={skill} key={idx} color="primary" />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Summary:</Typography>
      <Typography>{data.summary}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Suggestions:</Typography>
      <ul>
        {data.suggestions.map((s: string, i: number) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Job Fit Score:</Typography>
      <Typography variant="body1">{data.job_fit_score} / 100</Typography>
    </Paper>
  );
}
