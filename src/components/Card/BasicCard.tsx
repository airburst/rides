"use client";
import { useState, type ReactNode } from "react";

type Props = {
  onPress?: () => void;
  children: ReactNode;
};

export const BasicCard: React.FC<Props> = ({ onPress, children }: Props) => {
  const [isSwiping, setSwiping] = useState(false);

  return (
    <div
      role="presentation"
      className="relative md:mx-autotext-neutral-500 box-border flex w-full cursor-pointer gap-2 rounded bg-white shadow-md hover:text-neutral-700 hover:shadow-lg md:gap-2"
      onMouseDown={() => setSwiping(false)}
      onMouseMove={() => setSwiping(true)}
      onMouseUp={(e) => {
        if (!isSwiping && e.button === 0) {
          onPress?.();
        }
        setSwiping(false);
      }}
      onTouchStart={() => setSwiping(false)}
      onTouchMove={() => setSwiping(true)}
      onTouchEnd={(e) => {
        if (e.cancelable) e.preventDefault();
        if (!isSwiping) {
          onPress?.();
        }
        setSwiping(false);
      }}
    >
      {children}
    </div>
  );
};
