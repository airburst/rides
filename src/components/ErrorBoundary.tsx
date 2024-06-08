/* eslint-disable no-console */
import React, { Component, ErrorInfo, ReactNode } from "react";
import { CircleExclamationIcon } from "./Icon";

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

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.hasError) {
      return (
        <div className="flex flex-col text-neutral-800 justify-center">
          <div className="flex h-64 items-center justify-center">
            <CircleExclamationIcon className="fill-red-500 w-24 h-24" />
          </div>
          <div className="flex items-center p-4 text-center text-2xl text-neutral-700">
            Sorry.. the app is experiencing problems
          </div>
          <div className="flex items-center p-4 justify-center text-2xl text-neutral-700">
            Please try again later
          </div>
        </div>
      );
    }

    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children;
  }
}

export default ErrorBoundary;
