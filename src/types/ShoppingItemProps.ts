type ShoppingItemProps = {
    id: string;
    name: string;
    quantity?: string;
    checked: boolean;
    onToggle: (id: string, checked: boolean) => void;
};