type SideNavProps = {
  onSelectList: (id: string) => void;
  onAddList: () => void;
  onSettings: () => void;
  onListsChange: (fn: () => void) => void;
};