import { env } from './generated';
import { Environment } from './type';

export const environment = {
  production: true,
  hatenaApiKey: env.hatenaBlogApi,
} satisfies Environment;
