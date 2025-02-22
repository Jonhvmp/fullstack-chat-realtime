import { Request, Response, NextFunction } from 'express';

// Middleware de tratamento de erros
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(`Erro no tratamento da rota ${req.path}:`, err);

  if (res.headersSent) {
    // Se os cabeçalhos já foram enviados, delega o erro ao Express
    return next(err);
  }

  // Erros de validação
  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: "Erro de validação.",
      errors: err.errors,
    });
    return;
  }

  // Tratamento para mensagens específicas
  switch (err.message) {
    case "Token inválido ou expirado":
      res.status(400).json({ success: false, message: err.message });
      return;
    case "Usuário não encontrado":
      res.status(404).json({ success: false, message: "E-mail não encontrado." });
      return;
    default:
      break;
  }

  // Tratamento genérico
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Erro interno do servidor.",
    details: err.details || null, // Detalhes adicionais, se existirem
  });
};
