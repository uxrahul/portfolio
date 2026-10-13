import { resumeHref } from './resume.mjs';

export type NavigationItem = {
  id: string;
  label: string;
  href?: string;
  children?: NavigationItem[];
  expanded?: boolean;
  newTab?: boolean;
};

// No href until a real page exists. This is the user-approved global hierarchy.
export const navigation: NavigationItem[] = [
  { id: 'about', label: 'About', href: '/' },
  {
    id: 'ganance', label: 'Work at Ganance', expanded: true,
    children: [
      { id: 'heir', label: 'Case study', href: '/heir/' },
      {
        id: 'ganance-gallery', label: 'Product Gallery', expanded: false,
        children: [
          { id: 'phase-one', label: 'Phase one' },
          { id: 'phase-two', label: 'Phase two' },
          { id: 'face-scan', label: 'Face scan' },
        ],
      },
    ],
  },
  {
    id: 'lira', label: 'Work at Lira', expanded: false,
    children: [
      { id: 'lira-case-study', label: 'Case study' },
      {
        id: 'lira-gallery', label: 'Product Gallery', expanded: false,
        children: [{ id: 'lira-mvp', label: 'Initial MVP' }],
      },
    ],
  },
  { id: 'resume', label: 'Resume', newTab: true,
    href: resumeHref },
];
