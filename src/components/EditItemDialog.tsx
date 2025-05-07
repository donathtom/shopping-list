import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (updated: { name: string; quantity: string | null }) => void;
  initialName: string;
  initialQuantity?: string | null;
};

export default function EditItemDialog({
  open,
  onClose,
  onSave,
  initialName,
  initialQuantity,
}: Props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    setName(initialName);
    setQuantity(initialQuantity ?? "");
  }, [initialName, initialQuantity]);

  const handleSave = () => {
    if (name.trim() === "") return;
    onSave({ name, quantity: quantity.trim() === "" ? null : quantity });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Artikel bearbeiten</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Menge"
          fullWidth
          margin="normal"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={handleSave} variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
