import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE_URL = 'https://morebetterlabs.com';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');

  const staticPages = [
    { url: '/', lastmod: '2026-03-01' },
    { url: '/about/', lastmod: '2026-03-01' },
    { url: '/projects/', lastmod: '2026-03-01' },
    { url: '/learning-design/', lastmod: '2026-03-01' },
    { url: '/faq/', lastmod: '2026-03-08' },
  ];

  const articlePages = articles.map((article) => ({
    url: `/learning-design/${article.slug}/`,
    lastmod: article.data.updatedDate || article.data.publishDate,
  }));

  const allPages = [...staticPages, ...articlePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
