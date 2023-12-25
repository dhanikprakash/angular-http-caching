// caching.interceptor.ts

import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    private cache = new Map<string, { data: any; timestamp: number }>();
    private maxCacheSize = 100; // Adjust as needed
    private cacheExpiry = 60 * 60 * 1000; // Cache expiry time in milliseconds

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (request.method !== 'GET') {
            return next.handle(request);
        }

        const cachedItem = this.cache.get(request.url);

        if (cachedItem && this.isCacheValid(cachedItem)) {
            return of(new HttpResponse({ body: cachedItem.data }));
        }

        return next.handle(request).pipe(
            tap((event) => {
                if (event instanceof HttpResponse) {
                    this.cache.set(request.url, {
                        data: event.body,
                        timestamp: Date.now(),
                    });
                    this.cleanCache();
                }
            })
        );
    }

    private isCacheValid(cachedItem: { data: any; timestamp: number }): boolean {
        return Date.now() - cachedItem.timestamp < this.cacheExpiry;
    }

    private cleanCache() {
        if (this.cache.size > this.maxCacheSize) {
            // Remove oldest items if the cache size exceeds the limit
            let oldestKey: string | undefined;
            let oldestTimestamp = Number.MAX_SAFE_INTEGER;

            this.cache.forEach((value, key) => {
                if (value.timestamp < oldestTimestamp) {
                    oldestTimestamp = value.timestamp;
                    oldestKey = key;
                }
            });

            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }
    }
}
