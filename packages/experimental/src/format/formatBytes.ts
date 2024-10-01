const units = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const unitsBase1000 = units.map((size) => size.replace('i', ''));

export const BytesBase = {
  Standard: 1024,
  Simplified: 1000,
} as const;

/** Note: macOS uses base = 1000 to display the size in File Info */
export function formatBytes(
  bytes: number,
  decimals = 2,
  /** @default 1024 */
  base: (typeof BytesBase)[keyof typeof BytesBase] = BytesBase.Standard,
) {
  if (!+bytes) return '0 Bytes';

  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(bytes) / Math.log(base));

  return `${parseFloat((bytes / Math.pow(base, i)).toFixed(dm))} ${(base === BytesBase.Simplified ? unitsBase1000 : units)[i]}`;
}
