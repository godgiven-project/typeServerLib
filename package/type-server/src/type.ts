export type methodType = 'GET' | 'POST';

export interface ApiResponseInterface
{
  [key: string]: string | number | boolean | Record<string, unknown> | undefined;
  ok: boolean;
  errorCode?: number;
  description: string;
  data?: Record<string, unknown>;
  apiVersion?: string;
}