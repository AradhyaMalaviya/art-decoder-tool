import { Component, ErrorInfo, ReactNode } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
            <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">View Crashed</h1>
            <p className="text-muted-foreground max-w-md mb-8">
              {this.state.error?.message || "An unexpected error occurred while rendering this module."}
            </p>
            <Button onClick={() => window.location.reload()} className="gap-2" size="lg">
              <RefreshCcw className="h-4 w-4" />
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
