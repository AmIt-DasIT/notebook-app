import {
  Box,
  CircularProgress,
  CssVarsProvider,
  Divider,
  extendTheme,
} from "@mui/joy";
import { useAuth } from "./context/auth-provider";
import Notes from "./pages/Notes";
import Header from "./components/header";
import Login from "./pages/Login";
const theme = extendTheme({
  cssVarPrefix: "company",
});

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
    <CssVarsProvider
      theme={theme}
      modeStorageKey="demo_identify-system-mode"
      disableNestedContext
    >
      <Box
        sx={{
          background: theme.vars.palette.background.body,
          height: "100vh",
        }}
      >
        <div
          style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto" }}
        >
          {user && <Header />}
          <Divider />
          {user ? <Notes /> : <Login />}
        </div>
      </Box>
    </CssVarsProvider>
  );
}
