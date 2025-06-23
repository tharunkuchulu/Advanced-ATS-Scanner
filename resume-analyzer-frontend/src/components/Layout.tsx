import React from "react";
import { Box, Container, AppBar, Toolbar, Typography } from "@mui/material";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff" }}>
      <AppBar position="static" sx={{ backgroundColor: "#1f1f1f" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            AI Resume Analyzer
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>{children}</Container>
    </Box>
  );
};

export default Layout;
