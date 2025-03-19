import Header from "./components/header";
import { AuthProvider } from "./context/auth-provider";
import DefaultLayout from "./default-layout";
import Notes from "./pages/Notes";

export default function App() {
  return (
    <AuthProvider>
      <DefaultLayout>
        <Header />
        <Notes />
      </DefaultLayout>
    </AuthProvider>
  );
}
