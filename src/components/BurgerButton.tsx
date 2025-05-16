import { Box, IconButton } from "@mui/material";

export default function BurgerButton({
  open,
  toggle,
}: {
  open: boolean;
  toggle: () => void;
}) {
  return (
    <IconButton
      onClick={toggle}
      sx={{
        m: 1,
        width: 48,
        height: 48,
        borderRadius: "50%",
        padding: 0,
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 2,
          backgroundColor: "black",
          position: "absolute",
          transition: "0.3s",
          transform: open ? "rotate(45deg)" : "translateY(-6px)",
        }}
      />
      <Box
        sx={{
          width: 24,
          height: 2,
          backgroundColor: "black",
          position: "absolute",
          transition: "0.3s",
          opacity: open ? 0 : 1,
        }}
      />
      <Box
        sx={{
          width: 24,
          height: 2,
          backgroundColor: "black",
          position: "absolute",
          transition: "0.3s",
          transform: open ? "rotate(-45deg)" : "translateY(6px)",
        }}
      />
    </IconButton>
  );
}
