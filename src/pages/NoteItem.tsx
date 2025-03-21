// NoteItem.tsx
import { useState } from "react";
import { db } from "../../firebase-config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { Note } from "./Notes";
import { useAuth } from "../context/auth-provider";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Input,
  Modal,
  ModalClose,
  Sheet,
  Textarea,
  Typography,
} from "@mui/joy";

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
  const [open, setOpen] = useState(false);
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
    setIsEditing(true);
    try {
      await updateDoc(doc(db, `users/${user?.uid}/notes`, note.id), {
        title: editedTitle,
        text: editedText,
      });
      showToast("success", "Note updated successfully!");
      setIsEditing(false);
      setOpen(false);
      onNoteUpdated();
    } catch (error) {
      console.error("Error updating note:", error);
      showToast("error", "Failed to update note. Try again.");
    }
  };

  return (
    <>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => {
          setOpen(false);
          setIsEditing(false);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
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
            Update Note
          </Typography>
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Title"
            sx={{ mb: 2 }}
          />
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            minRows={4}
            maxRows={8}
            placeholder="Take a note..."
            sx={{ mb: 2 }}
          />
          <Button
            onClick={handleEdit}
            variant="soft"
            disabled={isEditing}
            size="md"
          >
            {isEditing ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size="sm" />
                Updating...
              </Box>
            ) : (
              "Update"
            )}
          </Button>
        </Sheet>
      </Modal>
      <Card
        sx={{
          background: note.color,
          minWidth: 280,
          maxWidth: 320,
          maxHeight: 170,
          overflow: "hidden",
        }}
        variant="soft"
      >
        <Typography level="title-lg">{note.title}</Typography>
        <Typography level="body-sm">{note.text}</Typography>
        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <img
            src="/edit.svg"
            alt="Edit"
            onClick={() => {
              setOpen(true);
            }}
            style={{
              width: "27px",
              height: "27px",
              cursor: "pointer",
              marginRight: "6px",
            }}
          />
          <img
            src="/delete.svg"
            alt="Delete"
            onClick={handleDelete}
            style={{ width: "27px", height: "27px", cursor: "pointer" }}
          />
        </Box>
      </Card>
    </>
  );
}
