import type { ImageMetadata } from 'astro';
import adaptiveTarget from '../assets/heir/product/adaptive-target.png';
import paceCard from '../assets/heir/product/pace-card.png';

export interface GalleryItem {
  id: string;
  src: ImageMetadata;
  alt: string;
  caption: string;
  sourceId: string;
}

export interface GallerySection {
  id: string;
  title: string;
  items: GalleryItem[];
}

// Representative assets only, not a published full-gallery destination.
export const activityGalleryItems: GalleryItem[] = [
  {
    id: 'heir-adaptive-target-screen', src: adaptiveTarget,
    alt: 'HEIR app showing a personal Adaptive Target alongside the primary step goal.',
    caption: 'Personal target shown alongside the primary goal',
    sourceId: 'heir-activity-adaptive-target',
  },
  {
    id: 'heir-pace-card-screen', src: paceCard,
    alt: 'HEIR Pace card showing sedentary, casual, and active movement during a tracked day.',
    caption: 'Pace card showing the composition of a tracked day',
    sourceId: 'heir-activity-pace-card',
  },
];
