import { Avatar, Box, Button, Typography } from "@mui/joy";
import { useAuth } from "../context/auth-provider";

export default function Auth() {
  const { login, logout, user } = useAuth();

  return (
    <>
      {user ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Avatar src={user.photoURL!} alt={user.displayName!} />
          <Box>
            <Typography level="title-lg">{user.displayName}</Typography>
            <Typography level="body-sm">{user.email}</Typography>
          </Box>
          <Button onClick={logout}>Logout</Button>
        </Box>
      ) : (
        <Button
          variant="soft"
          onClick={login}
          startDecorator={
            <Avatar
              src={"/google.svg"}
              alt="Google"
              style={{ width: "20px", height: "20px" }}
            />
          }
        >
          Sign in with Google
        </Button>
      )}
    </>
  );
}
