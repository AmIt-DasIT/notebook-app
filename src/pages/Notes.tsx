import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/auth-provider";
import NoteForm from "./NoteForm";
import NoteItem from "./NoteItem";
import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/joy";

export interface Note {
  id: string;
  title?: string;
  text: string;
  color: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
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
    setOpen(true);

    setTimeout(() => {
      setMessage(null);
      setOpen(false);
    }, 5000);
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  if (!user) {
    return (
      <Box
        sx={{
          textAlign: "center",
          fontSize: "1.25rem",
          mt: 4,
          fontWeight: 500,
        }}
      >
        Please login to view your notes
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Toast Message */}
      <Snackbar
        variant="soft"
        color={message?.type === "success" ? "success" : "danger"}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ fontWeight: 600 }}
        endDecorator={
          <Button
            onClick={() => setOpen(false)}
            size="sm"
            variant="solid"
            color={message?.type === "success" ? "success" : "danger"}
          >
            Dismiss
          </Button>
        }
      >
        {message?.text}
      </Snackbar>

      {/* Add Note Form */}
      <NoteForm onNoteAdded={fetchNotes} showToast={showToast}  />

      {/* Notes Grid */}
      {loading ? (
        <Box sx={{ display: "flex", mt: 4 }}>
          <CircularProgress size="sm" />
        </Box>
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
          {notes.length === 0 && <Typography>No notes found</Typography>}
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onNoteUpdated={fetchNotes}
              showToast={showToast}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
