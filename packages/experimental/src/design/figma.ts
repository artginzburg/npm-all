export function letterSpacingPercent(
  /** Not a coefficient. Used to take values directly from Figma. */
  percents: number,
) {
  return `${percents / 100}em` as const;
}

export const figmaLineHeightAuto = 1;
