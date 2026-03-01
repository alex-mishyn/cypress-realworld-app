import { ENV } from '../config/env';

export function compareWithBaseURL(url: string): boolean {
  return url === ENV.baseUrl;
}

export function urlCheck(url: string, pageUrl: string): boolean {
  return url === `${ENV.baseUrl}${pageUrl}`;
}