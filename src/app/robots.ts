import type { MetadataRoute } from "next";

const BLOCKED_AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'CCBot',
  'ClaudeBot',
  'anthropic-ai',
  'Bytespider',
  'PerplexityBot',
  'Google-Extended',
  'FacebookBot',
  'cohere-ai',
  'Amazonbot',
  'Omgilibot',
  'Diffbot',
];

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anirban.ca";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
            },
            ...BLOCKED_AI_BOTS.map((bot) => ({
                userAgent: bot,
                disallow: ["/"],
            })),
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
