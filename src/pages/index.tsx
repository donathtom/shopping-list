import { useEffect, useState } from "react";
import {
  Container,
  List,
  Typography,
  Card,
  ListItemButton,
  ListItemText,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { supabase } from "@/lib/supabase"; // Stelle sicher, dass du supabase importiert hast
import ShoppingItem from "@/components/ShoppingItem";

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
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

  // Item hinzufügen
  const handleAddItem = async () => {
    if (newItem.name.trim() === "" || newItem.quantity.trim() === "") return;

    const newItemData = {
      list_id: LIST_ID,
      name: newItem.name,
      quantity: newItem.quantity,
      checked: false,
      order: getNextOrderValue(),
    };

    const { data, error } = await supabase.from("items").insert([newItemData]);

    if (error) {
      console.error("Fehler beim Hinzufügen:", error.message);
    } else {
      setItems([...items, data![0]]);
      setNewItem({ name: "", quantity: "" }); // Formular zurücksetzen
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Einkaufsliste
      </Typography>

      {/* Eingabeformular */}
      <Box sx={{ display: "flex", marginBottom: 2 }}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="Menge"
          variant="outlined"
          fullWidth
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <Button
          onClick={handleAddItem}
          variant="contained"
          color="primary"
          sx={{ marginLeft: 2 }}
        >
          Hinzufügen
        </Button>
      </Box>

      <List>
        {/* List Items */}
        {items
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) // Sortieren nach order
          .map((item) => (
            <ShoppingItem
              key={item.id}
              id={item.id}
              name={item.name}
              quantity={item.quantity}
              checked={item.checked}
              onToggle={toggleChecked}
            />
          ))}

        {/* Leere Card für "Hinzufügen"-Button */}
        <Card sx={{ width: "100%", marginTop: 2 }}>
          <ListItemButton onClick={() => {}} sx={{ justifyContent: "center" }}>
            <ListItemText primary="+" sx={{ textAlign: "center" }} />
          </ListItemButton>
        </Card>
      </List>
    </Container>
  );
}
