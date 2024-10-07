export const rawMedia = {
  /** Enable hover only on non-touch devices */
  hoverNonTouch: '(hover: hover) and (pointer: fine)',
  prefersReducedMotion: '(prefers-reduced-motion)',
  prefersColorSchemeDark: '(prefers-color-scheme: dark)',
  touchOnly: '(hover: none)',
} as const;

export const media = {
  /** Enable hover only on non-touch devices */
  hoverNonTouch: `@media ${rawMedia.hoverNonTouch}`,
  prefersReducedMotion: `@media ${rawMedia.prefersReducedMotion}`,
  prefersColorSchemeDark: `@media ${rawMedia.prefersColorSchemeDark}`,
  touchOnly: `@media ${rawMedia.touchOnly}`,
} as const;
