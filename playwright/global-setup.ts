import { request } from '@playwright/test';
import { ENV } from './config/env';

export default async function globalSetup(): Promise<void> {
    const apiContext = await request.newContext({
        baseURL: ENV.apiUrl,
    });

    const response = await apiContext.post('/testData/seed');
    if (!response.ok()) {
        throw new Error(`Global DB seed failed: ${response.status()}`);
    }

    await apiContext.dispose();
}