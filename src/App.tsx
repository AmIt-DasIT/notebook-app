import { extendTheme, ThemeProvider } from "@mui/joy";
import { AuthProvider } from "./context/auth-provider";
import DefaultLayout from "./default-layout";
import { Toaster } from "react-hot-toast";

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
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            success: {
              style: {
                background: "#F0FDFA",
                color: "black",
                fontWeight: 600,
              },
            },
            error: {
              style: {
                background: "#FFE4E6",
                color: "black",
                fontWeight: 600,
              },
            },
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}
