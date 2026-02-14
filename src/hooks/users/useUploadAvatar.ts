import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { User } from "@/types";

type CurrentUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  preferences: unknown;
};

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();

  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const token = await getAccessTokenSilently();
      
      const formData = new FormData();
      formData.append("avatar", file);

      return apiClient<{
        success: boolean;
        image: string;
        imageLarge: string;
      }>(`/users/${userId}/avatar`, {
        method: "POST",
        token,
        body: formData,
      });
    },
    onSuccess: (data, variables) => {
      // Add cache-busting timestamp to force browser to reload images
      const timestamp = Date.now();
      const imageWithCache = `${data.image}?v=${timestamp}`;
      const imageLargeWithCache = `${data.imageLarge}?v=${timestamp}`;

      // Update the user query cache (for profile page detail view)
      queryClient.setQueryData<User>(["user", variables.userId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          image: imageWithCache,
          imageLarge: imageLargeWithCache,
        };
      });

      // Update the currentUser query cache (for session/header)
      queryClient.setQueryData<CurrentUser>(["currentUser"], (oldData) => {
        if (!oldData || oldData.id !== variables.userId) return oldData;
        return {
          ...oldData,
          image: imageWithCache,
        };
      });

      // Only invalidate users list (not current user queries to preserve cache-busting)
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
