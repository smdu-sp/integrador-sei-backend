export interface SistemaPayload {
  sub: string;
  nome: string;
  sigla: string;
  identificacao: string;
  iat?: number;
  exp?: number;
}
