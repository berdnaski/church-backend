import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    let mensagem = exceptionResponse.message || 'Ocorreu um erro inesperado';
    if (Array.isArray(mensagem)) {
      mensagem = mensagem[0];
    }

    if (mensagem === 'Forbidden resource' || mensagem === 'Forbidden') {
      mensagem = 'Acesso negado. Você não possui permissão para acessar este recurso.';
    } else if (mensagem === 'Unauthorized') {
      mensagem = 'Sessão expirada ou inválida. Por favor, faça login novamente.';
    }

    response.status(status).json({
      statusCode: status,
      mensagem: mensagem,
      tipo: this.obterTipoErro(status),
      timestamp: new Date().toISOString(),
      detalhes: exceptionResponse.error || this.obterTipoErro(status),
    });
  }

  private obterTipoErro(status: number): string {
    const tiposErro = {
      400: 'Erro de Validação',
      401: 'Autenticação Necessária',
      403: 'Permissão Negada',
      404: 'Recurso Não Encontrado',
      409: 'Conflito de Dados',
      422: 'Dados Inválidos',
      500: 'Erro Interno do Sistema',
    };

    return tiposErro[status] || 'Erro Desconhecido';
  }
}
