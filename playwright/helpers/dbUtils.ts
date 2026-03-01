import { APIRequestContext } from '@playwright/test';
import { ENV } from '../config/env';

const API_URL = ENV.apiUrl;

export async function seedDatabase(request: APIRequestContext): Promise<void> {
  const response = await request.post(`${API_URL}/testData/seed`);
  if (!response.ok()) {
    throw new Error(`DB seed failed: ${response.status()} ${await response.text()}`);
  }
}