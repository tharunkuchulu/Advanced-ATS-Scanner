import React from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

const Register = () => {
  return (
    <Container maxWidth="xs" sx={{ mt: 10, color: "#fff" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Email" type="email" fullWidth required />
        <TextField label="Password" type="password" fullWidth required />
        <Button variant="contained" color="secondary" fullWidth>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
