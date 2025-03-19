import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useAuth } from "../context/auth-provider";

interface AddNoteFormProps {
  onNoteAdded: () => void;
  showToast: (type: "success" | "error", text: string) => void;
}

const COLORS = ["#FEF08A", "#BBF7D0", "#BFDBFE", "#FECACA", "#E9D5FF"];

export default function AddNoteForm({ onNoteAdded, showToast }: AddNoteFormProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      showToast("error", "Please write something before adding a note.");
      return;
    }

    setIsAdding(true);
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    try {
      await addDoc(collection(db, `users/${user?.uid}/notes`), {
        title: newTitle || "Untitled",
        text: newNote,
        color: randomColor,
      });

      showToast("success", "Note added successfully!");
      setNewTitle("");
      setNewNote("");
      onNoteAdded();
    } catch (error) {
      console.error("Error adding note:", error);
      showToast("error", "Failed to add note. Try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="border border-neutral-700 shadow-md rounded-md p-4 mb-6 max-w-xl mx-auto">
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Title"
        className="w-full text-lg font-bold border-b border-gray-300 focus:outline-none"
      />
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Take a note..."
        className="w-full mt-2 resize-none focus:outline-none"
      />
      <button
        onClick={handleAddNote}
        disabled={isAdding}
        className={`mt-2 bg-blue-500 text-white !px-4 !py-2 rounded-md w-full ${
          isAdding ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {isAdding ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Adding...
          </div>
        ) : (
          "Add Note"
        )}
      </button>
    </div>
  );
}
