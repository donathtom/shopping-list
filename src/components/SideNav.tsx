import { supabase } from "@/lib/supabase";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function SideNav({
  onSelectList,
  onAddList,
  onSettings,
  onListsChange,
}: SideNavProps) {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<ShoppingList[]>([]);

  const fetchLists = async () => {
    const { data, error } = await supabase
      .from("shopping_lists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der Listen:", error.message);
    } else {
      setLists(data);
    }
  };

  useEffect(() => {
    fetchLists();
    onListsChange(fetchLists);
  }, []);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} edge="start" sx={{ m: 1 }}>
        <MenuIcon />
      </IconButton>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <Typography variant="h6" sx={{ p: 2 }}>
            Listen
          </Typography>

          <List>
            {lists.map((list) => (
              <ListItem key={list.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    onSelectList(list.id);
                    setOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary={list.name} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  onAddList();
                  setOpen(false);
                }}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Neue Liste" />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />

          <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
            <ListItemButton
              onClick={() => {
                onSettings();
                setOpen(false);
              }}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Einstellungen" />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
