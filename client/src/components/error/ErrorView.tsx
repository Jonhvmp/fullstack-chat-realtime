import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({
  title = "Algo deu errado",
  message = "Ocorreu um erro inesperado. Por favor, tente novamente.",
  onRetry
}: ErrorViewProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground text-center mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
