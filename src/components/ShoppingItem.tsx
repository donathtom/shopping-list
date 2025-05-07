import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

export default function ShoppingItem({
  id,
  name,
  quantity,
  checked,
  onToggle,
  onEdit,
  onDelete,
}: ShoppingItemProps & {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <ListItem disablePadding>
      <Card
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          "&:hover .action-buttons": {
            display: "flex",
          },
        }}
      >
        <ListItemButton
          onClick={() => onToggle(id, checked)}
          sx={{ flexGrow: 1 }}
        >
          <Checkbox checked={checked} />
          <ListItemText
            primary={name}
            secondary={
              quantity && quantity.trim().length > 0 ? quantity : undefined
            }
          />
        </ListItemButton>

        <Box
          sx={{
            display: {
              xs: "flex", // auf Mobile immer sichtbar
              sm: "none", // ab "sm" (600px) nur auf Hover sichtbar
            },
            gap: 1,
            ml: "auto",
          }}
          className="action-buttons"
        >
          <IconButton onClick={() => onEdit?.(id)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => onDelete?.(id)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Card>
    </ListItem>
  );
}
