"use client";

import { useRouter } from "next/navigation";

export const CancelButton = ({ ...props }) => {
  const router = useRouter();

  return (
    <button
      className="btn btn-neutral h-full"
      type="button"
      onClick={() => router.back()}
      {...props}
    >
      CANCEL
    </button>
  );
};
