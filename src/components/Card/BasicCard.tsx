import { useId, useState, type ReactNode } from "react";

type Props = {
  id?: string;
  onPress?: () => void;
  children: ReactNode;
};

export const BasicCard: React.FC<Props> = ({
  id,
  onPress,
  children,
}: Props) => {
  const [isSwiping, setSwiping] = useState(false);
  const ssrId = useId();

  return (
    <div
      id={id ?? ssrId}
      role="presentation"
      className="relative box-border flex h-full w-full cursor-pointer gap-2 rounded-lg bg-white p-1 text-neutral-500 shadow-md hover:shadow-lg md:mx-auto md:gap-2"
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
