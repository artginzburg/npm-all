import { appleDeviceSizesWithSlugs } from './shared';

import type { AppleWebApp } from 'next/dist/lib/metadata/types/extra-types';

export function createSplashScreenMetadata(
  /** @default '/splash-screen/' */
  urlBase = '/splash-screen/',
): AppleWebApp['startupImage'] {
  return appleDeviceSizesWithSlugs.map(({ slug, width, height, pixelRatio }) => ({
    url: `${urlBase}${slug}`,
    media: `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${pixelRatio})`,
  }));
}
