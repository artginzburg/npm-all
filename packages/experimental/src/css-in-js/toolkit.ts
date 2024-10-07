import { parseUnitString } from '../strong-ts/typed-string';

import { media } from './media-queries';

export const hideScrollbar = `
  &::-webkit-scrollbar {
    width: 1px;
    height: 1px;
  }
  &::-webkit-scrollbar-button {
    width: 1px;
    height: 1px;
  }

  scrollbar-width: none; /* Firefox */
`;
export const hideScrollbarPrecisely = `
  &::-webkit-scrollbar, &::-webkit-scrollbar-button {
    display: none;
  }
`;

/** Rewrote this tool in order to not rely on userAgent, but instead check if the device actually supports -webkit-line-clamp */
export function enableEllipsis(lineClamp = 1) {
  return `
    overflow: hidden;
    text-overflow: ellipsis;

    ${
      lineClamp
        ? `
          white-space: nowrap;

          @supports (-webkit-line-clamp: ${lineClamp}) {
            white-space: initial;

            display: -webkit-box;
            -webkit-line-clamp: ${lineClamp};
            -webkit-box-orient: vertical;
          }
        `
        : `
          white-space: nowrap;
        `
    }
  `;
}

export function limitItemsVisibleInCarousel<Gap extends string>(
  itemsQuantity: number,
  gap: Gap,
  round: false | number = 2,
) {
  const [gapValue, gapUnit] = parseUnitString(gap);
  const gapsTotal = gapValue * (itemsQuantity - 1);
  const percentage = 100 / itemsQuantity;
  const percentageRounded = round === false ? percentage : Number(percentage.toFixed(round));
  const subtracted = gapsTotal / itemsQuantity;
  const calcString = `calc(${percentageRounded}% - ${subtracted}${gapUnit})` as const;
  return calcString;
}

export const rangePseudo = {
  track: {
    webkit: '::-webkit-slider-runnable-track',
    mozilla: '::-moz-range-track',
  },
  thumb: {
    webkit: '::-webkit-slider-thumb',
    mozilla: '::-moz-range-thumb',
  },
  progress: {
    mozilla: '::-moz-range-progress',
  },
} as const;
export const rangeUniversal = {
  track(style: string) {
    return `
      &${rangePseudo.track.webkit} {
        ${style}
      }
      &${rangePseudo.track.mozilla} {
        ${style}
      }
    `;
  },
  thumb(style: string) {
    return `
      &${rangePseudo.thumb.webkit} {
        ${style}
      }
      &${rangePseudo.thumb.mozilla} {
        ${style}
      }
    `;
  },
};

export function hoverMobileSafe(style: string) {
  return `
    ${media.hoverNonTouch} {
      &:hover {
        ${style}
      }
    }
    &:active {
      ${style}
    }
  `;
}
