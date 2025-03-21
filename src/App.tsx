import { CssVarsProvider, Divider, extendTheme, ThemeProvider } from "@mui/joy";
import Header from "./components/header";
import { AuthProvider } from "./context/auth-provider";
import DefaultLayout from "./default-layout";
import Notes from "./pages/Notes";

export default function App() {
  const theme = extendTheme({
    components: {
      JoyTypography: {
        styleOverrides: {
          root: {
            fontFamily: "Poppins",
          },
        },
      },
    },
  });
  
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <DefaultLayout>
          <CssVarsProvider />
          <Header />
          <Divider />
          <Notes />
        </DefaultLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}
