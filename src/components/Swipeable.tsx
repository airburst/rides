import { useState } from "react";

type SwipableProps = {
  onPress: () => void;
};

export const Swipable = ({ onPress }: SwipableProps) => {
  const [isSwiping, setSwiping] = useState(false);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: its-ok
    <div
      role="presentation"
      className="h-64 w-full bg-red-500"
      onMouseDown={() => setSwiping(false)}
      onMouseMove={() => setSwiping(true)}
      onMouseUp={(e) => {
        if (!isSwiping && e.button === 0) {
          onPress();
        }
        setSwiping(false);
      }}
      onTouchStart={() => setSwiping(false)}
      onTouchMove={() => setSwiping(true)}
      onTouchEnd={(e) => {
        e.preventDefault();
        if (!isSwiping) {
          onPress();
        }
        setSwiping(false);
      }}
    />
  );
};
