import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import { Alert, AlertAction, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useInstalledPWA } from "@/hooks/useInstalledPWA";

interface Props {
  targetPath: string;
  dismissKey: string;
}

export function PWARedirectBanner({ targetPath, dismissKey }: Props) {
  const { isInstalled, isLoading } = useInstalledPWA();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(dismissKey) === "true") {
      setIsDismissed(true);
    }
  }, [dismissKey]);

  if (isLoading || !isInstalled || isDismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, "true");
    setIsDismissed(true);
  };

  return (
    <Alert className="mb-4">
      <Smartphone />
      <AlertTitle>Open in app for the best experience</AlertTitle>
      <AlertAction>
        <Button size="sm" onClick={() => { window.location.href = targetPath; }}>
          Open
        </Button>
        <Button size="sm" variant="ghost" onClick={handleDismiss} aria-label="Dismiss">
          Dismiss
        </Button>
      </AlertAction>
    </Alert>
  );
}
