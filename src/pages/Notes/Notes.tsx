import { useEffect, useState } from "react";
import { db } from "../../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../context/auth-provider";
import NoteForm from "./NoteForm";
import NoteItem from "./NoteItem";
import { Box, CircularProgress, Stack, Typography } from "@mui/joy";

export interface Note {
  id: string;
  title?: string;
  text: string;
  color: string;
  sharedWith?: string[];
  shared?: boolean;
  userId: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotes = async () => {
    if (!user) return;

    const querySnapshot = await getDocs(
      query(collection(db, `notes`), where("userId", "==", user.uid))
    );

    const q = query(
      collection(db, "notes"),
      where("sharedWith", "array-contains", user.uid)
    );

    const notesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      shared: false,
      ...doc.data(),
    }));

    // Get the documents
    const getSharedNotes = await getDocs(q);
    getSharedNotes.docs.forEach((doc) => {
      notesList.push({ id: doc.id, shared: true, ...doc.data() });
    });

    setNotes(notesList as Note[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  if (!user) {
    return (
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "1.25rem",
          mt: 4,
          fontWeight: 500,
        }}
      >
        Please login to view your notes
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Add Note Form */}
      <NoteForm onNoteAdded={fetchNotes} />

      {/* Notes Grid */}
      {loading ? (
        <Box sx={{ display: "flex", mt: 4 }}>
          <CircularProgress size="sm" />
        </Box>
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
          {notes.length === 0 && <Typography>No notes found</Typography>}
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} onNoteUpdated={fetchNotes} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
