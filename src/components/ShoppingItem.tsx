import {
  Card,
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";

export default function ShoppingItem({
  id,
  name,
  quantity,
  checked,
  onToggle,
}: ShoppingItemProps) {
  return (
    <ListItem key={id}>
      <Card sx={{ width: "100%", backgroundColor: "#f3f3f3" }}>
        <ListItemButton onClick={() => onToggle(id, checked)}>
          <Checkbox checked={checked} />
          <ListItemText
            primary={name}
            secondary={
              quantity && quantity.trim().length > 0 ? quantity : undefined
            }
          />
        </ListItemButton>
      </Card>
    </ListItem>
  );
}
