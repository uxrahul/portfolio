import { parse } from 'yaml';
import metadata from './heir-face-scan-gallery.yml?raw';
import { faceScanImages } from './face-scan-images';
import type { ImageMetadata } from 'astro';

type Placement = { asset_id: string; caption: string };
type Asset = { role: 'reference' | 'design'; alt: string; source_credit?: string; included_in_document: boolean };
export type GalleryImage = Placement & Asset & { src: ImageMetadata };
type Story = { id: string; title: string; explanation: string; references: Placement[]; screens: Placement[] };
type Chapter = { id: string; title: string; stories: Story[] };
const source = parse(metadata) as { title: string; intro: string; chapters: Chapter[]; assets: Record<string, Asset> };
function resolveImage(placement: Placement, role: Asset['role']): GalleryImage {
  const asset = source.assets[placement.asset_id];
  const src = faceScanImages[placement.asset_id];
  if (!asset?.included_in_document || asset.role !== role || !src) throw new Error(`Invalid gallery placement: ${placement.asset_id}`);
  return { ...asset, ...placement, src };
}
export const faceScanGallery = {
  title: source.title,
  intro: source.intro,
  chapters: source.chapters.map((chapter) => ({ ...chapter, stories: chapter.stories.map((story) => ({
    ...story,
    references: story.references.map((image) => resolveImage(image, 'reference')),
    screens: story.screens.map((image) => resolveImage(image, 'design')),
  })) })),
};
