import groupBy from 'object.groupby';

import { groupDeviceSizes, parsedTable } from '../apple-device-sizes';

const groupedAppleDeviceSizes = groupDeviceSizes(parsedTable);

export const appleDeviceSizesWithSlugs = groupedAppleDeviceSizes.map((deviceSize) => ({
  ...deviceSize,
  slug: `${deviceSize.width}x${deviceSize.height}_${deviceSize.pixelRatio}.png`,
}));

const appleDeviceSizesIndexed = groupBy(appleDeviceSizesWithSlugs, ({ slug }) => slug);

export function getAppleDeviceSizeBySlug(slug: (typeof appleDeviceSizesWithSlugs)[number]['slug']) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return appleDeviceSizesIndexed[slug]![0]!;
}
