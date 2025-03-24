import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useAuth } from "../context/auth-provider";
import {
  Box,
  Button,
  CircularProgress,
  Input,
  Modal,
  ModalClose,
  Sheet,
  Textarea,
  Typography,
} from "@mui/joy";
import { Add } from "@mui/icons-material";
import React from "react";

interface AddNoteFormProps {
  onNoteAdded: () => void;
  showToast: (type: "success" | "error", text: string) => void;
  valueBeforeEdit?: {
    title: string;
    text: string;
  };
}

const COLORS = ["#FEF08A", "#BBF7D0", "#BFDBFE", "#FECACA", "#E9D5FF"];

export default function NoteForm({
  onNoteAdded,
  showToast,
  valueBeforeEdit,
}: AddNoteFormProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [newTitle, setNewTitle] = useState(valueBeforeEdit?.title || "");
  const [newNote, setNewNote] = useState(valueBeforeEdit?.text || "");
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
      await addDoc(collection(db, `notes`), {
        title: newTitle || "Untitled",
        text: newNote,
        color: randomColor,
        sharedWith: [],
        userId: user?.uid,
      });

      showToast("success", "Note added successfully!");
      setNewTitle("");
      setNewNote("");
      onNoteAdded();
    } catch (error) {
      showToast("error", "Failed to add note. Try again.");
    } finally {
      setIsAdding(false);
      setOpen(false);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="soft"
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
        Add Note
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ minWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: "lg", mb: 1 }}
          >
            Add Note
          </Typography>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
            sx={{ mb: 2 }}
          />
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            minRows={4}
            maxRows={8}
            placeholder="Take a note..."
            sx={{ mb: 2 }}
          />
          <Button onClick={handleAddNote} disabled={isAdding} variant="soft">
            {isAdding ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size="sm" />
                Adding...
              </Box>
            ) : (
              "Add Note"
            )}
          </Button>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
