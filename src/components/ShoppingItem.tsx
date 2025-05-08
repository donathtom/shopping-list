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
  onDelete,
  onEditClick,
}: ShoppingItemProps & {
  onDelete?: (id: string) => void;
  onEditClick?: () => void;
}) {
  return (
    <ListItem key={id} disableGutters>
      <Card
        sx={{
          opacity: checked ? 0.6 : 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1,
          "&:hover .action-buttons": {
            display: "flex",
          },
        }}
      >
        <ListItemButton onClick={() => onToggle(id, checked)} sx={{ flex: 1 }}>
          <Checkbox checked={checked} />
          <ListItemText
            primary={name}
            secondary={quantity}
            sx={{
              textDecoration: checked ? "line-through" : "none",
              color: checked ? "text.disabled" : "text.primary",
            }}
          />
        </ListItemButton>

        <Box
          className="action-buttons"
          sx={{
            display: { xs: "flex", sm: "none" },
            gap: 1,
            ml: 1,
          }}
        >
          <IconButton onClick={onEditClick}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete?.(id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Card>
    </ListItem>
  );
}
