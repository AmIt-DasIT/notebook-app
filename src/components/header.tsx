import Auth from "../pages/Auth";

export default function Header() {
  return (
    <header className="flex justify-between  px-6 py-4">
      <div className="text-2xl font-bold text-neutral-200">Notebook App</div>
      <Auth />
    </header>
  );
}
