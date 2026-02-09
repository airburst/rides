import { useRouter } from "@tanstack/react-router";

export const CancelButton = ({ ...props }) => {
  const router = useRouter();

  return (
    <button
      className="btn btn-neutral h-full"
      type="button"
      onClick={() => router.history.back()}
      {...props}
    >
      CANCEL
    </button>
  );
};
