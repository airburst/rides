import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { memo } from "react";

type SearchDropdownProps = {
  value: string;
  onValueChange: (value: string) => void;
  data: (string | null | undefined)[];
  placeholder?: string;
};

export const SearchDropdown = memo(
  ({
    value,
    onValueChange,
    data,
    placeholder = "Search ride details...",
  }: SearchDropdownProps) => {
    const items = data.filter(Boolean) as string[];

    return (
      <Combobox
        items={items}
        value={value}
        onValueChange={(val) => onValueChange(val ?? "")}
      >
        <div className="relative flex w-full items-center rounded-lg border border-neutral-600 bg-white">
          <ComboboxPrimitive.Input
            placeholder={placeholder}
            className="h-9 w-full bg-transparent px-3 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-lg"
            style={{ color: "#111827" }}
          />
          {value ? (
            <ComboboxPrimitive.Clear
              onClick={() => onValueChange("")}
              className="absolute right-2 text-neutral-500 hover:text-neutral-800"
            >
              <XIcon className="size-4" />
            </ComboboxPrimitive.Clear>
          ) : (
            <ComboboxPrimitive.Trigger className="absolute right-2 text-neutral-500 hover:text-neutral-800">
              <ChevronDownIcon className="size-4" />
            </ComboboxPrimitive.Trigger>
          )}
        </div>
        <ComboboxContent>
          <ComboboxEmpty>Nothing found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
);

SearchDropdown.displayName = "SearchDropdown";
