"use client";

import { useRouter } from "next/navigation";

export const CancelButton = ({ ...props }) => {
  const router = useRouter();

  return (
    <button
      className="btn btn-neutral"
      type="button"
      onClick={() => router.back()}
      {...props}
    >
      CANCEL
    </button>
  );
};
