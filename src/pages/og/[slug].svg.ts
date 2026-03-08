import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getCollection('articles');
  return articles.map((article) => ({
    params: { slug: article.slug },
    props: { title: article.data.title },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { title } = props as { title: string };

  // Split title into lines that fit the SVG width
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (test.length > 32) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  const titleY = lines.length <= 2 ? 260 : 230;
  const lineHeight = 52;

  const titleLines = lines
    .map(
      (line, i) =>
        `<text x="80" y="${titleY + i * lineHeight}" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="bold" fill="#e6e6e6">${escapeXml(line)}</text>`
    )
    .join('\n    ');

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0c1a19;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f2926;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#2dd4a8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Accent line -->
  <rect x="80" y="180" width="80" height="4" rx="2" fill="url(#accent)" />

  <!-- Title -->
  ${titleLines}

  <!-- Author -->
  <text x="80" y="${titleY + lines.length * lineHeight + 50}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="22" fill="#5e9e94">Abe Crystal, PhD</text>

  <!-- Site name -->
  <text x="80" y="560" font-family="'Helvetica Neue', Arial, sans-serif" font-size="18" font-weight="600" letter-spacing="2" fill="#3d6e66">MOREBETTERLABS</text>

  <!-- Subtle grid pattern -->
  <line x1="1100" y1="0" x2="1100" y2="630" stroke="#1a3d38" stroke-width="0.5" />
  <line x1="0" y1="100" x2="1200" y2="100" stroke="#1a3d38" stroke-width="0.5" />
  <line x1="0" y1="530" x2="1200" y2="530" stroke="#1a3d38" stroke-width="0.5" />
</svg>`;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
