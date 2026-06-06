import { useEffect, useState } from "react";

type NavigatorWithRelatedApps = Navigator & {
  getInstalledRelatedApps: () => Promise<unknown[]>;
};

async function detectInstalledPWA(): Promise<boolean> {
  if (window.matchMedia("(display-mode: standalone)").matches) return false;
  if (!("getInstalledRelatedApps" in navigator)) return false;

  try {
    const apps = await (navigator as NavigatorWithRelatedApps).getInstalledRelatedApps();
    return apps.length > 0;
  } catch {
    return false;
  }
}

export function useInstalledPWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    detectInstalledPWA().then((installed) => {
      setIsInstalled(installed);
      setIsLoading(false);
    });
  }, []);

  return { isInstalled, isLoading };
}
