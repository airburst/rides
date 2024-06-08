import { useState } from "react";

type SwipableProps = {
  onPress: () => void;
};

export const Swipable = ({ onPress }: SwipableProps) => {
  const [isSwiping, setSwiping] = useState(false);

  return (
    <div
      role="presentation"
      className="h-64 w-full bg-red-500"
      onMouseDown={() => setSwiping(false)}
      onMouseMove={() => setSwiping(true)}
      onMouseUp={(e) => {
        if (!isSwiping && e.button === 0) {
          onPress();
        }
        // else {
        //   console.log("dragging");
        // }
        setSwiping(false);
      }}
      onTouchStart={() => setSwiping(false)}
      onTouchMove={() => setSwiping(true)}
      onTouchEnd={(e) => {
        e.preventDefault();
        if (!isSwiping) {
          onPress();
        }
        // else {
        //   console.log("swiping");
        // }
        setSwiping(false);
      }}
    />
  );
};
