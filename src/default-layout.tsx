import { Box, CircularProgress, CssVarsProvider, Divider } from "@mui/joy";
import { useAuth } from "./context/auth-provider";
import Notes from "./pages/Notes";
import Header from "./components/header";
import Login from "./pages/Login";

export default function DefaultLayout() {
  const { loading, user } = useAuth();
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size="md" />
      </div>
    );
  return (
    <Box sx={{ maxWidth: "80rem", mx: "auto" }}>
      <CssVarsProvider />
      {user && <Header />}
      <Divider />
      {user ? <Notes /> : <Login />}
    </Box>
  );
}
