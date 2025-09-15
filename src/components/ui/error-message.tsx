import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: "network" | "api" | "permission" | "general";
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage = ({ 
  title,
  message, 
  type = "general", 
  onRetry,
  className 
}: ErrorMessageProps) => {
  const getIcon = () => {
    switch (type) {
      case "network":
        return <WifiOff className="h-4 w-4" />;
      case "api":
        return <Wifi className="h-4 w-4" />;
      case "permission":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case "network":
        return "네트워크 오류";
      case "api":
        return "데이터 로드 실패";
      case "permission":
        return "권한 필요";
      default:
        return "오류 발생";
    }
  };

  return (
    <Alert variant="destructive" className={cn("my-4", className)}>
      {getIcon()}
      <AlertTitle>{title || getDefaultTitle()}</AlertTitle>
      <AlertDescription className="mt-2">
        {message}
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-3 w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
