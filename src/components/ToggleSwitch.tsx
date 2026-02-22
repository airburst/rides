import { cn } from "@/lib/utils";
import { memo } from "react";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: () => void;
  label: string;
  srOnlyLabel?: boolean;
};

export const ToggleSwitch = memo(
  ({ checked, onChange, label, srOnlyLabel = false }: ToggleSwitchProps) => {
    const switchClass = cn(
      "relative inline-flex h-6 w-11 items-center rounded-full",
      checked ? "bg-green-600" : "bg-gray-200",
    );
    const toggleClass = cn(
      "inline-block h-4 w-4 transform rounded-full bg-white transition",
      checked ? "translate-x-6" : "translate-x-1",
    );

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={switchClass}
      >
        <span className={srOnlyLabel ? "sr-only" : "hidden"}>{label}</span>
        <span className={toggleClass} />
      </button>
    );
  },
);

ToggleSwitch.displayName = "ToggleSwitch";
