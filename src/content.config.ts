import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const pageLink = z.union([z.literal(false), z.object({ link: z.string(), label: z.string() })]);

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
    schema: z.object({
      title: z.string(), description: z.string(),
      tableOfContents: z.boolean().default(true),
      tocSections: z.array(z.string()).optional(),
      prev: pageLink.default(false), next: pageLink.default(false),
    }),
  }),
};
