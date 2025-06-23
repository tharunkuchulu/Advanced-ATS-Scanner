import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Resume Analyzer
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/upload">
          Upload Resume
        </Button>
        <Button color="inherit" component={Link} to="/logout">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
