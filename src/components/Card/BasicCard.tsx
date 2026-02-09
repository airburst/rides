import { useId, useRef, type ReactNode } from "react";

type Props = {
  id?: string;
  children: ReactNode;
};

export const BasicCard: React.FC<Props> = ({ id, children }: Props) => {
  const swipedRef = useRef(false);
  const ssrId = useId();

  return (
    <div
      id={id ?? ssrId}
      role="presentation"
      className="relative box-border flex h-full w-full cursor-pointer gap-2 rounded-lg bg-white p-1 text-neutral-500 shadow-md hover:shadow-lg md:mx-auto md:gap-2"
      onClick={(e) => {
        if (swipedRef.current) {
          e.preventDefault();
        }
      }}
      onPointerDown={() => {
        swipedRef.current = false;
      }}
      onPointerMove={() => {
        swipedRef.current = true;
      }}
    >
      {children}
    </div>
  );
};
