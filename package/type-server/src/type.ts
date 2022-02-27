export type methodType = 'GET' | 'POST';

export interface ApiResponseInterface
{
  [key: string]: string | number | boolean | Record<string, unknown> | undefined | Array<Record<string, unknown>>;
  ok: boolean;
  errorCode?: number;
  description: string;
  data?: Record<string, unknown> | Array<Record<string, unknown>>;
  apiVersion?: string;
}
