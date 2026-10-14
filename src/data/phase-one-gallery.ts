import { parse } from 'yaml';
import metadata from './heir-phase-one-gallery.yml?raw';
import { phaseOneImages } from './phase-one-images';
import type { ImageMetadata } from 'astro';

type Placement = { asset_id: string; caption: string };
type Asset = { role: 'design'; alt: string; included_in_document: boolean };
type GalleryImage = Placement & Asset & { src: ImageMetadata };
type Story = { id: string; title: string; explanation: string; screens: Placement[] };
type Chapter = { id: string; title: string; stories: Story[] };
const source = parse(metadata) as { title: string; intro: string; chapters: Chapter[]; assets: Record<string, Asset> };
function resolveImage(placement: Placement, role: Asset['role']): GalleryImage {
  const asset = source.assets[placement.asset_id];
  const src = phaseOneImages[placement.asset_id];
  if (!asset?.included_in_document || asset.role !== role || !src) throw new Error(`Invalid gallery placement: ${placement.asset_id}`);
  return { ...asset, ...placement, src };
}
export const phaseOneGallery = {
  title: source.title,
  intro: source.intro,
  chapters: source.chapters.map((chapter) => ({ ...chapter, stories: chapter.stories.map((story) => ({
    ...story,
    screens: story.screens.map((image) => resolveImage(image, 'design')),
  })) })),
};
