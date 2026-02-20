import { useId, useRef, type ReactNode } from "react";

type Props = {
  id?: string;
  children: ReactNode;
};

export const BasicCard: React.FC<Props> = ({ id, children }: Props) => {
  const swipedRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const ssrId = useId();

  return (
    <div
      id={id ?? ssrId}
      role="presentation"
      style={{ touchAction: "manipulation" }}
      className="relative box-border flex h-full w-full cursor-pointer gap-2 rounded-lg bg-white p-1 text-neutral-500 shadow-md hover:shadow-lg md:mx-auto md:gap-2"
      onClick={(e) => {
        if (swipedRef.current) {
          e.preventDefault();
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={(e) => {
        startRef.current = { x: e.clientX, y: e.clientY };
        swipedRef.current = false;
      }}
      onPointerMove={(e) => {
        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;
        if (dx * dx + dy * dy > 100) {
          swipedRef.current = true;
        }
      }}
    >
      {children}
    </div>
  );
};
