import { supabase } from "@/lib/supabase";
import { createContext, useCallback, useContext, useState } from "react";

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined
);

export const ShoppingListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const refreshLists = useCallback(async () => {
    const { data, error } = await supabase
      .from("shopping_lists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der Listen:", error.message);
    } else {
      setLists(data);
    }
  }, []);

  const createList = async (name: string) => {
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
      setSelectedListId(data.id);
      localStorage.setItem("lastUsedListId", data.id);
      await refreshLists();
    }
  };

  return (
    <ShoppingListContext.Provider
      value={{
        lists,
        selectedListId,
        setSelectedListId,
        refreshLists,
        createList,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingListContext = () => {
  const ctx = useContext(ShoppingListContext);
  if (!ctx)
    throw new Error("useShoppingListContext muss im Provider verwendet werden");
  return ctx;
};
