import { CircleAlert } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col justify-center text-neutral-800">
          <div className="flex h-64 items-center justify-center">
            <CircleAlert className="h-24 w-24 text-error" />
          </div>
          <div className="flex items-center p-4 text-center text-2xl text-neutral-700">
            Sorry.. the app is experiencing problems
          </div>
          <div className="flex items-center justify-center p-4 text-2xl text-neutral-700">
            Please try again later
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
