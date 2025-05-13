import {
  Box,
  CircularProgress,
  CssVarsProvider,
  Divider,
  extendTheme,
} from "@mui/joy";
import { useAuth } from "./context/auth-provider";
import Notes from "./pages/Notes/Notes";
import Header from "./components/header";
import Login from "./pages/Login";
import TaskManager from "./pages/Tasks/Tasks";

const theme = extendTheme({
  cssVarPrefix: "company",
});

export default function DefaultLayout() {
  const { loading, user } = useAuth();
  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: theme.vars.palette.background.body,
        }}
      >
        <CircularProgress size="md" />
      </Box>
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
          style={{
            maxWidth: "80rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {user && <Header />}
          <Divider />
          {user ? <Notes /> : <Login />}
          <TaskManager />
        </div>
      </Box>
    </CssVarsProvider>
  );
}
