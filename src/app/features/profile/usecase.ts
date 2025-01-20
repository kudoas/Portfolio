import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Provider } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { Article } from './types';

export type ZennArticleResponse = {
  articles: ZennArticle[];
};

export type ZennArticle = {
  id: number;
  title: string;
  path: string;
  published_at: string | null;
};

export function provideProfileUsecase(instance?: ProfileUsecase): Provider[] {
  return [
    {
      provide: ProfileUsecase,
      useFactory: () => instance ?? new ProfileUsecase(),
    },
  ];
}

@Injectable()
export class ProfileUsecase {
  readonly #httpClient = inject(HttpClient);

  async getArticles(): Promise<Article[]> {
    const [zennArticles, hatenaArticles] = await Promise.all([
      this.#getZennArticles(),
      this.#getHatenaArticles(),
    ]);
    return [...zennArticles, ...hatenaArticles];
  }

  async #getZennArticles(): Promise<Article[]> {
    const res = await lastValueFrom(
      this.#httpClient.get<ZennArticleResponse>('/api/zenn/articles?username=da1chi'),
    );

    return res.articles
      .filter(({ published_at }) => published_at)
      .map(({ id, title, path, published_at }) => ({
        id: String(id),
        title,
        url: `https://zenn.dev${path}`,
        publishedAt: new Date(published_at!),
        kind: 'zenn',
      }));
  }

  async #getHatenaArticles(): Promise<Article[]> {
    const username = 'da1chi24';
    // const blogId = 'da1chi.hatenablog.jp';
    const apiKey = environment.hatenaApiKey;
    const res = await lastValueFrom(
      this.#httpClient.get('/api/hatena', {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${apiKey}`)}`,
        },
        responseType: 'text',
      }),
    );
    const parser = new DOMParser();
    const arr = Array.from(
      parser.parseFromString(res, 'application/xml').querySelectorAll('entry'),
    ).map((item) => {
      const id = item.querySelector('id')?.textContent ?? '';
      const title = item.querySelector('title')?.textContent ?? '';
      const url = item.querySelector('link[rel="alternate"]')?.getAttribute('href') ?? '';
      const publishedAt = item.querySelector('published')?.textContent;
      const draftElement = item.getElementsByTagName('app:draft')[0];
      const isDraft = draftElement ? draftElement.textContent === 'yes' : false;
      return {
        id,
        title,
        url,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        kind: 'hatena',
        isDraft,
      } as const;
    });
    return arr
      .filter((item) => !item.isDraft)
      .map(({ id, title, url, publishedAt, kind }) => ({ id, title, url, publishedAt, kind }));
  }
}
