import { useAuth } from "./context/auth-provider";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return children;
}
