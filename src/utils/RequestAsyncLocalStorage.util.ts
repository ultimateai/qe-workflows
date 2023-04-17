import { AsyncLocalStorage } from 'async_hooks';

export const requestAsyncLocalStorage: AsyncLocalStorage<{ correlationId: string }> = new AsyncLocalStorage();
