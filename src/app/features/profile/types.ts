export type SocialLink = {
  label: string;
  url: string;
  name: string;
};

export type Article = {
  id: string;
  title: string;
  url: string;
  publishedAt: Date;
  kind: 'zenn' | 'hatena';
};
