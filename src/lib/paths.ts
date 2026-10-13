/** Prefix internal destinations; preserve external URLs and same-page anchors. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (!path.startsWith('/') || path.startsWith('//') || !base || path === base || path.startsWith(base + '/')) return path;
  return base + path;
}
export function withoutBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base && (path === base || path.startsWith(base + '/')) ? path.slice(base.length) || '/' : path;
}
