import { Component, inject, OnInit } from '@angular/core';
import { LinksComponent } from './links/links.component';
import { SocialLink } from './types';
import { ProfileUsecase, provideProfileUsecase } from './usecase';
import { provideProfileState } from './state';

@Component({
  selector: 'app-profile',
  imports: [LinksComponent],
  template: `
    <main class="md:mx-40 font-mono">
      <section>
        <h1 class="text-center mt-10 mb-5 font-bold text-3xl tracking-wide whitespace-nowrap">
          About Me
        </h1>
        <div class="flex flex-col items-center md:flex-row justify-center">
          <div class="flex flex-col items-center min-w-[220px] min-h-[208px]">
            <img
              src="icon.png"
              alt="icon"
              class="w-52 aspect-square rounded-full border border-solid border-gray-300"
            />
            <p class="md:mb-0 mt-4 mb-1 text-lg font-bold text-center">da1chi<br />(Daichi Kudo)</p>
          </div>
          <app-profile-links [links]="socialLinks" />
        </div>
      </section>
    </main>
  `,
  providers: [provideProfileUsecase(), provideProfileState()],
})
export class ProfileComponent implements OnInit {
  readonly #usecase = inject(ProfileUsecase);

  readonly socialLinks: SocialLink[] = [
    { label: 'GitHub', name: 'kudoas', url: `https://github.com/kudoas` },
    { label: 'X (Twitter)', name: 'da1chi24', url: 'https://x.com/da1chi24' },
    { label: 'Bluesky', name: 'da1chi', url: 'https://bsky.app/profile/da1chi.bsky.social' },
    { label: 'Zenn', name: 'da1chi', url: 'https://zenn.dev/da1chi' },
    { label: 'Hatena Blog', name: '/var/log/da1', url: 'https://da1chi.hatenablog.jp/' },
    { label: 'Consence', name: '液溜まり', url: 'https://scrapbox.io/da1chi-tech/' },
  ];

  ngOnInit(): void {
    this.#usecase.getArticles();
  }
}
