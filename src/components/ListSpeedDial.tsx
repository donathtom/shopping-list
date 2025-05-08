import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { useState } from "react";

export default function ListSpeedDial({
  onEdit,
  onDelete,
  onShare,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleAction = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  const actions = [
    { icon: <EditIcon />, name: "Bearbeiten", onClick: onEdit },
    { icon: <DeleteIcon />, name: "Löschen", onClick: onDelete },
    { icon: <ShareIcon />, name: "Teilen", onClick: onShare },
  ];

  return (
    <Box
      sx={{
        transform: "translateZ(0px)",
        position: "fixed",
        bottom: 16,
        right: 16,
      }}
    >
      <SpeedDial
        ariaLabel="List-Aktionen"
        icon={<SpeedDialIcon />}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        FabProps={{
          onFocus: (e) => e.stopPropagation(),
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={() => handleAction(action.onClick)}
            slotProps={{
              tooltip: { title: action.name },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
