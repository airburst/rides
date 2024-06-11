"use client";

import { useRouter } from "next/navigation";

export const CancelButton = ({ ...props }) => {
  const router = useRouter();

  return (
    <button
      className="btn"
      type="button"
      onClick={() => router.back()}
      {...props}
    >
      CANCEL
    </button>
  );
};
