import { Injectable } from '@nestjs/common';
import { CacheEntry } from './interfaces/cache-entry.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private readonly cache = new Map<string, CacheEntry<unknown>>();
  private readonly ttl: number;

  constructor(private readonly configService: ConfigService) {
    this.ttl = Number(this.configService.get('CACHE_TTL', '300')) * 1000;
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() >= entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  getStatus() {
    const now = Date.now();

    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      status: now < entry.expiresAt ? 'HIT' : 'EXPIRED',
      expiresInSeconds: Math.max(0, Math.round(entry.expiresAt - now) / 1000),
    }));

    return entries;
  }

  clear(): void {
    this.cache.clear();
  }
}
