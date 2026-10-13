import type { FigureItem } from './figures';
import image8 from '../assets/heir/product/notifications.png';
import image9 from '../assets/heir/product/silent-alarm.png';
import image10 from '../assets/heir/product/reminders.png';
import image19 from '../assets/heir/product/scan-consent.png';
import image20 from '../assets/heir/product/scan-preparation.png';
import image21 from '../assets/heir/product/scan-finalization.png';
import image22 from '../assets/heir/product/scan-results.png';
import image23 from '../assets/heir/product/scan-explain.png';
import image24 from '../assets/heir/product/scan-repeat.png';

export const hapticScreenItems: FigureItem[] = [
  { id: 'notifications-figure', kind: 'product', src: image8, alt: "Paired HEIR notification screens showing app selection and call alert controls.", captionTitle: "Notifications", caption: "Choose which alerts arrive" },
  { id: 'silent-alarm-figure', kind: 'product', src: image9, alt: "Paired HEIR Silent Alarm screens showing time and repeat settings, followed by the configured alarm.", captionTitle: "Silent Alarm", caption: "Set a recurring alarm" },
  { id: 'reminders-figure', kind: 'product', src: image10, alt: "Paired HEIR Reminders screens showing a recurring reminder window and the configured reminder.", captionTitle: "Reminders", caption: "Define a reminder window" },
];

export const healthScanItems: FigureItem[] = [
  { id: 'scan-consent-figure', kind: 'product', src: image19, alt: "HEIR consent screen explaining on-device processing, privacy safeguards, and consent.", captionTitle: "Consent", caption: "Make on-device processing and consent clear before the user continues." },
  { id: 'scan-preparation-figure', kind: 'product', src: image20, alt: "HEIR scan preparation screen with rest, lighting, face framing, and stillness instructions.", captionTitle: "Preparation", caption: "Turn rest, lighting, framing and stillness into concrete instructions." },
  { id: 'scan-finalization-figure', kind: 'product', src: image21, alt: "HEIR scan capture screen indicating capture is complete and results are processing.", captionTitle: "Finalization", caption: "Distinguish completed capture from results that are still processing." },
  { id: 'scan-results-figure', kind: 'product', src: image22, alt: "HEIR Health Scan results screen combining scan quality, a summary, and individual readings.", captionTitle: "Results", caption: "Bring scan quality, a brief summary and individual readings together." },
  { id: 'scan-explain-figure', kind: 'product', src: image23, alt: "HEIR BP Outlook explanation screen describing the estimate, calculation, and limits.", captionTitle: "Explain", caption: "Explain what the estimate represents, how it is derived and its limits." },
  { id: 'scan-repeat-figure', kind: 'product', src: image24, alt: "HEIR routine screen with timing preferences and reminder controls.", captionTitle: "Repeat", caption: "Make a consistent check-in actionable through timing and reminder choices." },
];
