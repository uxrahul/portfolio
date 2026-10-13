import type { ImageMetadata } from 'astro';

export type FigureKind = 'plot' | 'product' | 'photo';
export interface FigureProps {
  src: ImageMetadata;
  alt: string;
  caption?: string;
  captionTitle?: string;
  eager?: boolean;
  widths?: number[];
  sizes?: string;
}
export interface FigureItem extends FigureProps {
  id: string;
  kind: FigureKind;
}
