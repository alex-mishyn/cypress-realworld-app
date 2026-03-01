import { request } from '@playwright/test';
import { ENV } from './config/env';

export default async function globalTeardown(): Promise<void> {
    const apiContext = await request.newContext({
        baseURL: ENV.apiUrl,
    });

    const response = await apiContext.post('/testData/seed');
    if (!response.ok()) {
        console.warn(`DB reset after test run failed: ${response.status()}`);
    }

    await apiContext.dispose();
}
