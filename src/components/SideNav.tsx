import { supabase } from "@/lib/supabase";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";
import { logout } from "../functions/logout";
import BurgerButton from "./BurgerButton";
import { useShoppingListContext } from "@/contexts/ShoppingListContext";

export default function SideNav() {
  const [open, setOpen] = useState(false);
  const { lists, setSelectedListId, refreshLists, createList } =
    useShoppingListContext();

  useEffect(() => {
    refreshLists();
  }, []);

  return (
    <>
      <Box sx={{ position: "fixed", top: 8, zIndex: 1301 }}>
        <BurgerButton open={open} toggle={() => setOpen(!open)} />
      </Box>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ display: "flex", gap: 2, px: 2, py: 3 }}>
            <Typography variant="h5" sx={{ paddingLeft: "58px" }}>
              Listen
            </Typography>
          </Box>

          <List>
            {lists.map((list) => (
              <ListItem key={list.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setSelectedListId(list.id);
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
                  createList("Neue Liste");
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
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  logout().then(() => router.push("/login"));
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Abmelden" />
              </ListItemButton>
            </ListItem>
            <ListItemButton
              onClick={() => {
                router.push("/settings");
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
