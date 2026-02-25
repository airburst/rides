import { Switch } from "@/components/ui/switch";
import { memo } from "react";

type ToggleSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
};

export const ToggleSwitch = memo(
  ({ checked, onCheckedChange, label }: ToggleSwitchProps) => {
    return (
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
        className="data-[state=checked]:bg-green-600"
      />
    );
  },
);

ToggleSwitch.displayName = "ToggleSwitch";
