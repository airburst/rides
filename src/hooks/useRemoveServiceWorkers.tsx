import { useEffect } from "react";

export const useRemoveServiceWorkers = () => {
  useEffect(() => {
    const remove = async () => {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker
          .getRegistrations()
          .then(async (registrations) => {
            registrations.forEach((registration) => {
              void registration.unregister();
            });
          });
      }
    };

    void remove();
  }, []);

  return null;
};
