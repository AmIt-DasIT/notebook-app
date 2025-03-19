// NoteItem.tsx
import { useState } from "react";
import { db } from "../../firebase-config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { Note } from "./Notes";
import { useAuth } from "../context/auth-provider";

interface NoteItemProps {
  note: Note;
  onNoteUpdated: () => void;
  showToast: (type: "success" | "error", text: string) => void;
}

export default function NoteItem({
  note,
  onNoteUpdated,
  showToast,
}: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title || "");
  const [editedText, setEditedText] = useState(note.text);
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, `users/${user?.uid}/notes`, note.id));
      showToast("success", "Note deleted successfully!");
      onNoteUpdated();
    } catch (error) {
      console.error("Error deleting note:", error);
      showToast("error", "Failed to delete note. Try again.");
    }
  };

  const handleEdit = async () => {
    try {
      await updateDoc(doc(db, `users/${user?.uid}/notes`, note.id), {
        title: editedTitle,
        text: editedText,
      });
      showToast("success", "Note updated successfully!");
      setIsEditing(false);
      onNoteUpdated();
    } catch (error) {
      console.error("Error updating note:", error);
      showToast("error", "Failed to update note. Try again.");
    }
  };

  return (
    <>
      {isEditing ? (
        <div
          className={`${
            isEditing ? "opacity-100" : "opacity-0"
          } absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-800 border border-neutral-700 rounded-md p-3 w-[500px] min-h-[300px]`}
        >
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full text-lg font-bold border-b border-gray-300 focus:outline-none"
          />
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={10}
            className="w-full mt-2 resize-none focus:outline-none"
          />
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white !px-4 !py-2 mt-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="ml-2 bg-gray-300 !px-4 !py-2 mt-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div
          className="relative p-4 rounded-md shadow-md"
          style={{ background: note.color }}
        >
          <h3 className="font-bold text-lg text-gray-700">{note.title}</h3>
          <p className="text-gray-700 mt-1">{note.text}</p>
          <div
            onClick={() => setIsEditing(true)}
            className="absolute top-2 right-8 text-blue-500 hover:text-blue-600 cursor-pointer"
          >
            <img src="/edit.svg" alt="Edit" className="w-6 h-6" />
          </div>
          <div
            onClick={handleDelete}
            className="absolute top-2 right-2 text-red-500 hover:text-red-600 cursor-pointer"
          >
            <img src="/delete.svg" alt="Delete" className="w-6 h-6" />
          </div>
        </div>
      )}
    </>
  );
}
