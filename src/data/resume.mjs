import { existsSync } from 'node:fs';

// Build-time availability only; never render a link to a missing PDF.
// Astro runs from the project root; module URLs change during SSR bundling.
export const resumeHref = existsSync('public/resume.pdf')
  ? '/resume.pdf' : undefined;
