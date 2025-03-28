import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Input,
  Avatar,
} from "@mui/joy";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../firebase-config";
import KeyIcon from "@mui/icons-material/Key";
import MailIcon from "@mui/icons-material/Mail";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Signup successfully !");
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        // Create a reference to the document with a custom ID (user.uid)
        const userRef = doc(db, "users", user.uid);

        // Set the user data in the document
        await setDoc(userRef, {
          id: user.uid,
          email: user.email,
          name: user.displayName,
          createdAt: new Date(), // Add any other fields as needed
        });
        toast.success("Login successfully!");
      }
    } catch (error) {
      // alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Create a reference to the document with a custom ID (user.uid)
      const userRef = doc(db, "users", user.uid);

      // Set the user data in the document
      await setDoc(userRef, {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        createdAt: new Date(), // Add any other fields as needed
      });
      toast.success("Google login successful");
    } catch (error) {
      // alert("Error with Google login: " + error.message);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography
        level="h2"
        sx={{
          position: "absolute",
          top: "1rem",
          left: { xs: "1rem", sm: "20%" },
          fontWeight: 500,
        }}
      >
        Note
      </Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography level="title-lg" component="h1" textAlign="center" mb={2}>
          {isSignup ? "Create Account" : "Welcome Back!"}
        </Typography>

        {/* Email Field */}
        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            startDecorator={<MailIcon />}
          />
        </FormControl>

        {/* Password Field */}
        <FormControl sx={{ mb: 3 }}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            startDecorator={<KeyIcon />}
          />
        </FormControl>

        {/* Submit Button */}
        <Button
          fullWidth
          onClick={handleLogin}
          variant="solid"
          color="primary"
          disabled={loading}
        >
          {loading ? "Loading..." : isSignup ? "Sign Up" : "Log In"}
        </Button>

        {/* Toggle between Login and Signup */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography level="body-md">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}
            <Button
              variant="plain"
              sx={{
                textDecoration: "underline",
                ":hover": { background: "transparent" },
              }}
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Log In" : "Sign Up"}
            </Button>
          </Typography>
        </Box>

        {/* Google Login Button */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            fullWidth
            color="neutral"
            onClick={handleGoogleLogin}
            sx={{ mb: 2 }}
            variant="soft"
            startDecorator={
              <Avatar
                src={"/google.svg"}
                alt="Google"
                style={{ width: "20px", height: "20px" }}
              />
            }
          >
            Sign In with Google
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
