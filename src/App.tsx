import { extendTheme, ThemeProvider } from "@mui/joy";
import { AuthProvider } from "./context/auth-provider";
import DefaultLayout from "./default-layout";

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
        <DefaultLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}
