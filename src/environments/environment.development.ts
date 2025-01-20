import { env } from './generated';
import { Environment } from './type';

export const environment = {
  production: false,
  hatenaApiKey: env.hatenaBlogApi,
} satisfies Environment;
