import { useState } from "react";
import { db } from "../../../firebase-config";
import {
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { Note } from "./Notes";
import { useAuth } from "../../context/auth-provider";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  Option,
  Select,
  Sheet,
  Textarea,
  Typography,
} from "@mui/joy";
import { Delete, Edit, Share } from "@mui/icons-material";
import toast from "react-hot-toast";

interface NoteItemProps {
  note: Note;
  onNoteUpdated: () => void;
}

export default function NoteItem({ note, onNoteUpdated }: NoteItemProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title || "");
  const [editedText, setEditedText] = useState(note.text);
  const { user, allUsers } = useAuth();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [noteToShare, setNote] = useState<Note | null>(null); // Assume you have a note ready to share
  const [sharedUsers, setSharedUsers] = useState<string[]>(
    note.sharedWith || []
  );

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, `users/${user?.uid}/notes`, note.id));
      toast.success("Note deleted successfully!");
      onNoteUpdated();
    } catch (error) {
      toast.error("Failed to delete note. Try again.");
    }
  };

  const handleEdit = async () => {
    setIsEditing(true);
    try {
      await updateDoc(doc(db, `notes`, note.id), {
        title: editedTitle,
        text: editedText,
        sharedWith: sharedUsers,
      });
      toast.success("Note updated successfully!");
      setIsEditing(false);
      setOpen(false);
      onNoteUpdated();
    } catch (error) {
      toast.error("Failed to update note. Try again.");
    }
  };

  const handleOpen = (note: Note) => {
    setNote(note); // Set the note that is to be shared
    setOpen(true);
  };

  const handleShare = async () => {
    setLoading(true);

    try {
      // Search for recipient user by email
      const userSnapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", recipientEmail))
      );
      console.log("This is userSnapshot", userSnapshot.docs);

      if (userSnapshot.empty) {
        toast.error("User not found!");
        setLoading(false);
        return;
      }

      const recipientUserId = userSnapshot.docs[0].id;

      if (noteToShare) {
        const sharedNoteRef = doc(db, `notes`, noteToShare.id);
        const updatedSharedWith = noteToShare.sharedWith || []; // Ensure sharedWith is initialized as an array
        if (!updatedSharedWith.includes(recipientUserId)) {
          updatedSharedWith.push(recipientUserId); // Add recipientUserId to sharedWith array if not already present
        }

        // Update the note in Firestore
        await updateDoc(sharedNoteRef, {
          sharedWith: updatedSharedWith,
        });

        // await sendNotificationToRecipient(recipientUserId, noteToShare.id);

        toast.success("Note shared successfully!");
        setOpen(false);
        setRecipientEmail("");
      }
    } catch (error) {
      toast.error("Error sharing note: " + (error as Error).message);
    }

    setLoading(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setIsEditing(false);
          setNote(null);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <>
          {noteToShare ? (
            <Sheet
              sx={{
                p: 3,
                borderRadius: "8px",
              }}
              variant="outlined"
            >
              <ModalClose variant="plain" sx={{ m: 1 }} />
              <Typography level="h4" mb={2}>
                Share Note
              </Typography>
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Email of recipient</FormLabel>
                <Input
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
              <Button
                fullWidth
                onClick={handleShare}
                variant="solid"
                color="primary"
                disabled={loading}
              >
                {loading ? "Sharing..." : "Share Note"}
              </Button>
            </Sheet>
          ) : (
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
              {note.sharedWith?.length! > 0 && (
                <Select
                  multiple
                  defaultValue={allUsers
                    .filter((userData) =>
                      note.sharedWith?.includes(userData.id)
                    )
                    .map((user) => user.id)}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: "0.25rem" }}>
                      {selected.map((selectedOption) => (
                        <Chip variant="soft" color="primary">
                          {selectedOption.label}
                        </Chip>
                      ))}
                    </Box>
                  )}
                  onChange={(_, value) => {
                    setSharedUsers(value);
                  }}
                  sx={{ minWidth: "15rem", mb: 2 }}
                  slotProps={{
                    listbox: {
                      sx: {
                        width: "100%",
                      },
                    },
                  }}
                >
                  {allUsers
                    .filter((userData) =>
                      note.sharedWith?.includes(userData.id)
                    )
                    .map((user, index) => (
                      <Option key={index} value={user.id}>
                        {user.email}
                      </Option>
                    ))}
                </Select>
              )}
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
          )}
        </>
      </Modal>

      {/* Card */}
      <Card
        sx={{
          minWidth: 280,
          maxWidth: 320,
          maxHeight: 200,
          overflowX: "hidden",
          borderRadius: "xl",
        }}
        variant="soft"
      >
        <Typography level="title-lg">{note.title}</Typography>

        <Typography
          level="body-sm"
          overflow={"scroll"}
          sx={{ overflowX: "hidden" }}
        >
          {note.text}
        </Typography>
        {!note.shared && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              gap: 0.5,
            }}
          >
            <Edit onClick={() => setOpen(true)} sx={{ cursor: "pointer" }} />
            <Delete onClick={handleDelete} sx={{ cursor: "pointer" }} />
            <Share
              onClick={() => handleOpen(note)}
              sx={{ cursor: "pointer" }}
            />
          </Box>
        )}
        {note.shared && (
          <Typography
            level="body-xs"
            textColor="danger.600"
            fontSize={10}
            textAlign={"end"}
          >
            Shared by{" "}
            <Typography
              level="body-xs"
              textColor="danger.700"
              fontSize={10}
              fontWeight={600}
            >
              {allUsers.find((user) => user.id === note.userId)?.name ||
                "Unknown"}
            </Typography>
          </Typography>
        )}
      </Card>
    </>
  );
}
