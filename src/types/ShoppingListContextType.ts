type ShoppingListContextType = {
  lists: ShoppingList[];
  selectedListId: string | null;
  setSelectedListId: (id: string | null) => void;
  refreshLists: () => Promise<void>;
  createList: (name: string) => Promise<void>;
};
