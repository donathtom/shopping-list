import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function ListTitleDialog({
  open,
  onClose,
  onSave,
  initialName = "",
  dialogTitle = "Neue Liste erstellen",
}: {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName?: string;
  dialogTitle?: string;
}) {
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, initialName]);

  const handleSave = () => {
    if (name.trim() === "") return;
    onSave(name.trim());
    setName("");
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} disableRestoreFocus>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={inputRef}
          margin="dense"
          label="Listenname"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSave();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={handleSave} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
