import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Build-time availability and content version; replaced PDFs bypass browser caches.
// Astro runs from the project root; module URLs change during SSR bundling.
export const resumeHref = existsSync('public/resume.pdf')
  ? `/resume.pdf?v=${createHash('sha256').update(readFileSync('public/resume.pdf')).digest('hex').slice(0, 12)}`
  : undefined;
