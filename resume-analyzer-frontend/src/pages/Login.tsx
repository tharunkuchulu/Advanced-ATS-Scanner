import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        email,
        password,
      });

      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10, color: "#fff" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="info" fullWidth>
          Sign In
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
