'use client';

import { ErrorView } from "@/components/error/ErrorView";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorView
      title="Oops! Algo deu errado"
      message="Desculpe pelo inconveniente. Por favor, tente novamente."
      onRetry={reset}
    />
  );
}
