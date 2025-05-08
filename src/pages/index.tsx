import EditItemDialog from "@/components/EditItemDialog";
import ListSpeedDial from "@/components/ListSpeedDial";
import ListTitleDialog from "@/components/ListTitleDialog";
import ShoppingItem from "@/components/ShoppingItem";
import SideNav from "@/components/SideNav";
import { supabase } from "@/lib/supabase";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Card,
  Container,
  IconButton,
  List,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
  Typography,
} from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [itemBeingEdited, setItemBeingEdited] = useState<Item | null>(null);
  const [listId, setListId] = useState<string | null>(null);
  const [listName, setListName] = useState<string>("");

  const [refreshLists, setRefreshLists] = useState<() => void>(() => {});

  // Fetch Items aus Supabase
  const fetchItems = async () => {
    if (!listId) return;

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("list_id", listId);

    if (error) {
      console.error("Supabase-Fehler:", error.message);
    } else {
      setItems(data);
    }
  };

  const fetchListName = async () => {
    if (!listId) return;

    const { data, error } = await supabase
      .from("shopping_lists")
      .select("name")
      .eq("id", listId)
      .single();

    if (error) {
      console.error("Supabase-Fehler:", error.message);
    } else {
      setListName(data.name);
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
    const savedListId = localStorage.getItem("lastUsedListId");
    if (savedListId) {
      setListId(savedListId);
    }
  }, []);

  useEffect(() => {
    if (listId) {
      fetchItems();
      fetchListName();
    }
  }, [listId]);

  useEffect(() => {
    if (listId) {
      localStorage.setItem("lastUsedListId", listId);
    }
  }, [listId]);

  // Berechnet den nächsten 'order'-Wert
  const getNextOrderValue = () => {
    const maxOrder = Math.max(...items.map((item) => item.order ?? 0), 0);
    return maxOrder + 1;
  };

  const handleAddItem = async () => {
    if (newItem.name.trim() === "") return; // Name ist erforderlich

    const newItemData = {
      list_id: listId,
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

  const handleCreateList = async (name: string) => {
    const { data, error } = await supabase
      .from("shopping_lists")
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      console.error("Fehler beim Erstellen:", error.message);
      return;
    }

    if (data) {
      setListId(data.id);
      localStorage.setItem("lastUsedListId", data.id);
      refreshLists();
    }

    setShowNewDialog(false);
  };

  const handleRenameList = async (newName: string) => {
    if (!listId) return;

    const { error } = await supabase
      .from("shopping_lists")
      .update({ name: newName })
      .eq("id", listId);

    if (error) {
      console.error("Fehler beim Umbenennen der Liste:", error.message);
      return;
    }

    setListName(newName);
    setShowEditDialog(false);
    refreshLists?.();
  };

  return (
    <>
      <SideNav
        onSelectList={(id) => setListId(id)}
        onAddList={() => setShowNewDialog(true)}
        onSettings={() => router.push("/settings")}
        onListsChange={(fn) => setRefreshLists(() => fn)}
      />
      <Container sx={{ position: "relative", minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom>
          {listName}
        </Typography>

        <Card
          sx={{ padding: "10px", display: "flex", gap: 2, marginBottom: 2 }}
        >
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
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: e.target.value })
            }
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
        <ListTitleDialog
          open={showNewDialog}
          onClose={() => setShowNewDialog(false)}
          onSave={(name) => handleCreateList(name)}
        />
        <ListSpeedDial
          onEdit={() => setShowEditDialog(true)}
          onDelete={() => console.log("Löschen")}
          onShare={() => console.log("Teilen")}
        />
        <ListTitleDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onSave={(name) => handleRenameList(name)}
          initialName={listName}
          dialogTitle="Liste umbenennen"
        />
      </Container>
    </>
  );
}
