import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/auth-provider";
import AddNoteForm from "./AddNoteForm";
import NoteItem from "./NoteItem";

export interface Note {
  id: string;
  title?: string;
  text: string;
  color: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { user } = useAuth();

  const fetchNotes = async () => {
    if (!user) return;

    const querySnapshot = await getDocs(
      collection(db, `users/${user?.uid}/notes`)
    );
    const notesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNotes(notesList as Note[]);
    setLoading(false);
  };

  const showToast = (type: "success" | "error", text: string) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-xl font-medium text-neutral-300">
          Please login to view notes
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 relative transition-all duration-500">
      {/* Toast Notification */}
      {message && (
        <div
          className={`fixed bottom-4 right-4 p-3 rounded-md shadow-lg z-50 ${
            message.type === "success"
              ? "bg-green-500 text-black"
              : "bg-red-500 text-black"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add Note Form */}
      <AddNoteForm onNoteAdded={fetchNotes} showToast={showToast} />

      {/* Notes Grid */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {notes.length === 0 && (
            <p className="text-2xl font-bold">No notes found</p>
          )}
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onNoteUpdated={fetchNotes}
              showToast={showToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
