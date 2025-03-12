import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

/**
 * Middleware para registrar logs de requisições
 * Para rotas de autenticação, registra apenas o nome do usuário
 * Para outras rotas, registra URL e body completo
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const url = req.originalUrl || req.url;
  
  // Verificar se é uma rota de autenticação
  const isAuthRoute = url.includes('/signin') || url.includes('/signup') || url.includes('/signout');
  
  if (isAuthRoute) {
    // Para rotas de autenticação, extrair apenas o nome do usuário
    const username = req.body.username || req.body.email || 'usuário não identificado';
    logger.info(`Requisição de autenticação: ${url}, Usuário: ${username}`);
  } else {
    // Para outras rotas, registrar URL e body completo
    const bodyString = JSON.stringify(req.body) || '{}';
    logger.info(`URL: ${url}, Método: ${req.method}, Body: ${bodyString}`);
  }
  
  // Interceptar a resposta para registrar erros
  const originalSend = res.send;
  res.send = function(body) {
    const statusCode = res.statusCode;
    
    // Registrar erros (status >= 400)
    if (statusCode >= 400) {
      const errorMessage = `Erro na requisição: ${url}, Status: ${statusCode}`;
      
      // Verificar se é rota de autenticação para ocultar corpo da requisição
      const errorDetails = {
        method: req.method,
        url: url,
        statusCode: statusCode,
        // Omitir body se for rota de autenticação
        body: isAuthRoute ? '[INFORMAÇÕES SENSÍVEIS OCULTADAS]' : req.body,
        response: isAuthRoute ? '[RESPOSTA OCULTADA]' : body,
        headers: req.headers
      };
      
      logger.error(errorMessage, errorDetails);
    }
    
    return originalSend.call(this, body);
  };
  
  next();
};

/**
 * Middleware para capturar erros não tratados
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const url = req.originalUrl || req.url;
  const isAuthRoute = url.includes('/signin') || url.includes('/signup') || url.includes('/signout');
  
  const errorMessage = `Erro não tratado na requisição: ${url}`;
  const errorDetails = {
    method: req.method,
    url: url,
    stack: err.stack,
    message: err.message,
    // Omitir body se for rota de autenticação
    body: isAuthRoute ? '[INFORMAÇÕES SENSÍVEIS OCULTADAS]' : req.body
  };
  
  logger.error(errorMessage, errorDetails);
  
  next(err);
}; 