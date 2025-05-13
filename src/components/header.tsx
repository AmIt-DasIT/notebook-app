import { Box, Typography } from "@mui/joy";
import Auth from "../pages/Auth";

export default function Header() {
  return (
    <Box
      component={"header"}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 1.5,
      }}
    >
      <Typography level="h2">Notes</Typography>
      <Auth />
    </Box>
  );
}
