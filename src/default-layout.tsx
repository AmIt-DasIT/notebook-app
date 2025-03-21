import { Box, CircularProgress } from "@mui/joy";
import { useAuth } from "./context/auth-provider";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();
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
  return <Box sx={{ maxWidth: "80rem", mx: "auto" }}>{children}</Box>;
}
