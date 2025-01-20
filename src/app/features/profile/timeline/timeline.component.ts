import { Component, computed, input } from '@angular/core';

import { Article } from '../types';

@Component({
  selector: 'app-profile-timeline',
  imports: [],
  template: `
    @let timelines = displayTimelines();
    <div class="flex flex-col">
      @for (timeline of timelines; track timeline.id) {
        <article class="mt-4">
          <div class="text-xs text-gray-400">{{ timeline.publishedAt }}</div>
          <h2 class="text-lg">
            <a class="font-bold" [href]="timeline.url">
              <span class="underline hover:text-gray-500">{{ timeline.title }}</span>
            </a>
          </h2>
          <!-- label -->
          @switch (timeline.kind) {
            @case ('zenn') {
              <span class="text-sm bg-[#3ea8ff] text-white px-1 rounded-md">Zenn</span>
            }
            @case ('hatena') {
              <span class="text-sm bg-gray-500 text-white px-1 rounded-md">Hatena</span>
            }
          }
        </article>
      }
    </div>
  `,
})
export class TimelineComponent {
  readonly timelines = input.required<Article[]>();
  readonly displayTimelines = computed(() =>
    this.timelines()
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .map(({ id, title, url, publishedAt, kind }) => ({
        id,
        title,
        url,
        publishedAt: publishedAt.toLocaleDateString(),
        kind,
      })),
  );
}
