import { ShoppingListProvider } from "@/contexts/ShoppingListContext";
import { Box, Container } from "@mui/material";
import { ReactNode } from "react";
import SideNav from "../SideNav";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <ShoppingListProvider>
      <Box sx={{ display: "flex" }}>
        <SideNav />
        <Container sx={{ mt: 2, ml: 1 }}>{children}</Container>
      </Box>
    </ShoppingListProvider>
  );
}
