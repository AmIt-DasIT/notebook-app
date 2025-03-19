import { useAuth } from "../context/auth-provider";

export default function Auth() {
  const { login, logout, user } = useAuth();

  return (
    <>
      {user ? (
        <div className="flex items-center gap-4">
          <img
            src={user.photoURL!}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col text-sm">
            <span className="font-semibold">{user.displayName}</span>
            <span className="text-gray-500">{user.email}</span>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 flex rounded-md shadow-md hover:bg-blue-600"
        >
          <img src={"/google.svg"} alt="Google" className="w-6 h-6 mr-2" />
          Sign in with Google
        </button>
      )}
    </>
  );
}
