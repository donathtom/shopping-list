import EditItemDialog from "@/components/EditItemDialog";
import ShoppingItem from "@/components/ShoppingItem";
import { supabase } from "@/lib/supabase";
import AddIcon from "@mui/icons-material/Add";
import {
  Card,
  Container,
  IconButton,
  List,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemBeingEdited, setItemBeingEdited] = useState<Item | null>(null);
  const LIST_ID = "ba4f78a4-2d10-47a1-a70e-094e1f827bdf";

  // Fetch Items aus Supabase
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("list_id", LIST_ID);

    if (error) {
      console.error("Supabase-Fehler:", error.message);
    } else {
      setItems(data);
    }
  };

  const toggleChecked = async (id: string, checked: boolean) => {
    // Optimistische Aktualisierung der Items
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !checked } : item
      )
    );

    // API-Aufruf zur tatsächlichen Aktualisierung in der DB
    const { error } = await supabase
      .from("items")
      .update({ checked: !checked })
      .eq("id", id);

    if (error) {
      console.error("Fehler beim Aktualisieren:", error.message);
      // Optional: Rollback der Änderung bei Fehler
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, checked } : item))
      );
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Berechnet den nächsten 'order'-Wert
  const getNextOrderValue = () => {
    const maxOrder = Math.max(...items.map((item) => item.order ?? 0), 0);
    return maxOrder + 1;
  };

  const handleAddItem = async () => {
    if (newItem.name.trim() === "") return; // Name ist erforderlich

    const newItemData = {
      list_id: LIST_ID,
      name: newItem.name,
      quantity: newItem.quantity.trim() === "" ? null : newItem.quantity, // Wenn keine Menge angegeben wird, setze sie auf null
      checked: false,
      order: getNextOrderValue(),
    };

    const { data, error } = await supabase
      .from("items")
      .insert([newItemData])
      .select();

    if (error) {
      console.error("Fehler beim Hinzufügen:", error.message);
    } else if (data) {
      setNewItem({ name: "", quantity: "" });
      setItems([...items, data[0]]);
    }
  };

  const handleEditItem = async (
    id: string,
    updated: { name: string; quantity: string | null }
  ) => {
    const { error } = await supabase.from("items").update(updated).eq("id", id);
    if (error) {
      console.error("Fehler beim Bearbeiten:", error.message);
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updated,
                quantity: updated.quantity ?? undefined,
              }
            : item
        )
      );
    }
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) {
      console.error("Fehler beim Löschen:", error.message);
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const openEditDialog = (item: Item) => {
    setItemBeingEdited(item);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setItemBeingEdited(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Einkaufsliste
      </Typography>
      <Card sx={{ padding: "10px", display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Name"
          variant="outlined"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          sx={{ flex: 2 }}
        />
        <TextField
          label="Menge"
          variant="outlined"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          sx={{ flex: 1 }}
        />
        <IconButton
          onClick={handleAddItem}
          color="primary"
          sx={{ alignSelf: "center" }}
        >
          <AddIcon />
        </IconButton>
      </Card>

      <List>
        {items
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((item) => (
            <ShoppingItem
              key={item.id}
              id={item.id}
              name={item.name}
              quantity={item.quantity}
              checked={item.checked}
              onToggle={toggleChecked}
              onDelete={handleDeleteItem}
              onEditClick={() => openEditDialog(item)}
            />
          ))}
      </List>
      {itemBeingEdited && (
        <EditItemDialog
          open={editDialogOpen}
          onClose={closeEditDialog}
          initialName={itemBeingEdited.name}
          initialQuantity={itemBeingEdited.quantity}
          onSave={(updated) => handleEditItem(itemBeingEdited.id, updated)}
        />
      )}
    </Container>
  );
}
