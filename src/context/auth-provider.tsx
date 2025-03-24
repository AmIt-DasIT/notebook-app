import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, db, googleProvider } from "../../firebase-config";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  allUsers: { id: string; email: string; name: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<
    { id: string; email: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setLoading(false);
      const allUsers = await getDocs(collection(db, "users"));
      setAllUsers(
        allUsers.docs.map((doc) => doc.data()) as {
          id: string;
          email: string;
          name: string;
        }[]
      );
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
