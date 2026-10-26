/** Pure visit state: viewport sampling is owned by heir-analytics.ts. */
export type EntryMethod = 'scroll' | 'toc' | 'deep_link';
export type SectionInfo = { section_title: string; section_id: string; section_index: number };
export type HeirEvents = {
  heir_section_view: SectionInfo & { entry_method: EntryMethod };
  heir_section_engagement: SectionInfo & { active_seconds: number; duration_bucket: string };
  heir_toc_click: SectionInfo;
  heir_scroll_depth: { depth_percent: number; entry_method: EntryMethod; sections_viewed: number };
  heir_article_end: { active_seconds: number; toc_used: boolean; sections_viewed: number; depth_percent: number; entry_method: EntryMethod };
  heir_resource_click: SectionInfo & { resource_label: string; resource_category: string; destination: string };
};
export type ObservationName = Exclude<keyof HeirEvents, 'heir_toc_click' | 'heir_resource_click'>;
export type HeirSink = <K extends ObservationName>(name: K, properties: HeirEvents[K]) => void;
export type ReadingSample = {
  now: number; eligible: boolean; section?: SectionInfo; depth: number; atEnd: boolean; method: EntryMethod;
};
export const VIEW_DWELL_MS = 1000;
export const IDLE_MS = 45_000;
export function choosePrimary<T extends SectionInfo>(visible: { section: T; start: number; end: number; overlap: number }[],
  preferred: string | undefined, finalId: string, atEnd: boolean, line: number): T | undefined {
  return (visible.find(({ section }) => section.section_id === preferred)
    ?? (atEnd ? visible.find(({ section }) => section.section_id === finalId) : undefined)
    ?? visible.find((item) => item.start <= line && item.end > line)
    ?? visible.reduce<(typeof visible)[number] | undefined>((best, item) => !best || item.overlap > best.overlap ? item : best, undefined))?.section;
}
const seconds = (ms: number) => Math.round(ms / 100) / 10;
export const durationBucket = (ms: number) => ms < 10_000 ? '2-9s' : ms < 30_000 ? '10-29s'
  : ms < 60_000 ? '30-59s' : ms < 120_000 ? '60-119s' : '120s+';

export class HeirVisit {
  readonly viewed = new Set<string>();
  readonly depths = new Set<number>();
  private segments = new Map<string, number>();
  private previous?: ReadingSample;
  private segmentMs = 0;
  private stableMs = 0;
  private bandMs = 0;
  private endMs = 0;
  private totalMs = 0;
  private ended = false;
  tocUsed = false;
  constructor(private send: HeirSink) {}

  settled(id: string) { return this.previous?.section?.section_id === id && this.stableMs >= VIEW_DWELL_MS; }

  update(sample: ReadingSample, activeUntil: number) {
    const before = this.previous;
    const dt = before?.eligible ? Math.max(0, Math.min(sample.now, activeUntil) - before.now) : 0;
    this.totalMs += dt;
    if (before?.section) this.segmentMs += dt;
    const same = before?.section?.section_id === sample.section?.section_id;
    const continuing = Boolean(before?.eligible && sample.eligible);
    if (!same || !sample.eligible) this.flush(before?.section);
    this.stableMs = continuing && same ? this.stableMs + dt : 0;
    const band = Math.floor(sample.depth / 25) * 25;
    this.bandMs = continuing && Math.floor(before!.depth / 25) * 25 === band ? this.bandMs + dt : 0;
    this.endMs = continuing && before!.atEnd && sample.atEnd ? this.endMs + dt : 0;
    if (sample.eligible) {
      if (sample.section && this.stableMs >= VIEW_DWELL_MS && !this.viewed.has(sample.section.section_id)) {
        this.viewed.add(sample.section.section_id);
        this.send('heir_section_view', { ...sample.section, entry_method: sample.method });
      }
      // Only the settled destination band counts. Never backfill skipped bands.
      if (band >= 25 && this.bandMs >= VIEW_DWELL_MS && !this.depths.has(band)) {
        this.depths.add(band);
        this.send('heir_scroll_depth', { depth_percent: band, entry_method: sample.method, sections_viewed: this.viewed.size });
      }
      if (sample.atEnd && this.endMs >= VIEW_DWELL_MS && !this.ended) {
        this.ended = true;
        this.send('heir_article_end', { active_seconds: seconds(this.totalMs), toc_used: this.tocUsed,
          sections_viewed: this.viewed.size, depth_percent: 100, entry_method: sample.method });
      }
    }
    this.previous = sample;
  }

  private flush(section?: SectionInfo) {
    const count = section ? this.segments.get(section.section_id) ?? 0 : 0;
    // At most three meaningful segments per section per visit; total active time
    // continues accumulating even after that reporting cap is reached.
    if (section && this.viewed.has(section.section_id) && this.segmentMs >= 2000 && count < 3) {
      this.segments.set(section.section_id, count + 1);
      this.send('heir_section_engagement', { ...section, active_seconds: seconds(this.segmentMs), duration_bucket: durationBucket(this.segmentMs) });
    }
    this.segmentMs = 0;
  }
}
